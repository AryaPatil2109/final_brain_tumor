import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  Brain,
  Calendar,
  Activity,
  Eye,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getPredictionHistory,
  resolveBackendUrl,
} from "../services/api";

/* =====================================================
   HELPERS
===================================================== */

const getDisplayName = (prediction) => {
  const names = {
    glioma: "Glioma",
    meningioma: "Meningioma",
    pituitary: "Pituitary Tumor",
    notumor: "No Tumor",
    no_tumor: "No Tumor",
  };

  return names[prediction] || prediction || "Unknown";
};


const normalizeConfidence = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  /*
   * Backend may return:
   *
   * 0.95
   * OR
   * 95
   */
  if (number > 1) {
    return Math.min(number / 100, 1);
  }

  return Math.max(number, 0);
};


const formatDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};


const getPredictionFromItem = (item) => {
  return (
    item?.prediction ||
    item?.predicted_class ||
    item?.predictedClass ||
    item?.class_name ||
    item?.class ||
    item?.label ||
    "unknown"
  );
};


const getConfidenceFromItem = (item) => {
  return normalizeConfidence(
    item?.confidence ??
    item?.prediction_confidence ??
    item?.score ??
    0
  );
};


const getFilenameFromItem = (item) => {
  return (
    item?.filename ||
    item?.file_name ||
    item?.original_filename ||
    item?.originalFileName ||
    "MRI Scan"
  );
};


const getImageUrlFromItem = (item) => {
  return resolveBackendUrl(
    item?.imageUrl ||
    item?.image_url ||
    item?.upload_url ||
    item?.uploaded_image_url
  );
};


const getGradcamUrlFromItem = (item) => {
  return resolveBackendUrl(
    item?.gradcamUrl ||
    item?.gradcam_url ||
    item?.grad_cam_url ||
    item?.explanation_url
  );
};


const getDateFromItem = (item) => {
  return (
    item?.created_at ||
    item?.createdAt ||
    item?.timestamp ||
    item?.date ||
    item?.updated_at ||
    null
  );
};


/* =====================================================
   CONFIDENCE COLOR
===================================================== */

const getConfidenceColor = (confidence) => {
  if (confidence >= 0.85) {
    return "var(--color-success)";
  }

  if (confidence >= 0.65) {
    return "var(--color-warning)";
  }

  return "var(--color-error)";
};


/* =====================================================
   HISTORY CARD
===================================================== */

function HistoryCard({ item, onViewDetails }) {
  const prediction = getPredictionFromItem(item);

  const displayName =
    item?.displayName ||
    item?.display_name ||
    item?.prediction_name ||
    getDisplayName(prediction);

  const confidence = getConfidenceFromItem(item);

  const confidencePercent = (confidence * 100).toFixed(1);

  const confidenceColor =
    getConfidenceColor(confidence);

  const filename = getFilenameFromItem(item);

  const imageUrl = getImageUrlFromItem(item);

  const gradcamUrl = getGradcamUrlFromItem(item);

  const date = formatDate(
    getDateFromItem(item)
  );


  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        background: "rgba(15,40,90,0.88)",
        border:
          "1px solid rgba(0,212,255,0.22)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "180px 1fr",
          minHeight: "180px",
        }}
      >

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          style={{
            background: "#061624",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            minHeight: "180px",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={filename}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Brain
              size={55}
              color="var(--color-teal-600)"
            />
          )}
        </div>


        {/* =================================================
            DETAILS
        ================================================= */}

        <div
          style={{
            padding: "1.25rem",
          }}
        >

          {/* Header */}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#e2f0ff",
                  marginBottom: "0.25rem",
                }}
              >
                {displayName}
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color:
                    "rgba(160,200,240,0.65)",
                }}
              >
                {filename}
              </div>
            </div>


            {/* Confidence */}

            <div
              style={{
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: confidenceColor,
                }}
              >
                {confidencePercent}%
              </div>

              <div
                style={{
                  fontSize: "0.7rem",
                  color:
                    "rgba(160,200,240,0.6)",
                }}
              >
                Confidence
              </div>
            </div>
          </div>


          {/* Confidence bar */}

          <div
            style={{
              height: "7px",
              background: "#061624",
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${confidencePercent}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              style={{
                height: "100%",
                background: confidenceColor,
                borderRadius: "999px",
              }}
            />
          </div>


          {/* Metadata */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color:
                  "rgba(160,200,240,0.7)",
              }}
            >
              <Calendar size={14} />
              {date}
            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color:
                  "rgba(160,200,240,0.7)",
              }}
            >
              <Activity size={14} />
              AI Analysis
            </div>
          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.625rem",
            }}
          >

            {/* Learn About */}

            {prediction &&
              prediction !== "notumor" && (
                <Link
                  to={`/tumors/${prediction}`}
                  className="btn-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Eye size={14} />

                  Learn About
                </Link>
              )}


            {/* Grad-CAM */}

            {gradcamUrl && (
              <a
                href={gradcamUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Brain size={14} />

                View Grad-CAM
              </a>
            )}


            {/* =================================================
                VIEW DETAILS

                IMPORTANT:
                We do NOT use /predictions/:id because that
                route does not exist in App.jsx.

                Instead we put this historical prediction
                into sessionStorage and open the existing
                Results page.
            ================================================= */}

            <button
              type="button"
              onClick={() => onViewDetails(item)}
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer",
              }}
            >
              <Eye size={14} />

              View Details
            </button>

          </div>
        </div>
      </div>
    </motion.div>
  );
}


