import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{
        background: "rgba(15,40,90,0.85)",
        borderRadius: "14px",
        border: "1px solid rgba(0,212,255,0.22)",
        boxShadow: "var(--shadow-card)",
        padding: "1.75rem",
        cursor: "default",
        transition: "box-shadow 0.2s ease",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          width: "48px",
          height: "48px",
          background: `${color}18` || "rgba(0,212,255,0.1)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          boxShadow: `0 0 16px ${color}30`,
        }}
      >
        {Icon && (
          <Icon size={24} color={color || "#00d4ff"} strokeWidth={1.75} />
        )}
      </motion.div>

      <h3
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          color: "#e2f0ff",
          marginBottom: "0.625rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.9rem",
          color: "rgba(160,200,240,0.6)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}
