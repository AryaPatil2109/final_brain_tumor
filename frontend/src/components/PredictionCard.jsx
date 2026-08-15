import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================
   NORMALIZE CONFIDENCE
   Supports:
   0.9995 -> 99.95%
   99.95  -> 99.95%
   1      -> 100%
   100    -> 100%
============================================================ */

const normalizeConfidence = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  if (number > 1) {
    return Math.min(number / 100, 1);
  }

  return Math.max(number, 0);
};

/* ============================================================
   CONFIDENCE COLOR
============================================================ */

const getConfidenceColor = (confidence) => {
  if (confidence >= 0.85) {
    return "var(--color-success)";
  }

  if (confidence >= 0.65) {
    return "var(--color-warning)";
  }

  return "var(--color-error)";
};

/* ============================================================
   PREDICTION CARD
============================================================ */

export default function PredictionCard({
  prediction,
  displayName,
  confidence,
  model,
  probabilities = [],
  onLearnMore,
}) {
  const normalizedConfidence = normalizeConfidence(confidence);

  const confidencePercentage = normalizedConfidence * 100;

  const confPct = confidencePercentage.toFixed(1);

  const confColor = getConfidenceColor(normalizedConfidence);

  const tumorSlug = prediction;

  const safeProbabilities = Array.isArray(probabilities)
    ? probabilities
    : [];

  return (
    <div
      style={{
        background: "rgba(15,40,90,0.88)",
        borderRadius: "14px",
        border: "1px solid rgba(0,212,255,0.22)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div
        style={{
          background:
            "linear-gradient(135deg, var(--color-navy-900), var(--color-navy-700))",
          padding: "1.5rem",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.6)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}
        >
          AI-Assisted Classification
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "0.375rem",
          }}
        >
          {displayName || prediction || "Unknown"}
        </motion.div>

        <div
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Predicted Class
        </div>
      </div>

      {/* ============================================================
          BODY
      ============================================================ */}

      <div style={{ padding: "1.5rem" }}>

        {/* ==========================================================
            CONFIDENCE
        ========================================================== */}

        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "rgba(160,200,240,0.65)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <TrendingUp size={14} />
              Confidence Score
            </span>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontWeight: 800,
                fontSize: "1.5rem",
                color: confColor,
                lineHeight: 1,
              }}
            >
              {confPct}%
            </motion.span>
          </div>

          {/* Confidence bar */}

          <div
            style={{
              height: "8px",
              background: "#061624",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1px solid rgba(0,212,255,0.22)",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${confidencePercentage}%`,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
              style={{
                height: "100%",
                background: confColor,
                borderRadius: "999px",
              }}
            />
          </div>
        </div>

        {/* ==========================================================
            MODEL INFO
        ========================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.875rem",
            background: "#061624",
            borderRadius: "8px",
            border: "1px solid rgba(0,212,255,0.22)",
            marginBottom: "1.5rem",
          }}
        >
          <Cpu
            size={14}
            color="var(--color-teal-600)"
          />

          <span
            style={{
              fontSize: "0.8125rem",
              color: "rgba(160,200,240,0.65)",
              fontWeight: 500,
            }}
          >
            Model:
          </span>

          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#e2f0ff",
            }}
          >
            {model || "Hybrid CNN + Morphology"}
          </span>
        </div>

        {/* ==========================================================
            ANALYSIS CHECKS
        ========================================================== */}

        <div style={{ marginBottom: "1.5rem" }}>
          {[
            "CNN deep feature analysis",
            "Morphology structural analysis",
            "Hybrid model prediction",
            "Explainability (Grad-CAM) available",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.375rem 0",
                fontSize: "0.875rem",
                color: "#e2f0ff",
              }}
            >
              <CheckCircle
                size={15}
                color="var(--color-success)"
                style={{
                  flexShrink: 0,
                }}
              />

              {item}
            </div>
          ))}
        </div>

        {/* ==========================================================
            LEARN MORE
        ========================================================== */}

        {prediction && prediction !== "notumor" && (
          <Link
            to={`/tumors/${encodeURIComponent(tumorSlug)}`}
            className="btn-secondary"
            onClick={onLearnMore}
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            Learn About {displayName || prediction}

            <ArrowRight size={15} />
          </Link>
        )}

        {/* ==========================================================
            NO TUMOR MESSAGE
        ========================================================== */}

        {prediction === "notumor" && (
          <div
            style={{
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "#e2f0ff",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            No tumor class detected.
          </div>
        )}
      </div>
    </div>
  );
}