import React from "react";

/**
 * OutcomeStat — a credible KPI: large serif number with an optional unit, a
 * plain-language caption, and a small sourcing line. Honest, not hype.
 */
export function OutcomeStat({ value, unit, caption, source, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 72, lineHeight: 1,
        letterSpacing: "-0.02em", color: "var(--accent-deep)",
      }}>
        {value}{unit && <span style={{ fontSize: 32, color: "var(--accent)" }}>{unit}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.45, color: "var(--ink-muted)" }}>
        {caption}
      </div>
      {source && (
        <div style={{
          fontFamily: "var(--font-meta)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--ink-faint)", marginTop: 4,
        }}>{source}</div>
      )}
    </div>
  );
}