/* =====================================================
   HISTORY PAGE
===================================================== */

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =================================================
     VIEW HISTORICAL RESULT
  ================================================= */

  const handleViewDetails = (item) => {
    try {
      /*
       * Save the selected historical prediction
       * using the SAME storage key used by Analysis.jsx.
       */

      sessionStorage.setItem(
        "latestPrediction",
        JSON.stringify(item)
      );

      /*
       * Reuse the existing Results page.
       */
      navigate("/results");

    } catch (err) {
      console.error(
        "Unable to open prediction details:",
        err
      );

      setError(
        "Unable to open prediction details."
      );
    }
  };


  /* =================================================
     LOAD HISTORY
  ================================================= */

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await getPredictionHistory();


      /*
       * SAFETY CHECK
       *
       * Make sure history is ALWAYS
       * an array before calling .map().
       */

      let historyArray = [];


      if (Array.isArray(result)) {
        historyArray = result;

      } else if (
        Array.isArray(result?.predictions)
      ) {
        historyArray =
          result.predictions;

      } else if (
        Array.isArray(result?.history)
      ) {
        historyArray =
          result.history;

      } else if (
        Array.isArray(result?.data)
      ) {
        historyArray =
          result.data;
      }


      setHistory(historyArray);

    } catch (err) {
      console.error(
        "Prediction history error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to load prediction history."
      );

      setHistory([]);

    } finally {
      setLoading(false);
    }
  };


  /* =================================================
     LOAD HISTORY ON PAGE OPEN
  ================================================= */

  useEffect(() => {
    loadHistory();
  }, []);


  /* =================================================
     LOADING
  ================================================= */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Loader2
          size={40}
          color="var(--color-teal-600)"
          style={{
            animation:
              "spin 1s linear infinite",
          }}
        />

        <div
          style={{
            color:
              "rgba(160,200,240,0.75)",
            fontSize: "0.95rem",
          }}
        >
          Loading prediction history...
        </div>
      </div>
    );
  }


  /* =================================================
     ERROR
  ================================================= */

  if (error) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          style={{
            background:
              "rgba(180,40,40,0.12)",
            border:
              "1px solid rgba(255,80,80,0.25)",
            borderRadius: "14px",
            padding: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <AlertCircle
            size={22}
            color="var(--color-error)"
            style={{
              flexShrink: 0,
            }}
          />

          <div>

            <div
              style={{
                fontWeight: 800,
                color: "#fff",
                marginBottom: "0.4rem",
              }}
            >
              Unable to load history
            </div>

            <div
              style={{
                color:
                  "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>

            <button
              type="button"
              onClick={loadHistory}
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <RefreshCw size={14} />

              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }


  /* =================================================
     EMPTY HISTORY
  ================================================= */

  if (history.length === 0) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >

        <div
          style={{
            marginBottom: "2rem",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <HistoryIcon
              size={28}
              color="var(--color-teal-600)"
            />

            <h1
              style={{
                margin: 0,
                color: "#e2f0ff",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              Prediction History
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              color:
                "rgba(160,200,240,0.7)",
            }}
          >
            View your previous brain MRI
            analyses.
          </p>
        </div>


        <div
          style={{
            background:
              "rgba(15,40,90,0.88)",
            border:
              "1px solid rgba(0,212,255,0.22)",
            borderRadius: "14px",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <Brain
            size={50}
            color="var(--color-teal-600)"
            style={{
              marginBottom: "1rem",
            }}
          />

          <h2
            style={{
              color: "#e2f0ff",
              margin:
                "0 0 0.5rem",
            }}
          >
            No Predictions Yet
          </h2>

          <p
            style={{
              color:
                "rgba(160,200,240,0.7)",
              margin:
                "0 0 1.5rem",
            }}
          >
            Upload a brain MRI scan
            to create your first
            prediction.
          </p>

          <Link
            to="/analysis"
            className="btn-secondary"
          >
            Analyze MRI
          </Link>
        </div>

      </div>
    );
  }


  /* =================================================
     MAIN HISTORY
  ================================================= */

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 4rem",
      }}
    >

      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >

        <div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <HistoryIcon
              size={30}
              color="var(--color-teal-600)"
            />

            <h1
              style={{
                margin: 0,
                color: "#e2f0ff",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              Prediction History
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              color:
                "rgba(160,200,240,0.7)",
            }}
          >
            Your previous brain MRI
            analyses.
          </p>

        </div>


        <button
          type="button"
          onClick={loadHistory}
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <RefreshCw size={14} />

          Refresh
        </button>

      </div>


      {/* HISTORY LIST */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {history.map((item, index) => (
          <HistoryCard
            key={
              item?.id ||
              item?.prediction_id ||
              index
            }
            item={item}
            onViewDetails={
              handleViewDetails
            }
          />
        ))}
      </div>

    </div>
  );
}