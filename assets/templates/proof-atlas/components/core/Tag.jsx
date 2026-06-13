import React from "react";

/**
 * Proof Atlas — Tag
 * Mono uppercase structural label. Optional leading index/glyph.
 */
export function Tag({ children, variant = "default", index, ...rest }) {
  const variants = {
    default: { color: "var(--gray-1)", borderColor: "var(--rule)", background: "var(--paper-pure)" },
    accent: { color: "var(--blue)", borderColor: "var(--blue)", background: "transparent" },
    solid: { color: "var(--paper-pure)", borderColor: "var(--ink)", background: "var(--ink)" },
    risk: { color: "var(--oxide)", borderColor: "var(--oxide)", background: "transparent" },
  };
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        lineHeight: 1,
        padding: "4px 8px",
        border: "1px solid",
        borderRadius: "var(--r-1)",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        ...variants[variant],
      }}
      {...rest}
    >
      {index != null && (
        <span style={{ opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>
          {String(index).padStart(2, "0")}
        </span>
      )}
      {children}
    </span>
  );
}
