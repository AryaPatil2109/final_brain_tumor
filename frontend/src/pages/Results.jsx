import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  RotateCcw,
} from "lucide-react";

import MRIViewer from "../components/MRIViewer";
import PredictionCard from "../components/PredictionCard";
import GradCAMViewer from "../components/GradCAMViewer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

/* =====================================================
   HELPERS
===================================================== */

const getBackendUrl = (url) => {
  if (!url) return null;

  if (
    typeof url === "string" &&
    (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    )
  ) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/* =====================================================
   DISPLAY NAME
===================================================== */

const getDisplayName = (prediction) => {
  if (!prediction) return "Unknown";

  const names = {
    glioma: "Glioma",
    meningioma: "Meningioma",
    pituitary: "Pituitary Tumor",
    notumor: "No Tumor",
    no_tumor: "No Tumor",
    "no tumor": "No Tumor",
  };

  return (
    names[String(prediction).toLowerCase()] ||
    prediction
  );
};

/* =====================================================
   NORMALIZE COMPLETE RESULT
===================================================== */

const normalizeResult = (backendResult) => {
  if (!backendResult) {
    return null;
  }

  let raw = backendResult;

  /*
    Unwrap nested API responses.

    Supports structures such as:
    {
      data: {
        prediction: ...
      }
    }

    or:
    {
      result: {
        prediction: ...
      }
    }
  */

  for (let i = 0; i < 5; i++) {
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw)
    ) {
      break;
    }

    if (
      raw.prediction ||
      raw.predicted_class ||
      raw.predictedClass ||
      raw.class_name ||
      raw.class ||
      raw.label
    ) {
      break;
    }

    const next =
      raw.data ??
      raw.result ??
      raw.prediction_result ??
      raw.predictionResult ??
      raw.response;

    if (!next || next === raw) {
      break;
    }

    raw = next;
  }

  const prediction =
    raw.prediction ||
    raw.predicted_class ||
    raw.predictedClass ||
    raw.class_name ||
    raw.class ||
    raw.label ||
    "Unknown";

  const displayName =
    raw.displayName ||
    raw.display_name ||
    raw.prediction_name ||
    raw.predicted_name ||
    getDisplayName(prediction);

  /*
    Normalize confidence.

    Supports:
    0.932  -> 0.932
    93.2   -> 0.932
    1      -> 1
    100    -> 1
  */

  const rawConfidence =
    raw.confidence ??
    raw.prediction_confidence ??
    raw.score ??
    0;

  const confidenceNumber = Number(rawConfidence);

  let confidence = 0;

  if (Number.isFinite(confidenceNumber)) {
    confidence =
      confidenceNumber > 1
        ? Math.min(confidenceNumber / 100, 1)
        : Math.max(confidenceNumber, 0);
  }

  return {
    ...raw,

    id:
      raw.prediction_id ||
      raw.id ||
      null,

    prediction,

    displayName,

    confidence,

    model:
      raw.model ||
      raw.model_name ||
      raw.modelName ||
      "Hybrid CNN + Morphology",

    filename:
      raw.filename ||
      raw.file_name ||
      raw.original_filename ||
      raw.originalFileName ||
      "Uploaded MRI",

    imageUrl: getBackendUrl(
      raw.image_url ||
      raw.imageUrl ||
      raw.upload_url ||
      raw.uploaded_image_url
    ),

    gradcamUrl: getBackendUrl(
      raw.gradcam_url ||
      raw.gradcamUrl ||
      raw.grad_cam_url ||
      raw.explanation_url
    ),

    gradcamAvailable: Boolean(
      raw.gradcam_url ||
      raw.gradcamUrl ||
      raw.grad_cam_url ||
      raw.explanation_url
    ),
  };
};

/* =====================================================
   FALLBACK

   Only used when /results is opened directly.
===================================================== */

const FALLBACK = {
  prediction: "glioma",
  displayName: "Glioma",
  confidence: 0.932,
  model: "Hybrid CNN + Morphology",
  filename: "demo_mri.jpg",
  imageUrl: null,
  gradcamUrl: null,
};

/* =====================================================
   RESULTS PAGE
===================================================== */

