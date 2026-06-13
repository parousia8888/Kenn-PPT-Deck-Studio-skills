import React from "react";
import { SourceNote } from "./SourceNote.jsx";

/**
 * Proof Atlas — Metric
 * Large, light-weight number with unit, label, optional delta and source.
 */
export function Metric({
  value,
  unit,
  label,
  delta,
  deltaDir,
  method,
  id,
  size = "l",
  ...rest
}) {
  const sizes = { xl: "92px", l: "64px", m: "44px", s: "32px" };
  const fz = sizes[size] || sizes.l;
  const dir = deltaDir || (delta && String(delta).trim().startsWith("-") ? "down" : "up");
  const deltaColor = dir === "down" ? "var(--marker-down)" : "var(--marker-up)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} {...rest}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: fz,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: "0.4em", fontWeight: 300, color: "var(--gray-1)", marginLeft: "2px" }}>
              {unit}
            </span>
          )}
        </span>
        {delta != null && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.04em",
              color: deltaColor,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{dir === "down" ? "▾" : "▴"}</span>
            {delta}
          </span>
        )}
      </div>
      {label && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--gray-1)", lineHeight: 1.4, maxWidth: "32ch" }}>
          {label}
        </div>
      )}
      {(method || id) && <SourceNote method={method} id={id} />}
    </div>
  );
}
