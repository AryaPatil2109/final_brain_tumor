import React from "react";
import { motion } from "framer-motion";

export default function TumorInfoSection({ title, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      style={{ marginBottom: "2rem" }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--color-blue-600)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "1em",
            background:
              "linear-gradient(180deg, var(--color-blue-600), var(--color-teal-600))",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        {title}
      </h2>
      <div
        style={{
          fontSize: "0.9375rem",
          color: "#e2f0ff",
          lineHeight: 1.75,
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}
