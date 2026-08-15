import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Brain,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

// =====================================================
// NAVIGATION LINKS
// =====================================================

const navLinks = [
  {
    to: "/",
    label: "Dashboard",
  },
  {
    to: "/analysis",
    label: "MRI Analysis",
  },
  {
    to: "/tumors",
    label: "Tumor Guide",
  },
  {
    to: "/history",
    label: "History",
  },
  {
    to: "/about",
    label: "About",
  },
];

// =====================================================
// NAVBAR
// =====================================================

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ===================================================
  // READ CURRENT USER
  // ===================================================

  const readCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem("current_user");

      if (!storedUser) {
        setCurrentUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        setCurrentUser(parsedUser);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(
        "Unable to read current user:",
        error
      );

      setCurrentUser(null);
    }
  };

  // ===================================================
  // INITIAL AUTH STATE
  // ===================================================

  useEffect(() => {
    readCurrentUser();
  }, []);

  // ===================================================
  // ROUTE CHANGE
  // ===================================================

  useEffect(() => {
    setMenuOpen(false);
    readCurrentUser();
  }, [pathname]);

  // ===================================================
  // STORAGE CHANGE
  // ===================================================

  useEffect(() => {
    const handleStorageChange = () => {
      readCurrentUser();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ===================================================
  // SCROLL
  // ===================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("current_user");

    setCurrentUser(null);
    setMenuOpen(false);

    navigate("/signin");
  };

  // ===================================================
  // DISPLAY NAME
  // ===================================================

  const displayName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    "User";

  // ===================================================
  // ACTIVE ROUTE
  // ===================================================

  const isActive = (link) => {
    if (link.to === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(link.to);
  };

  // ===================================================
  // DESKTOP NAV LINK
  // ===================================================

  const renderNavLink = (link) => {
    const active = isActive(link);

    return (
      <Link
        key={link.to}
        to={link.to}
        aria-current={active ? "page" : undefined}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",

          height: "38px",
          padding: "0 1rem",

          borderRadius: "999px",

          fontSize: "0.9rem",
          fontWeight: active ? 700 : 500,

          color: active
            ? "#061624"
            : "rgba(160,200,240,0.8)",

          textDecoration: "none",
          whiteSpace: "nowrap",

          zIndex: 1,
        }}
      >
        {active && (
          <motion.div
            layoutId="navbar-active-pill"
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "999px",

              background:
                "linear-gradient(135deg, #00d4ff, #0096c7)",

              boxShadow:
                "0 0 16px rgba(0,212,255,0.45)",

              zIndex: -1,
            }}
          />
        )}

        <span
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {link.label}
        </span>
      </Link>
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,

          zIndex: 100,

          width: "100%",
          height: "76px",

          background:
            scrolled || menuOpen
              ? "rgba(2,11,24,0.96)"
              : "rgba(2,11,24,0.78)",

          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",

          borderBottom:
            "1px solid rgba(0,212,255,0.12)",

          boxSizing: "border-box",
        }}
      >
        {/* =================================================
            DESKTOP
        ================================================= */}

        <div
          className="navbar-desktop"
          style={{
            height: "100%",
            width: "100%",

            display: "grid",
            gridTemplateColumns:
              "minmax(220px, 1fr) auto minmax(220px, 1fr)",

            alignItems: "center",

            padding: "0 1.25rem",
            boxSizing: "border-box",
          }}
        >
          {/* ===============================================
              LEFT: LOGO
          =============================================== */}

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",

              justifySelf: "start",

              textDecoration: "none",

              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",

                flexShrink: 0,

                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.14), rgba(0,150,199,0.16))",

                border:
                  "1.5px solid rgba(0,212,255,0.5)",

                borderRadius: "11px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                boxShadow:
                  "0 0 16px rgba(0,212,255,0.2)",
              }}
            >
              <Brain
                size={21}
                color="#00d4ff"
                strokeWidth={1.7}
              />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#e2f0ff",
                  lineHeight: 1.1,

                  whiteSpace: "nowrap",
                }}
              >
                NeuroScan AI
              </div>

              <div
                style={{
                  marginTop: "0.15rem",

                  fontSize: "0.67rem",

                  color:
                    "rgba(0,212,255,0.7)",

                  fontWeight: 600,

                  letterSpacing: "0.035em",

                  whiteSpace: "nowrap",
                }}
              >
                Brain MRI Analysis
              </div>
            </div>
          </Link>

          {/* ===============================================
              CENTER: NAVIGATION
          =============================================== */}

          <nav
            aria-label="Primary navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: "0.15rem",

              background:
                "rgba(5,20,55,0.72)",

              border:
                "1px solid rgba(0,212,255,0.25)",

              borderRadius: "999px",

              padding: "0.35rem",

              boxShadow:
                "0 4px 22px rgba(0,0,0,0.35)",

              whiteSpace: "nowrap",

              flexShrink: 0,
            }}
          >
            {navLinks.map(renderNavLink)}
          </nav>

          {/* ===============================================
              RIGHT: AUTH
          =============================================== */}

          <div
            style={{
              justifySelf: "end",

              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",

              gap: "0.6rem",

              minWidth: 0,
            }}
          >
            {currentUser ? (
              <>
                {/* USER */}

                <div
                  title={displayName}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",

                    gap: "0.45rem",

                    padding:
                      "0.55rem 0.8rem",

                    borderRadius: "999px",

                    background:
                      "rgba(0,212,255,0.07)",

                    border:
                      "1px solid rgba(0,212,255,0.18)",

                    color: "#dceeff",

                    fontSize: "0.82rem",
                    fontWeight: 600,

                    maxWidth: "170px",

                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",

                      flexShrink: 0,

                      borderRadius: "50%",

                      background: "#00d4ff",

                      boxShadow:
                        "0 0 9px rgba(0,212,255,0.85)",
                    }}
                  />

                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Hi, {displayName}
                  </span>
                </div>

                {/* SIGN OUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",

                    gap: "0.4rem",

                    height: "38px",

                    padding:
                      "0 0.95rem",

                    border:
                      "1px solid rgba(0,212,255,0.35)",

                    borderRadius: "999px",

                    background:
                      "linear-gradient(135deg, #00d4ff, #0096c7)",

                    color: "#02111f",

                    fontSize: "0.83rem",
                    fontWeight: 800,

                    cursor: "pointer",

                    whiteSpace: "nowrap",

                    boxShadow:
                      "0 0 16px rgba(0,212,255,0.28)",
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",

                  height: "38px",

                  padding:
                    "0 1.2rem",

                  borderRadius: "999px",

                  background:
                    "linear-gradient(135deg, #00d4ff, #0096c7)",

                  color: "#02111f",

                  fontSize: "0.9rem",
                  fontWeight: 800,

                  textDecoration: "none",

                  whiteSpace: "nowrap",

                  boxShadow:
                    "0 0 16px rgba(0,212,255,0.3)",
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div
          className="navbar-mobile"
          style={{
            display: "none",

            height: "100%",

            alignItems: "center",
            justifyContent: "space-between",

            padding: "0 1rem",
            boxSizing: "border-box",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",

              gap: "0.55rem",

              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",

                background:
                  "rgba(0,212,255,0.1)",

                border:
                  "1px solid rgba(0,212,255,0.45)",

                borderRadius: "10px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain
                size={19}
                color="#00d4ff"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#e2f0ff",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                NeuroScan AI
              </div>

              <div
                style={{
                  color:
                    "rgba(0,212,255,0.7)",

                  fontSize: "0.6rem",
                  fontWeight: 600,
                }}
              >
                Brain MRI Analysis
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            style={{
              width: "42px",
              height: "42px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "rgba(0,212,255,0.08)",

              border:
                "1px solid rgba(0,212,255,0.3)",

              borderRadius: "10px",

              color: "#00d4ff",
              cursor: "pointer",
            }}
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </header>

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            style={{
              position: "fixed",

              top: "76px",

              left: "0.75rem",
              right: "0.75rem",

              zIndex: 99,

              padding: "0.8rem",

              background:
                "rgba(3,14,32,0.98)",

              border:
                "1px solid rgba(0,212,255,0.2)",

              borderRadius: "14px",

              backdropFilter:
                "blur(18px)",

              boxShadow:
                "0 15px 40px rgba(0,0,0,0.45)",
            }}
          >
            {navLinks.map((link) => {
              const active =
                isActive(link);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  style={{
                    display: "block",

                    padding:
                      "0.8rem 1rem",

                    marginBottom:
                      "0.25rem",

                    borderRadius: "10px",

                    textDecoration:
                      "none",

                    color: active
                      ? "#00d4ff"
                      : "#b9d7f5",

                    fontWeight: active
                      ? 700
                      : 500,

                    background: active
                      ? "rgba(0,212,255,0.09)"
                      : "transparent",

                    border: active
                      ? "1px solid rgba(0,212,255,0.2)"
                      : "1px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {currentUser ? (
              <>
                <div
                  style={{
                    marginTop: "0.5rem",

                    padding:
                      "0.8rem 1rem",

                    borderRadius: "10px",

                    background:
                      "rgba(0,212,255,0.06)",

                    border:
                      "1px solid rgba(0,212,255,0.15)",

                    color: "#e2f0ff",

                    fontWeight: 600,

                    fontSize: "0.9rem",

                    textAlign: "center",
                  }}
                >
                  Hi, {displayName}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",

                    marginTop:
                      "0.5rem",

                    padding:
                      "0.8rem 1rem",

                    borderRadius: "10px",

                    border:
                      "1px solid rgba(0,212,255,0.3)",

                    background:
                      "linear-gradient(135deg, #00d4ff, #0096c7)",

                    color: "#02111f",

                    fontWeight: 800,

                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() =>
                  setMenuOpen(false)
                }
                style={{
                  display: "block",

                  marginTop:
                    "0.5rem",

                  padding:
                    "0.8rem 1rem",

                  borderRadius: "10px",

                  background:
                    "linear-gradient(135deg, #00d4ff, #0096c7)",

                  color: "#02111f",

                  fontWeight: 800,

                  textAlign: "center",

                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          RESPONSIVE
      =================================================== */}

      <style>{`
        @media (max-width: 1120px) {
          .navbar-desktop {
            grid-template-columns:
              minmax(180px, 1fr)
              auto
              minmax(200px, 1fr) !important;
          }

          .navbar-desktop nav a {
            padding-left: 0.65rem !important;
            padding-right: 0.65rem !important;
            font-size: 0.82rem !important;
          }

          .navbar-desktop > div:last-child {
            gap: 0.35rem !important;
          }
        }

        @media (max-width: 900px) {
          .navbar-desktop {
            display: none !important;
          }

          .navbar-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}