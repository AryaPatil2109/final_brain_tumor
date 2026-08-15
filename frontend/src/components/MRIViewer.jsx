import React from "react";
import { motion } from "framer-motion";
import { Image } from "lucide-react";

export default function MRIViewer({ imageUrl, altText = "Brain MRI scan", caption, label }) {
  return (
    <div>
      <div
        style={{
          background: "#0a1628",
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "260px",
          position: "relative",
        }}
      >
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={altText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              padding: "3rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image size={28} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              No image available
            </span>
          </div>
        )}

        {label && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              padding: "0.25rem 0.625rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </div>
        )}
      </div>

      {caption && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "rgba(160,200,240,0.65)",
            marginTop: "0.625rem",
            fontStyle: "italic",
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
