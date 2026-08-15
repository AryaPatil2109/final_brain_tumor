import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Scan, AlertCircle } from "lucide-react";

import MRIUploader from "../components/MRIUploader";
import LoadingState from "../components/LoadingState";

import { predictMRI } from "../services/api";

export default function Analysis() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // =====================================================
  // FILE SELECTED
  // =====================================================

  const handleFileSelected = useCallback((selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setProgress(0);
    setCurrentStep(0);
  }, []);

  // =====================================================
  // CLEAR FILE
  // =====================================================

  const handleClear = useCallback(() => {
    setFile(null);
    setError(null);
    setProgress(0);
    setCurrentStep(0);
  }, []);

  // =====================================================
  // ANALYZE MRI
  // =====================================================

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an MRI image before analyzing.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setCurrentStep(0);
    setError(null);

    try {
      /*
       * Backend prediction progress.
       *
       * The actual FastAPI endpoint does not provide
       * processing-stage progress, so we update the UI
       * according to upload progress and completion.
       */

      const stepMap = {
        20: 1,
        45: 2,
        70: 3,
        90: 4,
        100: 4,
      };

      const result = await predictMRI(file, (percentage) => {
        setProgress(percentage);
        setCurrentStep(stepMap[percentage] ?? 0);
      });

      // =================================================
      // VALIDATE BACKEND RESPONSE
      // =================================================

      if (!result) {
        throw new Error("The backend returned an empty response.");
      }

      /*
       * The backend returns:
       *
       * success
       * prediction_id
       * user_id
       * prediction
       * confidence
       * probabilities
       * cnn
       * validation
       * morphology
       * image_url
       * gradcam_url
       * gradcam_error
       */

      // =================================================
      // CONVERT BACKEND URLS TO FULL FRONTEND-USABLE URLs
      // =================================================

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "http://127.0.0.1:8000";

      const makeAbsoluteUrl = (url) => {
        if (!url) {
          return null;
        }

        if (
          url.startsWith("http://") ||
          url.startsWith("https://") ||
          url.startsWith("blob:")
        ) {
          return url;
        }

        return `${API_BASE_URL}${url}`;
      };

      // =================================================
      // DISPLAY NAME
      // =================================================

      const displayNames = {
        glioma: "Glioma",
        meningioma: "Meningioma",
        pituitary: "Pituitary Tumor",
        notumor: "No Tumor",
        no_tumor: "No Tumor",
        "no tumor": "No Tumor",
      };

      const predictionKey = String(
        result.prediction || ""
      ).toLowerCase();

      const displayName =
        displayNames[predictionKey] ||
        result.display_name ||
        result.displayName ||
        result.prediction ||
        "Unknown";

      // =================================================
      // NORMALIZE PROBABILITIES
      // =================================================

      let probabilities = Array.isArray(result.probabilities)
        ? result.probabilities
        : [];

      probabilities = probabilities.map((item) => {
        const className =
          item.class ||
          item.label ||
          item.name ||
          "";

        const normalizedClass =
          String(className).toLowerCase();

        return {
          class: normalizedClass,

          displayName:
            item.displayName ||
            item.display_name ||
            displayNames[normalizedClass] ||
            className,

          probability:
            typeof item.probability === "number"
              ? item.probability
              : typeof item.confidence === "number"
                ? item.confidence
                : 0,
        };
      });

      // =================================================
      // NORMALIZED RESULT FOR RESULTS PAGE
      // =================================================

      const normalizedResult = {
        ...result,

        id:
          result.prediction_id ||
          result.id ||
          `pred-${Date.now()}`,

        prediction: result.prediction,

        displayName,

        confidence:
          typeof result.confidence === "number"
            ? result.confidence
            : 0,

        model:
          result.model ||
          "Hybrid CNN + Morphology",

        filename: file.name,

        probabilities,

        imageUrl: makeAbsoluteUrl(
          result.image_url
        ),

        gradcamUrl: makeAbsoluteUrl(
          result.gradcam_url
        ),

        gradcamAvailable:
          Boolean(result.gradcam_url),

        status: result.success
          ? "complete"
          : "failed",

        date: result.created_at
          ? result.created_at
          : new Date().toISOString(),
      };

      // =================================================
      // STORE RESULT
      // =================================================

      sessionStorage.setItem(
        "latestPrediction",
        JSON.stringify(normalizedResult)
      );

      // =================================================
      // COMPLETE
      // =================================================

      setProgress(100);
      setCurrentStep(4);

      // Small delay so the completed state can render
      await new Promise((resolve) =>
        setTimeout(resolve, 250)
      );

      navigate("/results");

    } catch (err) {
      console.error(
        "MRI analysis error:",
        err
      );

      // =================================================
      // EXTRACT BACKEND ERROR
      // =================================================

      let errorMessage =
        "Analysis failed. Please try again.";

      if (err?.response?.data?.detail) {
        errorMessage =
          err.response.data.detail;
      } else if (err?.message) {
        errorMessage =
          err.message;
      }

      // Authentication-related error
      if (
        err?.response?.status === 401
      ) {
        errorMessage =
          "Please log in before analyzing an MRI.";
      }

      setError(errorMessage);

      setLoading(false);
      setProgress(0);
      setCurrentStep(0);
    }
  };

  // =====================================================
  // UI
  // =====================================================

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

      <div
        style={{
          background:
            "linear-gradient(160deg, rgba(0,100,200,0.12) 0%, #020b18 60%)",
          padding: "3rem 0 1.5rem",
          borderBottom:
            "1px solid rgba(0,212,255,0.22)",
        }}
      >
        <div className="container-md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, var(--color-blue-600), var(--color-teal-600))",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Scan
                size={20}
                color="#fff"
              />
            </div>

            <div>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize:
                    "clamp(1.5rem, 3vw, 2rem)",
                  color: "#e2f0ff",
                  lineHeight: 1.2,
                }}
              >
                MRI Analysis
              </h1>

              <p
                style={{
                  fontSize: "0.9rem",
                  color:
                    "rgba(160,200,240,0.65)",
                }}
              >
                AI-assisted brain tumor
                classification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="container-md"
        style={{
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          className="analysis-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 340px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* =================================================
              MAIN UPLOAD AREA
          ================================================= */}

          <div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  style={{
                    background:
                      "rgba(15,40,90,0.88)",
                    borderRadius: "16px",
                    border:
                      "1px solid rgba(0,212,255,0.22)",
                    boxShadow:
                      "var(--shadow-card)",
                  }}
                >
                  <LoadingState
                    progress={progress}
                    currentStep={currentStep}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="uploader"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#e2f0ff",
                      marginBottom:
                        "0.375rem",
                    }}
                  >
                    Upload Brain MRI Scan
                  </h2>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color:
                        "rgba(160,200,240,0.65)",
                      marginBottom:
                        "1.25rem",
                    }}
                  >
                    Upload a brain MRI image
                    for AI-assisted
                    classification. The model
                    will analyze the scan and
                    provide a predicted class
                    with confidence score.
                  </p>

                  {/* MRI UPLOADER */}

                  <MRIUploader
                    onFileSelected={
                      handleFileSelected
                    }
                    onClear={handleClear}
                  />

                  {/* ERROR */}

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "0.5rem",
                          padding:
                            "0.75rem 1rem",
                          background:
                            "#fef2f2",
                          border:
                            "1px solid #fecaca",
                          borderRadius: "8px",
                          marginTop:
                            "0.875rem",
                          color:
                            "var(--color-error)",
                          fontSize:
                            "0.875rem",
                          fontWeight: 500,
                        }}
                        role="alert"
                      >
                        <AlertCircle
                          size={15}
                        />

                        <span>
                          {error}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ANALYZE BUTTON */}

                  <div
                    style={{
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      onClick={
                        handleAnalyze
                      }
                      disabled={!file}
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent:
                          "center",
                        fontSize: "1rem",
                        padding:
                          "0.875rem 2rem",
                        opacity: file
                          ? 1
                          : 0.5,
                        cursor: file
                          ? "pointer"
                          : "not-allowed",
                        transition:
                          "opacity 0.2s ease, background 0.2s ease, transform 0.15s ease",
                      }}
                      aria-label="Start MRI analysis"
                    >
                      <Brain size={18} />

                      Analyze MRI
                    </button>

                    {!file && (
                      <p
                        style={{
                          textAlign:
                            "center",
                          fontSize:
                            "0.8125rem",
                          color:
                            "rgba(160,200,240,0.65)",
                          marginTop:
                            "0.5rem",
                        }}
                      >
                        Upload an image to
                        enable analysis
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "1rem",
            }}
          >
            {/* WHAT TO EXPECT */}

            <div
              style={{
                background:
                  "rgba(15,40,90,0.88)",
                borderRadius: "12px",
                border:
                  "1px solid rgba(0,212,255,0.22)",
                boxShadow:
                  "var(--shadow-card)",
                padding: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize:
                    "0.9375rem",
                  color: "#e2f0ff",
                  marginBottom:
                    "1rem",
                }}
              >
                What the AI classifies:
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  {
                    name: "Glioma",
                    color:
                      "var(--color-blue-600)",
                  },
                  {
                    name: "Meningioma",
                    color:
                      "var(--color-teal-600)",
                  },
                  {
                    name: "Pituitary Tumor",
                    color:
                      "var(--color-blue-600)",
                  },
                  {
                    name: "No Tumor",
                    color:
                      "var(--color-success)",
                  },
                ].map((cls) => (
                  <div
                    key={cls.name}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "0.625rem",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius:
                          "50%",
                        background:
                          cls.color,
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontSize:
                          "0.875rem",
                        color:
                          "#e2f0ff",
                        fontWeight:
                          500,
                      }}
                    >
                      {cls.name}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop:
                    "1rem",
                  paddingTop:
                    "1rem",
                  borderTop:
                    "1px solid rgba(0,212,255,0.22)",
                  fontSize:
                    "0.8125rem",
                  color:
                    "rgba(160,200,240,0.65)",
                  lineHeight: 1.6,
                }}
              >
                <strong
                  style={{
                    color:
                      "#e2f0ff",
                  }}
                >
                  Model:
                </strong>{" "}
                Hybrid CNN +
                Morphology (93%
                test accuracy)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          RESPONSIVE
      ================================================= */}

      <style>{`
        @media (max-width: 768px) {
          .analysis-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}