import React from "react";

/**
 * TestimonialCard — a designed quote, not a copied review. Serif quote with a
 * raised quotation mark, attribution under a hairline. Optional accent rule.
 */
export function TestimonialCard({ quote, name, role, style = {} }) {
  return (
    <figure style={{
      margin: 0, padding: "32px 34px", background: "var(--paper)",
      border: "1px solid var(--line)", borderRadius: "var(--r-md)",
      borderTop: "3px solid var(--accent)", boxShadow: "var(--shadow-card)",
      display: "flex", flexDirection: "column", gap: 22, ...style,
    }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 0.2, height: 26, color: "var(--accent)" }}>&ldquo;</span>
      <blockquote style={{
        margin: 0, fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, lineHeight: 1.4,
        letterSpacing: "-0.01em", color: "var(--ink)",
      }}>{quote}</blockquote>
      <figcaption style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 6 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{name}</div>
        {role && <div style={{
          fontFamily: "var(--font-meta)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--ink-faint)", borderLeft: "1px solid var(--line)", paddingLeft: 14,
        }}>{role}</div>}
      </figcaption>
    </figure>
  );
}
