import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const getClassName = (value) => {
  if (!value) return "";

  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("_", "");
};

const CustomTooltip = ({
  active,
  payload,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div
      style={{
        background:
          "rgba(5,20,45,0.96)",
        border:
          "1px solid rgba(0,212,255,0.35)",
        borderRadius: "8px",
        padding:
          "0.65rem 0.85rem",
      }}
    >
      <div
        style={{
          color: "#e2f0ff",
          fontWeight: 700,
          marginBottom: "0.2rem",
        }}
      >
        {item.displayName}
      </div>

      <div
        style={{
          color:
            "var(--color-blue-600)",
          fontWeight: 700,
        }}
      >
        {item.pct.toFixed(1)}%
      </div>
    </div>
  );
};

export default function ConfidenceChart({
  probabilities = [],
  topPrediction,
}) {
  /* Always protect against undefined/non-array data */

  const safeProbabilities =
    Array.isArray(probabilities)
      ? probabilities
      : [];

  const data = safeProbabilities
    .map((item) => {
      const value = Number(
        item?.probability ?? 0
      );

      const normalized =
        value > 1
          ? value / 100
          : value;

      return {
        class:
          item?.class ||
          item?.label ||
          item?.name ||
          "unknown",

        displayName:
          item?.displayName ||
          item?.display_name ||
          item?.label ||
          item?.name ||
          item?.class ||
          "Unknown",

        probability:
          Math.max(
            0,
            Math.min(
              normalized,
              1
            )
          ),
      };
    })
    .filter(
      (item) =>
        item.class !== "unknown"
    )
    .map((item) => ({
      ...item,
      pct:
        item.probability * 100,
    }));

  console.log(
    "ConfidenceChart probabilities:",
    probabilities
  );

  console.log(
    "ConfidenceChart chart data:",
    data
  );

  /* --------------------------------------------------
     NO DATA
  -------------------------------------------------- */

  if (data.length === 0) {
    return (
      <div
        style={{
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color:
            "rgba(160,200,240,0.7)",
          fontSize: "0.95rem",
        }}
      >
        Probability data is not available.
      </div>
    );
  }

  return (
    <div>
      {/* =================================================
          BAR CHART
      ================================================= */}

      <div
        style={{
          width: "100%",
          height: 220,
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 45,
              bottom: 5,
              left: 5,
            }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) =>
                `${value}%`
              }
              tick={{
                fontSize: 11,
                fill:
                  "rgba(160,200,240,0.65)",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              type="category"
              dataKey="displayName"
              width={125}
              tick={{
                fontSize: 12,
                fill: "#e2f0ff",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                fill:
                  "rgba(0,212,255,0.04)",
              }}
            />

            <Bar
              dataKey="pct"
              radius={[
                0,
                6,
                6,
                0,
              ]}
              isAnimationActive
              animationDuration={800}
            >
              {data.map(
                (entry, index) => {
                  const isTop =
                    getClassName(
                      entry.class
                    ) ===
                    getClassName(
                      topPrediction
                    );

                  return (
                    <Cell
                      key={index}
                      fill={
                        isTop
                          ? "var(--color-blue-600)"
                          : entry.class ===
                            "notumor"
                            ? "var(--color-teal-600)"
                            : "rgba(180,210,235,0.55)"
                      }
                    />
                  );
                }
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* =================================================
          DETAIL ROWS
      ================================================= */}

      <div
        style={{
          marginTop: "1rem",
        }}
      >
        {data.map((row) => {
          const isTop =
            getClassName(
              row.class
            ) ===
            getClassName(
              topPrediction
            );

          return (
            <div
              key={row.class}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom:
                  "0.75rem",
              }}
            >
              {/* Indicator */}

              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "3px",
                  background:
                    isTop
                      ? "var(--color-blue-600)"
                      : row.class ===
                        "notumor"
                        ? "var(--color-teal-600)"
                        : "rgba(180,210,235,0.55)",
                  flexShrink: 0,
                }}
              />

              {/* Name */}

              <span
                style={{
                  width: "135px",
                  fontSize:
                    "0.875rem",
                  fontWeight:
                    isTop
                      ? 700
                      : 500,
                  color:
                    "#e2f0ff",
                }}
              >
                {row.displayName}
              </span>

              {/* Percentage */}

              <span
                style={{
                  width: "55px",
                  textAlign: "right",
                  fontSize:
                    "0.875rem",
                  fontWeight:
                    isTop
                      ? 700
                      : 500,
                  color:
                    isTop
                      ? "var(--color-blue-600)"
                      : "rgba(160,200,240,0.75)",
                }}
              >
                {row.pct.toFixed(1)}%
              </span>

              {/* Progress */}

              <div
                style={{
                  flex: 1,
                  height: "7px",
                  background:
                    "rgba(0,212,255,0.08)",
                  borderRadius:
                    "999px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${row.pct}%`,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  style={{
                    height: "100%",
                    borderRadius:
                      "999px",
                    background:
                      isTop
                        ? "var(--color-blue-600)"
                        : row.class ===
                          "notumor"
                          ? "var(--color-teal-600)"
                          : "rgba(180,210,235,0.55)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}