import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

/* ── Left-border section card ──────────────────────────────────── */
function SectionCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        background: "rgba(10,25,60,0.80)",
        borderRadius: "14px",
        border: "1px solid rgba(0,212,255,0.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,212,255,0.06)",
        padding: "2rem 2.25rem",
        marginBottom: "1.25rem",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Cyan accent bar + title */}
      <h2
        style={{
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "#e2f0ff",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "1.1em",
            background: "linear-gradient(180deg, #00d4ff, #22d3ee)",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        {title}
      </h2>
      <div
        style={{
          fontSize: "0.95rem",
          color: "rgba(180,210,240,0.85)",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <main style={{
      minHeight: "100vh",
      paddingTop: "80px",
      background: "#061624",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Page header ────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          background: "linear-gradient(160deg, rgba(0,100,200,0.1) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(0,212,255,0.15)",
          padding: "2.5rem 0 2rem",
        }}>
          <div className="container-md">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", justifyContent: "center" }}>
                <div style={{
                  width: "46px", height: "46px",
                  background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(6,182,212,0.15))",
                  border: "1.5px solid rgba(0,212,255,0.4)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(0,212,255,0.2)",
                }}>
                  <Brain size={22} color="#00d4ff" strokeWidth={1.75} />
                </div>
                <div>
                  <h1 style={{
                    fontWeight: 800,
                    fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                    color: "#e2f0ff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    textAlign: "center",
                  }}>
                    About NeuroScan AI
                  </h1>
                  <p style={{ fontSize: "0.875rem", color: "rgba(0,212,255,0.65)", fontWeight: 500, marginTop: "0.2rem", textAlign: "center" }}>
                    Brain Tumor Dual-Path Classification System
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Body content ──────────────────────────────────── */}
        <div className="container-md" style={{ padding: "3rem 1.5rem 5rem", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "720px", position: "relative", zIndex: 1 }}>
            <SectionCard title="Project Objective">
              <p style={{ marginBottom: "1rem" }}>
                NeuroScan AI is an AI-assisted brain MRI classification system
                developed as a final-year academic research project. The system
                classifies brain MRI images into four categories — Glioma,
                Meningioma, Pituitary Tumor, and No Tumor — using a novel
                dual-path deep learning architecture.
              </p>
              <p>
                The project aims to demonstrate how deep learning and computer
                vision techniques can be applied to medical imaging analysis,
                with visual explainability through Grad-CAM.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
