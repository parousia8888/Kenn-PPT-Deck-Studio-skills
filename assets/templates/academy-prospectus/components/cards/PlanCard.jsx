import React from "react";

/**
 * PlanCard — an enrollment / pricing column. Tier label, serif price, a list
 * of inclusions with soft accent bullets. Set `feature` for the chosen tier.
 */
export function PlanCard({ tier, price, per = "/ term", items = [], feature = false, style = {} }) {
  return (
    <div style={{
      border: feature ? "1px solid var(--accent)" : "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      padding: "26px 24px 24px",
      display: "flex", flexDirection: "column", gap: 12,
      background: feature ? "color-mix(in srgb, var(--accent-field) 55%, var(--paper))" : "var(--paper)",
      boxShadow: feature ? "var(--shadow-card)" : "none",
      ...style,
    }}>
      <span style={{ fontFamily: "var(--font-meta)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
        {tier}
      </span>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, lineHeight: 1, color: "var(--ink)" }}>
        {price}<span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-faint)" }}> {per}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map((it, i) => (
          <li key={i} style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.4,
            paddingLeft: 20, position: "relative",
          }}>
            <span style={{ position: "absolute", left: 0, top: 8, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", opacity: 0.55 }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
