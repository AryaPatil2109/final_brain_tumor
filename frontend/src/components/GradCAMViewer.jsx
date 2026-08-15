import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, SlidersHorizontal } from "lucide-react";

export default function GradCAMViewer({ originalUrl, gradcamUrl, displayName }) {
  const [opacity, setOpacity] = useState(0.6);

  const hasGradcam = Boolean(gradcamUrl);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#e2f0ff",
            marginBottom: "0.375rem",
          }}
        >
          Where did the AI focus?
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(160,200,240,0.65)",
          }}
        >
          Highlighted regions represent areas that contributed most strongly to
          the model's {displayName ? `"${displayName}"` : ""} prediction.
        </p>
      </div>

      {/* Image comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* Original */}
        <div>
          <div
            style={{
              background: "#0a1628",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {originalUrl ? (
              <img
                src={originalUrl}
                alt="Original brain MRI scan"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <GradcamPlaceholder label="Original MRI" color="rgba(23,105,170,0.4)" />
            )}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
                borderRadius: "6px",
                padding: "0.2rem 0.5rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Original MRI
            </div>
          </div>
        </div>

        {/* Grad-CAM */}
        <div>
          <div
            style={{
              background: "#0a1628",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {hasGradcam ? (
              <>
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
                <img
                  src={gradcamUrl}
                  alt={`Grad-CAM heatmap highlighting regions influencing ${displayName} prediction`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    opacity,
                    transition: "opacity 0.15s ease",
                  }}
                />
              </>
            ) : (
              <GradcamPlaceholder
                label="Grad-CAM Heatmap"
                color="rgba(15,157,154,0.4)"
                isPlaceholder
              />
            )}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
                borderRadius: "6px",
                padding: "0.2rem 0.5rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Grad-CAM Heatmap
            </div>
          </div>
        </div>
      </div>

      {/* Opacity slider (only when gradcam available) */}
      {hasGradcam && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "#061624",
            borderRadius: "8px",
            border: "1px solid rgba(0,212,255,0.22)",
          }}
        >
          <SlidersHorizontal
            size={15}
            color="var(--color-text-secondary)"
            style={{ flexShrink: 0 }}
          />
          <label
            style={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "rgba(160,200,240,0.65)",
              flexShrink: 0,
            }}
          >
            Heatmap opacity:
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: "var(--color-blue-600)" }}
            aria-label="Adjust heatmap overlay opacity"
          />
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#e2f0ff",
              minWidth: "32px",
              textAlign: "right",
            }}
          >
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

    </div>

  );
}

function GradcamPlaceholder({ label, color, isPlaceholder }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        color: "rgba(255,255,255,0.3)",
      }}
    >
      {/* Simulated heatmap rings */}
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        {[60, 45, 30].map((s, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: 0,
              margin: "auto",
              width: `${s}px`,
              height: `${s}px`,
              borderRadius: "50%",
              background: color,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>
        {isPlaceholder ? "Pending backend connection" : label}
      </span>
    </div>
  );
}
