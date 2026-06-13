import React from "react";

/* Small status / stage chip. Sharp corners, hairline or accent fill.
   Variants: outline (default), accent (filled signal), solid (neutral). */
export function Badge({ children, variant = "outline", dot = false, style, ...rest }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--sp-2)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase",
    fontWeight: "var(--fw-medium)",
    padding: "5px 9px",
    borderRadius: "var(--radius-1)",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  const variants = {
    outline: { border: "1px solid var(--hairline)", color: "var(--text-secondary)", background: "transparent" },
    accent: { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" },
    solid: { background: "var(--surface-card)", color: "var(--text-primary)", border: "1px solid var(--hairline)" },
  };
  return (
    <span style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: "999px",
          background: variant === "accent" ? "var(--accent-ink)" : "var(--accent)",
        }} />
      )}
      {children}
    </span>
  );
}
