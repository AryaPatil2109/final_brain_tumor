import React from "react";
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "rgba(4, 14, 32, 0.95)",
        borderTop: "1px solid rgba(0,212,255,0.1)",
        padding: "2.5rem 0 1.5rem",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container-md">
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2rem",
            alignItems: "start",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                marginBottom: "0.625rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain size={16} color="#00d4ff" strokeWidth={1.75} />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#e2f0ff",
                }}
              >
                NeuroScan AI
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8375rem",
                color: "rgba(160,200,240,0.5)",
                maxWidth: "360px",
                lineHeight: 1.65,
              }}
            >
              AI-assisted brain MRI classification for educational and research
              purposes. Not a clinical diagnostic tool.
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {[
              { to: "/",        label: "Dashboard"    },
              { to: "/analysis",label: "MRI Analysis" },
              { to: "/tumors",  label: "Tumor Guide"  },
              { to: "/history", label: "History"      },
              { to: "/about",   label: "About"        },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(160,200,240,0.5)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(160,200,240,0.5)")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(0,212,255,0.07)",
            paddingTop: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(160,200,240,0.35)",
            }}
          >
            © {new Date().getFullYear()} NeuroScan AI · For educational and research
            purposes only · Not a clinical diagnostic tool
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              color: "rgba(160,200,240,0.3)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                animation: "pulse 2s infinite",
              }}
            />
            System Online
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
