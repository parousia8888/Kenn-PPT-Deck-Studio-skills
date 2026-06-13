import React from "react";

/* Launch Theatre — Kicker
 * The act / slide-kind marker: a glowing accent tick + tracked mono label,
 * with an optional "01 / 10" index. Sits above titles on every slide. */
export function Kicker({ children, index, total, style, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 22, height: 1, background: "var(--accent)", boxShadow: "var(--glow-spark)", flex: "0 0 auto" }} />
      <span>{children}</span>
      {index != null ? (
        <span style={{ color: "var(--text-faint)" }}>
          {String(index).padStart(2, "0")}
          {total ? ` / ${String(total).padStart(2, "0")}` : ""}
        </span>
      ) : null}
    </span>
  );
}
