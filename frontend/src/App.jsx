import React, { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Results from "./pages/Results";
import TumorGuide from "./pages/TumorGuide";
import TumorDetails from "./pages/TumorDetails";
import History from "./pages/History";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";

/* =========================================================
   GLOBAL BRAIN NETWORK BACKGROUND
========================================================= */

function BrainNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let animationId;

    const nodes = [];
    const NODE_COUNT = 55;
    const MAX_DIST = 160;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Move nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.018;

        if (node.x < 0 || node.x > W) {
          node.vx *= -1;
        }

        if (node.y < 0 || node.y > H) {
          node.vy *= -1;
        }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < MAX_DIST) {
            const alpha =
              (1 - distance / MAX_DIST) * 0.18;

            ctx.beginPath();
            ctx.moveTo(
              nodes[i].x,
              nodes[i].y
            );
            ctx.lineTo(
              nodes[j].x,
              nodes[j].y
            );

            ctx.strokeStyle =
              `rgba(0,212,255,${alpha})`;

            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const glow =
          0.35 +
          Math.sin(node.pulse) * 0.25;

        const gradient =
          ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.r * 3
          );

        gradient.addColorStop(
          0,
          `rgba(0,212,255,${glow})`
        );

        gradient.addColorStop(
          1,
          "rgba(0,212,255,0)"
        );

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.r * 3,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(0,212,255,${glow * 0.9})`;

        ctx.fill();
      });

      animationId =
        requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}

/* =========================================================
   PAGE TRANSITION
========================================================= */

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.28,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   404 PAGE
========================================================= */

function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3rem",
        color: "rgba(160,200,240,0.65)",
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "var(--color-border)",
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        404
      </div>

      <h2
        style={{
          fontWeight: 700,
          color: "#e2f0ff",
          marginBottom: "0.5rem",
        }}
      >
        Page not found
      </h2>

      <p
        style={{
          marginBottom: "1.5rem",
        }}
      >
        The page you're looking for doesn't exist.
      </p>

      <a
        href="/"
        className="btn-primary"
      >
        Back to Dashboard
      </a>
    </div>
  );
}

/* =========================================================
   ROUTES
========================================================= */

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
    >
      <Routes
        location={location}
        key={location.pathname}
      >
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        {/* MRI Analysis */}
        <Route
          path="/analysis"
          element={
            <PageTransition>
              <Analysis />
            </PageTransition>
          }
        />

        {/* Results */}
        <Route
          path="/results"
          element={
            <PageTransition>
              <Results />
            </PageTransition>
          }
        />

        {/* Tumor Guide */}
        <Route
          path="/tumors"
          element={
            <PageTransition>
              <TumorGuide />
            </PageTransition>
          }
        />

        {/* =================================================
            MAIN TUMOR DETAILS ROUTE
        ================================================= */}
        <Route
          path="/tumors/:slug"
          element={
            <PageTransition>
              <TumorDetails />
            </PageTransition>
          }
        />

        {/* =================================================
            COMPATIBILITY ROUTE
            Allows /tumor/meningioma too
        ================================================= */}
        <Route
          path="/tumor/:slug"
          element={
            <PageTransition>
              <TumorDetails />
            </PageTransition>
          }
        />

        {/* History */}
        <Route
          path="/history"
          element={
            <PageTransition>
              <History />
            </PageTransition>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />

        {/* Sign In */}
        <Route
          path="/signin"
          element={
            <PageTransition>
              <SignIn />
            </PageTransition>
          }
        />

        {/* Sign Up */}
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignUp />
            </PageTransition>
          }
        />

        {/* Reset Password */}
        <Route
          path="/reset-password"
          element={
            <PageTransition>
              <ResetPassword />
            </PageTransition>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      {/* Base background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,100,180,0.10) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 10% 80%, rgba(0,212,255,0.04) 0%, transparent 60%), " +
            "#061624",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Animated network */}
      <BrainNetworkBackground />

      {/* App shell */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navbar />

        <div
          style={{
            flex: 1,
          }}
        >
          <AppRoutes />
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}