export default function Results() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  /* ===================================================
     LOAD LATEST PREDICTION
  =================================================== */

  useEffect(() => {
    const raw =
      sessionStorage.getItem(
        "latestPrediction"
      );

    if (!raw) {
      console.warn(
        "No latestPrediction found. Using fallback."
      );

      setResult(FALLBACK);
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      console.log(
        "Results raw sessionStorage:",
        parsed
      );

      const normalized =
        normalizeResult(parsed);

      console.log(
        "Results normalized:",
        normalized
      );

      if (!normalized) {
        setResult(FALLBACK);
        return;
      }

      setResult(normalized);
    } catch (error) {
      console.error(
        "Failed to parse latestPrediction:",
        error
      );

      setResult(FALLBACK);
    }
  }, []);

  /* ===================================================
     LOADING
  =================================================== */

  if (!result) {
    return null;
  }

  /* ===================================================
     NO TUMOR CHECK
  =================================================== */

  const isNoTumor =
    String(result.prediction)
      .toLowerCase() === "notumor" ||
    String(result.prediction)
      .toLowerCase() === "no_tumor" ||
    String(result.prediction)
      .toLowerCase() === "no tumor";

  return (
    <main
      style={{
        background: "#061624",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <section
        style={{
          background:
            "linear-gradient(160deg, rgba(0,100,200,0.12) 0%, #020b18 60%)",
          padding: "2rem 0 1.5rem",
          borderBottom:
            "1px solid rgba(0,212,255,0.22)",
        }}
      >
        <div className="container-md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              {/* BACK TO ANALYSIS */}

              <button
                onClick={() =>
                  navigate("/analysis")
                }
                className="btn-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.6rem",
                }}
              >
                <ArrowLeft size={15} />

                Back to Analysis
              </button>

              {/* PAGE TITLE */}

              <h1
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize:
                    "clamp(1.5rem, 3vw, 2rem)",
                  color: "#e2f0ff",
                }}
              >
                Analysis Result
              </h1>

              {/* FILE + MODEL */}

              <p
                style={{
                  marginTop: "0.35rem",
                  color:
                    "rgba(160,200,240,0.65)",
                }}
              >
                {result.filename} ·{" "}
                {result.model}
              </p>
            </div>

            {/* NEW ANALYSIS */}

            <button
              onClick={() =>
                navigate("/analysis")
              }
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <RotateCcw size={15} />

              New Analysis
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="container-md"
        style={{
          padding:
            "2.5rem 1.5rem 4rem",
        }}
      >
        {/* =================================================
            MRI + PREDICTION
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="results-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* =================================================
              MRI
          ================================================= */}

          <section
            style={{
              background:
                "rgba(15,40,90,0.88)",
              border:
                "1px solid rgba(0,212,255,0.22)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow:
                "var(--shadow-card)",
            }}
          >
            <div
              style={{
                color:
                  "rgba(160,200,240,0.65)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "1rem",
                textTransform:
                  "uppercase",
              }}
            >
              Uploaded MRI
            </div>

            <MRIViewer
              imageUrl={
                result.imageUrl
              }
              altText={`Uploaded brain MRI scan — ${result.filename}`}
              caption={
                result.filename
              }
              label="Uploaded Image"
            />
          </section>

          {/* =================================================
              PREDICTION
          ================================================= */}

          <PredictionCard
            prediction={
              result.prediction
            }
            displayName={
              result.displayName
            }
            confidence={
              result.confidence
            }
            model={result.model}
          />
        </motion.div>

        {/* =================================================
            GRAD-CAM
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
          style={{
            background:
              "rgba(15,40,90,0.88)",
            border:
              "1px solid rgba(0,212,255,0.22)",
            borderRadius: "14px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow:
              "var(--shadow-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "1rem",
            }}
          >
            <Eye
              size={18}
              color="var(--color-teal-600)"
            />

            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#e2f0ff",
              }}
            >
              AI Explanation (Grad-CAM)
            </h2>
          </div>

          <GradCAMViewer
            originalUrl={
              result.imageUrl
            }
            gradcamUrl={
              result.gradcamUrl
            }
            displayName={
              result.displayName
            }
          />
        </motion.section>

        {/* =================================================
            LEARN MORE
        ================================================= */}

        {!isNoTumor &&
          result.prediction && (
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
              }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(6,182,212,0.05))",
                border:
                  "1px solid rgba(0,212,255,0.22)",
                borderRadius: "14px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#e2f0ff",
                  marginBottom:
                    "0.5rem",
                }}
              >
                Want to learn more about{" "}
                {result.displayName}?
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                  color:
                    "rgba(160,200,240,0.65)",
                  marginBottom:
                    "1.25rem",
                }}
              >
                View educational information
                about {result.displayName}.
              </p>

              <Link
                to={`/tumors/${result.prediction}`}
                className="btn-primary"
              >
                Learn About{" "}
                {result.displayName}
              </Link>
            </motion.div>
          )}
      </div>

      {/* =================================================
          RESPONSIVE
      ================================================= */}

      <style>{`
        @media (max-width: 640px) {
          .results-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}