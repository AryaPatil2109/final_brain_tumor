import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Forgot / Reset Password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = request reset token, 2 = reset password
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address.");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }
      setResetToken(data.reset_token);
      setForgotSuccess("Simulated reset token generated successfully. Please enter your new password below.");
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || "Failed to request password reset.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (!newPassword || !confirmPassword) {
      setForgotError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          new_password: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }
      setForgotSuccess("Your password has been reset successfully. You can now log in!");
      // Reset state and close modal after 2.5 seconds
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotEmail("");
        setForgotStep(1);
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotSuccess("");
        // Autofill email for user convenience
        setEmail(forgotEmail);
      }, 2500);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          data?.detail ||
          "Invalid email or password.";

        throw new Error(message);
      }

      /*
       * Backend returns:
       *
       * {
       *   access_token: "...",
       *   token_type: "bearer",
       *   user: {
       *     id: 1,
       *     name: "...",
       *     email: "...",
       *     role: "user",
       *     created_at: "..."
       *   }
       * }
       */

      const accessToken = data?.access_token;
      const user = data?.user;

      if (!accessToken || !user) {
        throw new Error(
          "Login succeeded, but user information was not returned."
        );
      }

      /*
       * Store authentication information.
       *
       * sessionStorage keeps the login for the current
       * browser tab/session.
       */
      sessionStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "access_token",
        accessToken
      );

      localStorage.setItem(
        "current_user",
        JSON.stringify(user)
      );
      /*
       * Small delay so the user can see the
       * successful login message.
       */
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
        "Unable to sign in. Please check that the backend is running."
      );

      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 1rem 60px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        style={{
          background:
            "rgba(10, 25, 55, 0.75)",
          border:
            "1px solid rgba(0, 212, 255, 0.15)",
          borderRadius: "20px",
          padding: "2rem 2.25rem",
          width: "100%",
          maxWidth: "440px",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* SIDE ACCENT */}

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "10%",
            bottom: "10%",
            width: "1.5px",
            background:
              "linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.45), transparent)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform:
                "translate(-50%, -50%)",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#00d4ff",
              boxShadow:
                "0 0 10px #00d4ff, 0 0 20px #00d4ff",
              animation:
                "pulse 2s infinite ease-in-out",
            }}
          />
        </div>

        {/* BADGE */}

        <div
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color:
              "rgba(0, 212, 255, 0.85)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
          }}
        >
          Sign In
        </div>

        {/* TITLE */}

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.25,
            marginBottom: "0.5rem",
            letterSpacing: "-0.01em",
          }}
        >
          Welcome Back to{" "}
          <span
            style={{
              color: "#00d4ff",
            }}
          >
            NeuroScan AI
          </span>
        </h1>

        <p
          style={{
            fontSize: "0.875rem",
            color:
              "rgba(160, 200, 240, 0.7)",
            marginBottom: "1.25rem",
            lineHeight: 1.5,
          }}
        >
          Securely access your Brain MRI
          Analysis Portal
        </p>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background:
                "rgba(239, 68, 68, 0.1)",
              border:
                "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "10px",
              padding:
                "0.75rem 1rem",
              color: "#ef4444",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            style={{
              background:
                "rgba(16, 185, 129, 0.1)",
              border:
                "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding:
                "0.75rem 1rem",
              color: "#10b981",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              fontWeight: 600,
            }}
          >
            Login successful. Welcome back!
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
          }}
        >
          {/* EMAIL */}

          <div
            style={{
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color:
                  "rgba(160, 200, 240, 0.4)",
                display: "flex",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Mail size={16} />
            </span>

            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding:
                  "0.875rem 1rem 0.875rem 2.75rem",
                background:
                  "rgba(5, 15, 35, 0.65)",
                border:
                  "1.5px solid rgba(0, 212, 255, 0.2)",
                borderRadius: "12px",
                color: "#e2f0ff",
                fontSize: "0.9375rem",
                outline: "none",
                transition:
                  "border-color 0.25s, box-shadow 0.25s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor =
                  "#00d4ff";

                e.target.style.boxShadow =
                  "0 0 12px rgba(0, 212, 255, 0.25)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  "rgba(0, 212, 255, 0.2)";

                e.target.style.boxShadow =
                  "none";
              }}
            />
          </div>

          {/* PASSWORD */}

          <div>
            <div
              style={{
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "rgba(160, 200, 240, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <Lock size={16} />
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                autoComplete="current-password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "0.875rem 3rem 0.875rem 2.75rem",
                  background:
                    "rgba(5, 15, 35, 0.65)",
                  border:
                    "1.5px solid rgba(0, 212, 255, 0.2)",
                  borderRadius: "12px",
                  color: "#e2f0ff",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition:
                    "border-color 0.25s, box-shadow 0.25s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    "#00d4ff";

                  e.target.style.boxShadow =
                    "0 0 12px rgba(0, 212, 255, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    "rgba(0, 212, 255, 0.2)";

                  e.target.style.boxShadow =
                    "none";
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color:
                    "rgba(160, 200, 240, 0.5)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            {/* FORGOT PASSWORD */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "0.8125rem",
                  color: "#00d4ff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading || success}
            style={{
              background:
                "linear-gradient(135deg, #00d4ff, #0096c7)",
              color: "#020b18",
              padding: "0.875rem",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9375rem",
              border: "none",
              cursor:
                loading || success
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading || success
                  ? 0.75
                  : 1,
              transition:
                "transform 0.15s, box-shadow 0.2s, opacity 0.2s",
              boxShadow:
                "0 4px 18px rgba(0, 212, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* SIGN UP */}

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.875rem",
            color:
              "rgba(160, 200, 240, 0.6)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#00d4ff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(3, 11, 18, 0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => {
              if (!forgotLoading) {
                setShowForgotModal(false);
                setForgotError("");
                setForgotSuccess("");
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.24 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "440px",
                background: "rgba(10, 25, 41, 0.75)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
                borderRadius: "16px",
                padding: "2.5rem",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                position: "relative",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotError("");
                  setForgotSuccess("");
                }}
                disabled={forgotLoading}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "rgba(160, 200, 240, 0.6)",
                  cursor: "pointer",
                  padding: "0.25rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(160, 200, 240, 0.6)")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Title */}
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#e2f0ff",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
              </h3>
              
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(160, 200, 240, 0.75)",
                  marginBottom: "1.5rem",
                  lineHeight: 1.5,
                }}
              >
                {forgotStep === 1
                  ? "Enter your email address and we'll generate a password reset token."
                  : "Enter your new password below to reset your credentials."}
              </p>

              {/* Messages */}
              {forgotError && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#f87171",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.8125rem",
                    marginBottom: "1.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#34d399",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.8125rem",
                    marginBottom: "1.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  {forgotSuccess}
                </div>
              )}

              {/* Step 1 Form: Email Request */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotPassword}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "rgba(160, 200, 240, 0.6)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(160, 200, 240, 0.4)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem 0.875rem 2.75rem",
                          background: "rgba(6, 22, 36, 0.8)",
                          border: "1px solid rgba(0, 212, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "0.9375rem",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 212, 255, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.875rem",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #00d4ff 0%, #090979 100%)",
                      color: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 212, 255, 0.2)",
                    }}
                  >
                    {forgotLoading ? "Processing..." : "Generate Reset Link"}
                    {!forgotLoading && <ArrowRight size={16} />}
                  </button>
                </form>
              )}

              {/* Step 2 Form: Reset Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword}>
                  {/* New Password */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "rgba(160, 200, 240, 0.6)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      New Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(160, 200, 240, 0.4)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Minimum 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem 0.875rem 2.75rem",
                          background: "rgba(6, 22, 36, 0.8)",
                          border: "1px solid rgba(0, 212, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "0.9375rem",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 212, 255, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "rgba(160, 200, 240, 0.6)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Confirm New Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "rgba(160, 200, 240, 0.4)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem 0.875rem 2.75rem",
                          background: "rgba(6, 22, 36, 0.8)",
                          border: "1px solid rgba(0, 212, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "0.9375rem",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 212, 255, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(0, 212, 255, 0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.875rem",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #00d4ff 0%, #090979 100%)",
                      color: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 212, 255, 0.2)",
                    }}
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                    {!forgotLoading && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}