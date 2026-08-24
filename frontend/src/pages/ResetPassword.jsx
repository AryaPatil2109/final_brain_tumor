import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No password reset token was found in the URL.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Cannot reset password without a valid reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to reset password.");
      }

      setSuccess("Your password has been reset successfully! Redirecting you to sign in...");
      
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(10, 25, 41, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 212, 255, 0.15)",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            NeuroScan <span style={{ color: "#00d4ff" }}>AI</span>
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(160, 200, 240, 0.65)",
              marginTop: "0.25rem",
              marginBottom: 0,
            }}
          >
            Reset Your Account Password
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#f87171",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              marginBottom: "1.5rem",
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#34d399",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              marginBottom: "1.5rem",
              lineHeight: 1.4,
            }}
          >
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div style={{ marginBottom: "1.25rem" }}>
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
                type={showPassword ? "text" : "password"}
                required
                disabled={loading || !token}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 2.75rem 0.875rem 2.75rem",
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
              <button
                type="button"
                disabled={!token}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(160, 200, 240, 0.4)",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div style={{ marginBottom: "2rem" }}>
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
              Confirm Password
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
                type={showPassword ? "text" : "password"}
                required
                disabled={loading || !token}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 2.75rem 0.875rem 2.75rem",
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || !token}
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
              background: (!loading && token)
                ? "linear-gradient(135deg, #00d4ff 0%, #090979 100%)"
                : "rgba(255, 255, 255, 0.05)",
              color: (!loading && token) ? "#fff" : "rgba(255,255,255,0.3)",
              cursor: (!loading && token) ? "pointer" : "not-allowed",
              boxShadow: (!loading && token) ? "0 4px 15px rgba(0, 212, 255, 0.2)" : "none",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              "Updating Password..."
            ) : (
              <>
                Update Password
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
