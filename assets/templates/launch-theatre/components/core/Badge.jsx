import React from "react";

/* Launch Theatre — Badge
 * Small tracked-mono chip for status and labels: version tags, "LIVE",
 * "NEW", "PREVIEW". Use `dot` for a glowing live indicator. */
export function Badge({ children, variant = "default", dot = false, style, ...rest }) {
  const variants = {
    default: { color: "var(--text-secondary)", border: "var(--hairline-strong)", bg: "transparent" },
    accent: { color: "var(--accent)", border: "var(--hairline-accent)", bg: "rgba(var(--accent-rgb), 0.08)" },
    solid: { color: "#04181a", border: "transparent", bg: "var(--accent)" },
    muted: { color: "var(--text-muted)", border: "var(--hairline)", bg: "transparent" },
  };
  const v = variants[variant] || variants.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "6px 12px",
        borderRadius: "var(--radius-xs)",
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", boxShadow: "0 0 8px currentColor", flex: "0 0 auto" }} />
      ) : null}
      {children}
    </span>
  );
}
