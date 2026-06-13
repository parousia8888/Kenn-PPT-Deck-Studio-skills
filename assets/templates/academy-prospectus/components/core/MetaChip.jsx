import React from "react";

/**
 * MetaChip — the signature mono metadata token: course codes, age groups,
 * lesson durations, module labels. Tinted (filled) or bare.
 */
export function MetaChip({ children, bare = false, style = {}, ...rest }) {
  const base = {
    fontFamily: "var(--font-meta)",
    fontSize: 11.5,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
    borderRadius: "var(--r-pill)",
  };
  const filled = {
    color: "var(--accent-deep)",
    background: "var(--accent-field)",
    border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
    padding: "6px 13px",
  };
  const bareStyle = {
    color: "var(--ink-faint)",
    background: "transparent",
    border: "none",
    padding: 0,
  };
  return (
    <span style={{ ...base, ...(bare ? bareStyle : filled), ...style }} {...rest}>
      {children}
    </span>
  );
}
