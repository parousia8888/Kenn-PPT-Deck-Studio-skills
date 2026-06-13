import React from "react";

/* Launch Theatre — FeatureCell
 * One feature in a trio: a drawing hairline above, mono index, name, line.
 * The `lt-feature__line` class wires into the feature-trio motion recipe so
 * the rule draws in on reveal. Pass `i` to stagger within a row. */
export function FeatureCell({ index, name, children, icon, i = 0, style, ...rest }) {
  return (
    <div data-anim="feature" style={{ "--i": i, display: "flex", flexDirection: "column", gap: 16, ...style }} {...rest}>
      <span className="lt-feature__line" style={{ "--i": i, height: 1, width: "100%", background: "var(--accent)", boxShadow: "var(--glow-soft)" }} />
      {index != null ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", color: "var(--text-faint)" }}>
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      {icon ? <div style={{ color: "var(--accent)", display: "inline-flex" }}>{icon}</div> : null}
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(1.3rem, 1.8vw, 1.9rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "var(--text-primary)",
        }}
      >
        {name}
      </h3>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)", maxWidth: "32ch", textWrap: "pretty" }}>
        {children}
      </p>
    </div>
  );
}
