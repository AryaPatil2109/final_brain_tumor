import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";

/* =========================================================
   CREATE SAFE TUMOR SLUG
========================================================= */

const makeTumorSlug = (tumor) => {
  const rawValue =
    tumor?.slug ||
    tumor?.name ||
    tumor?.displayName ||
    tumor?.display_name ||
    "";

  return String(rawValue)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/* =========================================================
   DISPLAY NAME
========================================================= */

const getDisplayName = (tumor) => {
  return (
    tumor?.displayName ||
    tumor?.display_name ||
    tumor?.name ||
    "Unknown Tumor"
  );
};

/* =========================================================
   DESCRIPTION
========================================================= */

const getDescription = (tumor) => {
  return (
    tumor?.shortDescription ||
    tumor?.short_description ||
    tumor?.description ||
    "Educational information about this tumor category."
  );
};

/* =========================================================
   SYMPTOMS
========================================================= */

const getSymptoms = (tumor) => {
  if (Array.isArray(tumor?.symptoms)) {
    return tumor.symptoms;
  }

  if (Array.isArray(tumor?.commonSymptoms)) {
    return tumor.commonSymptoms;
  }

  if (Array.isArray(tumor?.common_symptoms)) {
    return tumor.common_symptoms;
  }

  return [];
};

/* =========================================================
   SYMPTOM TEXT
========================================================= */

const getSymptomText = (symptom) => {
  if (typeof symptom === "string") {
    return symptom;
  }

  if (symptom?.label) {
    return symptom.label;
  }

  if (symptom?.name) {
    return symptom.name;
  }

  return "";
};

/* =========================================================
   CARD
========================================================= */

export default function TumorCard({
  tumor,
  delay = 0,
}) {
  const slug = makeTumorSlug(tumor);

  const displayName =
    getDisplayName(tumor);

  const description =
    getDescription(tumor);

  const symptoms =
    getSymptoms(tumor)
      .map(getSymptomText)
      .filter(Boolean);

  /*
   * Fallback symptoms so the card still looks correct
   * if the backend does not provide them.
   */
  const fallbackSymptoms = {
    glioma: [
      "Headaches",
      "Seizures",
      "Nausea",
    ],
    meningioma: [
      "Headaches",
      "Seizures",
      "Vision problems",
    ],
    pituitary: [
      "Headaches",
      "Vision changes",
      "Hormonal problems",
    ],
    "pituitary-tumor": [
      "Headaches",
      "Vision changes",
      "Hormonal problems",
    ],
    notumor: [
      "No tumor-specific symptoms are associated with this classification.",
    ],
    "no-tumor": [
      "No tumor-specific symptoms are associated with this classification.",
    ],
  };

  const finalSymptoms =
    symptoms.length > 0
      ? symptoms
      : fallbackSymptoms[slug] || [];

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
      whileHover={{
        y: -5,
      }}
      style={{
        background: "#ffffff",
        border: "1px solid #dceaf2",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow:
          "0 10px 30px rgba(16,42,67,0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: "390px",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          height: "7px",
          background:
            "linear-gradient(90deg, #08b6e8, #00d4ff)",
        }}
      />

      {/* Content */}
      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title */}
        <h2
          style={{
            margin: "0 0 1rem",
            color: "#102a43",
            fontSize: "1.55rem",
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {displayName}
        </h2>

        {/* Description */}
        <p
          style={{
            margin: "0 0 1.5rem",
            color: "#627d98",
            fontSize: "1rem",
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>

        {/* Symptoms */}
        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
              color: "#1f4f6d",
              fontSize: "0.9rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            <Info
              size={17}
              color="#08b6e8"
            />

            Common Symptoms
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
            }}
          >
            {finalSymptoms
              .slice(0, 4)
              .map((symptom, index) => (
                <div
                  key={`${symptom}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.55rem",
                    color: "#627d98",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle2
                    size={17}
                    color="#08b6e8"
                    style={{
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />

                  <span>{symptom}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "1.25rem",
            borderTop:
              "1px solid #e2edf3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{
              color: "#8aa1b3",
              fontSize: "0.85rem",
              lineHeight: 1.4,
            }}
          >
            Educational
            <br />
            information
          </div>

          {/* =================================================
              FIXED VIEW DETAILS LINK
          ================================================= */}

          {slug ? (
            <Link
              to={`/tumors/${slug}`}
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              aria-label={`View details about ${displayName}`}
            >
              View Details

              <ArrowRight
                size={17}
              />
            </Link>
          ) : (
            <span
              style={{
                color: "#9aaebb",
                fontSize: "0.85rem",
              }}
            >
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}