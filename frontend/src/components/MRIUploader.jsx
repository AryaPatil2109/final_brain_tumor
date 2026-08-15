import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, AlertCircle, CheckCircle } from "lucide-react";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MRIUploader({ onFileSelected, onClear }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Invalid file type. Please upload a JPG or PNG image.";
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const processFile = useCallback(
    (f) => {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFileSelected && onFileSelected(f);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => {
    const f = e.target.files[0];
    if (f) processFile(f);
    e.target.value = "";
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    onClear && onClear();
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!file ? (
          /* ── Drop Zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={
                dragging
                  ? { scale: 1.01, borderColor: "var(--color-blue-600)" }
                  : { scale: 1, borderColor: "var(--color-border)" }
              }
              transition={{ duration: 0.15 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload MRI image — click or drag and drop"
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--color-blue-600)" : "var(--color-border)"}`,
                borderRadius: "16px",
                background: dragging
                  ? "var(--color-blue-50)"
                  : "#061624",
                padding: "4rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "background 0.2s ease",
                outline: "none",
              }}
            >
              <motion.div
                animate={dragging ? { y: -6 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  width: "64px",
                  height: "64px",
                  background: dragging
                    ? "var(--color-blue-600)"
                    : "var(--color-blue-50)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  transition: "background 0.2s ease",
                }}
              >
                <Upload
                  size={28}
                  color={dragging ? "#fff" : "var(--color-blue-600)"}
                  strokeWidth={1.75}
                />
              </motion.div>

              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#e2f0ff",
                  marginBottom: "0.5rem",
                }}
              >
                {dragging ? "Drop MRI here" : "Drag & Drop MRI Image"}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(160,200,240,0.65)",
                  marginBottom: "1.25rem",
                }}
              >
                or{" "}
                <span
                  style={{
                    color: "var(--color-blue-600)",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  browse from your device
                </span>
              </p>
              <div
                style={{
                  display: "inline-flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {["JPG", "JPEG", "PNG"].map((ext) => (
                  <span
                    key={ext}
                    style={{
                      background: "var(--color-white)",
                      border: "1px solid rgba(0,212,255,0.22)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.625rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "rgba(160,200,240,0.65)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {ext}
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(160,200,240,0.65)",
                  marginTop: "0.75rem",
                }}
              >
                Maximum size: {MAX_SIZE_MB} MB
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* ── Preview State ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "rgba(15,40,90,0.88)",
              borderRadius: "16px",
              border: "1px solid rgba(0,212,255,0.22)",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#0a1628",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "260px",
                position: "relative",
              }}
            >
              <img
                src={preview}
                alt="Uploaded brain MRI scan preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "360px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <button
                onClick={handleClear}
                aria-label="Remove uploaded image"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(220,38,38,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.15)")
                }
              >
                <X size={15} />
              </button>
            </div>

            <div
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(0,212,255,0.07)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image size={18} color="var(--color-blue-600)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#e2f0ff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(160,200,240,0.65)",
                  }}
                >
                  {formatBytes(file.size)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  color: "var(--color-success)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                <CheckCircle size={15} />
                Ready
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              marginTop: "0.75rem",
              color: "var(--color-error)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
            role="alert"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}
