import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Microscope,
  Eye,
  Shield,
  ArrowRight,
} from "lucide-react";

import FeatureCard from "../components/FeatureCard";
import Timeline from "../components/Timeline";

// =====================================================
// FEATURES
// =====================================================

const features = [
  {
    icon: BrainCircuit,
    title: "AI Classification",
    description:
      "CNN-based deep learning model trained on brain MRI images for multi-class tumor classification.",
    color: "var(--color-cyan)",
    delay: 0,
  },
  {
    icon: Microscope,
    title: "Morphology Analysis",
    description:
      "Structural and textural feature extraction using image processing for enhanced accuracy.",
    color: "var(--color-teal-500)",
    delay: 0.08,
  },
  {
    icon: Eye,
    title: "Explainable AI",
    description:
      "Grad-CAM visualizations highlight which MRI regions influenced the classification decision.",
    color: "var(--color-cyan)",
    delay: 0.16,
  },
  {
    icon: Shield,
    title: "Research-Grade System",
    description:
      "Designed for educational research demonstration with structured, controlled analysis pipeline.",
    color: "var(--color-teal-500)",
    delay: 0.24,
  },
];

// =====================================================
// SECTION HEADING
// =====================================================

function SectionHeading({ children, sub }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.45,
      }}
      style={{
        textAlign: "center",
        marginBottom: "2.5rem",
      }}
    >
      <h2
        style={{
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          color: "#e2f0ff",
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>

      {sub && (
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(160,200,240,0.65)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

// =====================================================
// HOME / DASHBOARD
// =====================================================

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "76px",
      }}
    >
      {/* =================================================
          DASHBOARD INTRO
      ================================================= */}

      <section
        style={{
          padding:
            "5rem 1rem 4rem",
          borderTop:
            "1px solid rgba(0,212,255,0.07)",
        }}
      >
        <div
          className="container-md"
          style={{
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding:
                  "0.5rem 1rem",
                borderRadius: "999px",
                background:
                  "rgba(0,212,255,0.07)",
                border:
                  "1px solid rgba(0,212,255,0.22)",
                color: "#00d4ff",
                fontSize:
                  "0.8rem",
                fontWeight: 700,
                marginBottom:
                  "1rem",
              }}
            >
              <BrainCircuit size={15} />

              AI-Assisted Brain MRI Analysis
            </div>

            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize:
                  "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "#e2f0ff",
                letterSpacing:
                  "-0.035em",
              }}
            >
              NeuroScan AI
            </h1>

            <p
              style={{
                maxWidth: "720px",
                margin:
                  "1.25rem auto 0",
                fontSize:
                  "1.1rem",
                lineHeight: 1.75,
                color:
                  "rgba(160,200,240,0.7)",
              }}
            >
              AI-assisted brain MRI
              classification combining
              deep visual features,
              morphology analysis, and
              explainable AI.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "2rem",
              }}
            >
              <Link
                to="/analysis"
                className="btn-primary"
              >
                Analyze MRI
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/tumors"
                className="btn-secondary"
              >
                Explore Tumor Guide
              </Link>
            </div>

            <p
              style={{
                marginTop:
                  "1.25rem",
                color:
                  "rgba(160,200,240,0.4)",
                fontSize:
                  "0.8rem",
              }}
            >
              For educational and
              research purposes only ·
              Not a clinical diagnostic
              tool
            </p>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          PLATFORM CAPABILITIES
      ================================================= */}

      <section
        style={{
          padding:
            "5rem 0",
          borderTop:
            "1px solid rgba(0,212,255,0.07)",
        }}
      >
        <div className="container-md">
          <SectionHeading
            sub="A dual-path AI architecture combining deep visual features with structural morphology for robust classification."
          >
            Platform Capabilities
          </SectionHeading>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section
        style={{
          padding:
            "5rem 0",
          borderTop:
            "1px solid rgba(0,212,255,0.07)",
        }}
      >
        <div className="container-md">
          <SectionHeading
            sub="From MRI upload to AI explanation in five steps."
          >
            How It Works
          </SectionHeading>

          <Timeline />
        </div>
      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section
        style={{
          padding:
            "4rem 0",
          borderTop:
            "1px solid rgba(0,212,255,0.07)",
        }}
      >
        <div className="container-md">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {[
              {
                value: "93.00%",
                label: "Test Set Accuracy",
                sub: "Hybrid V2 Model",
              },
              {
                value: "4",
                label: "Classification Classes",
                sub:
                  "Glioma · Meningioma · Pituitary · None",
              },
              {
                value: "1,600+",
                label: "Test Images",
                sub:
                  "Independent evaluation set",
              },
              {
                value: "2-Path",
                label: "Architecture",
                sub:
                  "CNN + Morphology Fusion",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay:
                    index * 0.08,
                  duration: 0.4,
                }}
                style={{
                  background:
                    "rgba(15,40,90,0.75)",
                  border:
                    "1px solid rgba(0,212,255,0.22)",
                  borderRadius:
                    "14px",
                  padding:
                    "1.75rem 1.25rem",
                  backdropFilter:
                    "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize:
                      "clamp(1.75rem, 3.5vw, 2.5rem)",
                    color: "#00d4ff",
                    lineHeight: 1.1,
                    marginBottom:
                      "0.375rem",
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    fontSize:
                      "0.9rem",
                    fontWeight: 600,
                    color: "#e2f0ff",
                    marginBottom:
                      "0.25rem",
                  }}
                >
                  {stat.label}
                </div>

                <div
                  style={{
                    fontSize:
                      "0.75rem",
                    color:
                      "rgba(160,200,240,0.4)",
                  }}
                >
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section
        style={{
          padding:
            "5rem 0",
          borderTop:
            "1px solid rgba(0,212,255,0.07)",
          textAlign: "center",
        }}
      >
        <div className="container-md">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
            }}
            style={{
              background:
                "rgba(15,40,90,0.85)",
              border:
                "1px solid rgba(0,212,255,0.28)",
              borderRadius:
                "20px",
              padding:
                "3rem 2rem",
              backdropFilter:
                "blur(16px)",
              boxShadow:
                "0 0 60px rgba(0,212,255,0.05)",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize:
                  "clamp(1.5rem, 3vw, 2rem)",
                color: "#e2f0ff",
                marginBottom:
                  "0.875rem",
              }}
            >
              Ready to Analyze an MRI?
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color:
                  "rgba(160,200,240,0.65)",
                maxWidth: "440px",
                margin:
                  "0 auto 2rem",
                lineHeight: 1.7,
              }}
            >
              Upload a brain MRI scan
              and receive an
              AI-assisted classification
              result with Grad-CAM
              visual explanation.
            </p>

            <Link
              to="/analysis"
              className="btn-primary"
            >
              Analyze MRI
              <ArrowRight size={17} />
            </Link>

            <p
              style={{
                fontSize:
                  "0.8125rem",
                color:
                  "rgba(160,200,240,0.35)",
                marginTop:
                  "1.5rem",
              }}
            >
              For educational and
              research purposes only ·
              Not a clinical tool
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}