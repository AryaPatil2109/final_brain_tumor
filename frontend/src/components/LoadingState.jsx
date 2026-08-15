import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ScanLine, Cpu, ChartLine, Loader } from "lucide-react";

const STEPS = [
  { icon: ScanLine, label: "Preparing image..." },
  { icon: Cpu, label: "Extracting visual features..." },
  { icon: BrainCircuit, label: "Running AI classification..." },
  { icon: ChartLine, label: "Computing confidence scores..." },
  { icon: Loader, label: "Generating explanation..." },
];

export default function LoadingState({ progress = 0, currentStep = 0 }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3.5rem 2rem",
        textAlign: "center",
      }}
    >
      {/* Animated orb */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "3px solid var(--color-blue-50)",
            borderTopColor: "var(--color-blue-600)",
            borderRightColor: "var(--color-teal-600)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrainCircuit
              size={28}
              color="var(--color-blue-600)"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>
      </div>

      <h2
        style={{
          fontWeight: 700,
          fontSize: "1.375rem",
          color: "#e2f0ff",
          marginBottom: "0.375rem",
        }}
      >
        Analyzing MRI
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          color: "rgba(160,200,240,0.65)",
          marginBottom: "2rem",
        }}
      >
        AI-assisted classification in progress
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "rgba(0,212,255,0.07)",
          borderRadius: "999px",
          height: "6px",
          marginBottom: "0.625rem",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Analysis progress"
      >
        <motion.div
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, var(--color-blue-600), var(--color-teal-600))",
            borderRadius: "999px",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div
        style={{
          fontSize: "0.8125rem",
          color: "rgba(160,200,240,0.65)",
          marginBottom: "2rem",
          fontWeight: 600,
        }}
      >
        {progress}%
      </div>

      {/* Steps list */}
      <div style={{ width: "100%", maxWidth: "360px", textAlign: "left" }}>
        {STEPS.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: isDone
                    ? "var(--color-teal-50)"
                    : isActive
                    ? "var(--color-blue-50)"
                    : "#061624",
                  border: `1.5px solid ${isDone ? "var(--color-teal-600)" : isActive ? "var(--color-blue-600)" : "var(--color-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <step.icon
                      size={13}
                      color="var(--color-blue-600)"
                      strokeWidth={2}
                    />
                  </motion.div>
                ) : (
                  <step.icon
                    size={13}
                    color={
                      isDone ? "var(--color-teal-600)" : "var(--color-border)"
                    }
                    strokeWidth={2}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isDone
                    ? "var(--color-teal-600)"
                    : isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                  transition: "color 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
