import React from "react";
import { AlertTriangle } from "lucide-react";

export default function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-start",
          padding: "0.75rem 1rem",
          background: "rgba(245,158,11,0.06)",
          border: "1px solid #fde68a",
          borderLeft: "4px solid var(--color-warning)",
          borderRadius: "8px",
          fontSize: "0.8125rem",
          color: "#92400e",
          lineHeight: 1.55,
        }}
        role="note"
        aria-label="Medical disclaimer"
      >
        <AlertTriangle
          size={14}
          style={{ flexShrink: 0, marginTop: "1px", color: "var(--color-warning)" }}
        />
        <span>
          <strong>Educational use only.</strong> This AI system does not
          constitute medical advice or clinical diagnosis. Consult a healthcare
          professional for any medical concerns.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
      }}
      role="note"
      aria-label="Full medical disclaimer"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "#fef3c7",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle
            size={16}
            color="var(--color-warning)"
            strokeWidth={2}
          />
        </div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "#92400e",
            margin: 0,
          }}
        >
          Educational Information
        </h3>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "#92400e",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        The information presented on this page is for <strong>educational purposes only</strong> and does not replace
        professional medical advice, diagnosis, or treatment. Brain tumor
        diagnosis requires evaluation by qualified healthcare professionals
        including neurologists, neurosurgeons, and radiologists using clinical
        examination, imaging, and pathological analysis. Always seek the advice of
        a qualified medical professional with any questions you may have regarding a
        medical condition.
      </p>
    </div>
  );
}
