import React from "react";

/**
 * Eyebrow — a small-caps chapter label with a short rule, used above titles.
 * Inherits the section `--accent`.
 */
export function Eyebrow({ children, style = {}, ...rest }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--accent)",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 28, height: 1.5, background: "var(--accent)", display: "inline-block" }} />
      {children}
    </span>
  );
}
