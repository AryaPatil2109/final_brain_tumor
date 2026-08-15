import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Microscope, Eye, Shield, ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Timeline from "../components/Timeline";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Classification",
    description: "CNN-based deep learning model trained on brain MRI images for multi-class tumor classification.",
    color: "var(--color-cyan)",
    delay: 0,
  },
  {
    icon: Microscope,
    title: "Morphology Analysis",
    description: "Structural and textural feature extraction using image processing for enhanced accuracy.",
    color: "var(--color-teal-500)",
    delay: 0.08,
  },
  {
    icon: Eye,
    title: "Explainable AI",
    description: "Grad-CAM visualizations highlight which MRI regions influenced the classification decision.",
    color: "var(--color-cyan)",
    delay: 0.16,
  },
  {
    icon: Shield,
    title: "Research-Grade System",
    description: "Designed for educational research demonstration with structured, controlled analysis pipeline.",
    color: "var(--color-teal-500)",
    delay: 0.24,
  },
];

function SectionHeading({ children, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{ textAlign: "center", marginBottom: "2.5rem" }}
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
        <p style={{ fontSize: "1rem", color: "rgba(160,200,240,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Feature Cards */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(0,212,255,0.07)" }}>
        <div className="container-md">
          <SectionHeading sub="A dual-path AI architecture combining deep visual features with structural morphology for robust classification.">
            Platform Capabilities
          </SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(0,212,255,0.07)" }}>
        <div className="container-md">
          <SectionHeading sub="From MRI upload to AI explanation in five steps">
            How It Works
          </SectionHeading>
          <Timeline />
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ padding: "4rem 0", borderTop: "1px solid rgba(0,212,255,0.07)" }}>
        <div className="container-md">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {[
              { value: "93.00%", label: "Test Set Accuracy",      sub: "Hybrid V2 Model" },
              { value: "4",      label: "Classification Classes",  sub: "Glioma · Meningioma · Pituitary · None" },
              { value: "1,600+", label: "Test Images",             sub: "Independent evaluation set" },
              { value: "2-Path", label: "Architecture",            sub: "CNN + Morphology Fusion" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{
                  background: "rgba(15,40,90,0.75)",
                  border: "1px solid rgba(0,212,255,0.22)",
                  borderRadius: "14px",
                  padding: "1.75rem 1.25rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#00d4ff", lineHeight: 1.1, marginBottom: "0.375rem" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#e2f0ff", marginBottom: "0.25rem" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(160,200,240,0.4)" }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(0,212,255,0.07)", textAlign: "center" }}>
        <div className="container-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              background: "rgba(15,40,90,0.85)",
              border: "1px solid rgba(0,212,255,0.28)",
              borderRadius: "20px",
              padding: "3rem 2rem",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 60px rgba(0,212,255,0.05)",
            }}
          >
            <h2 style={{ fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#e2f0ff", marginBottom: "0.875rem", letterSpacing: "-0.01em" }}>
              Ready to Analyze an MRI?
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(160,200,240,0.65)", maxWidth: "440px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Upload a brain MRI scan and receive an AI-assisted classification result with Grad-CAM visual explanation.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/analysis" className="btn-primary">
                Analyze MRI <ArrowRight size={17} />
              </Link>
              <Link to="/tumors" className="btn-secondary">
                Explore Tumor Guide
              </Link>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "rgba(160,200,240,0.35)", marginTop: "1.5rem" }}>
              For educational and research purposes only · Not a clinical tool
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
