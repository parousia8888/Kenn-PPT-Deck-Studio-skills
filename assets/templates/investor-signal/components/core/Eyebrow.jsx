import React from "react";

/* Mono uppercase label that sits above a claim or section.
   Doubles as a source/footnote label via `tone="muted"`. */
export function Eyebrow({ children, tone = "accent", as = "div", style, ...rest }) {
  const Tag = as;
  const color =
    tone === "muted" ? "var(--text-muted)" :
    tone === "secondary" ? "var(--text-secondary)" :
    "var(--accent)";
  return (
    <Tag
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-mono)",
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        fontWeight: "var(--fw-medium)",
        color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
