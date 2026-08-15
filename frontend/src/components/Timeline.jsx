import React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Cpu,
  BrainCircuit,
  ChartBar,
  Eye,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload MRI",
    description: "Upload a brain MRI scan image (JPG/PNG)",
    icon: Upload,
    color: "var(--color-blue-600)",
    bg: "var(--color-blue-50)",
  },
  {
    number: "02",
    title: "Image Processing",
    description: "Preprocessing and feature extraction preparation",
    icon: Cpu,
    color: "var(--color-teal-600)",
    bg: "var(--color-teal-50)",
  },
  {
    number: "03",
    title: "AI Analysis",
    description: "Dual-path CNN and morphological analysis",
    icon: BrainCircuit,
    color: "var(--color-blue-600)",
    bg: "var(--color-blue-50)",
  },
  {
    number: "04",
    title: "Prediction",
    description: "Hybrid model generates class prediction and confidence",
    icon: ChartBar,
    color: "var(--color-teal-600)",
    bg: "var(--color-teal-50)",
  },
  {
    number: "05",
    title: "Explanation",
    description: "Grad-CAM visualizes which regions influenced the result",
    icon: Eye,
    color: "var(--color-blue-600)",
    bg: "var(--color-blue-50)",
  },
];

export default function Timeline() {
  return (
    <div style={{ position: "relative" }}>
      {/* Desktop horizontal */}
      <div
        className="timeline-desktop"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            style={{ flex: 1, position: "relative" }}
          >
            {/* Connecting line */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "50%",
                  right: 0,
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(0,212,255,0.28), rgba(0,212,255,0.05))",
                  transformOrigin: "left",
                }}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 0.75rem",
                textAlign: "center",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: `rgba(0,212,255,0.1)`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${step.color}22`,
                  position: "relative",
                  zIndex: 1,
                  marginBottom: "1rem",
                }}
              >
                <step.icon size={20} color={step.color} strokeWidth={1.75} />
              </div>

              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: step.color,
                  letterSpacing: "0.08em",
                  marginBottom: "0.375rem",
                }}
              >
                {step.number}
              </span>
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#e2f0ff",
                  marginBottom: "0.375rem",
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(160,200,240,0.65)",
                  lineHeight: 1.5,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile vertical */}
      <div className="timeline-mobile" style={{ display: "none" }}>
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: i < steps.length - 1 ? "1.5rem" : 0,
              position: "relative",
            }}
          >
            {/* Vertical line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "23px",
                  top: "50px",
                  width: "2px",
                  height: "calc(100% + 0.5rem)",
                  background:
                    "linear-gradient(180deg, rgba(0,212,255,0.22), transparent)",
                }}
              />
            )}

            <div
              style={{
                width: "48px",
                height: "48px",
                background: `rgba(0,212,255,0.1)`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: `2px solid ${step.color}22`,
              }}
            >
              <step.icon size={20} color={step.color} strokeWidth={1.75} />
            </div>

            <div>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: step.color,
                  letterSpacing: "0.06em",
                }}
              >
                {step.number}
              </span>
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "#e2f0ff",
                  margin: "0.125rem 0 0.25rem",
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(160,200,240,0.65)",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .timeline-desktop { display: none !important; }
          .timeline-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
