import React from "react";

/**
 * Proof Atlas — SourceNote
 * Provenance line that accompanies every data point.
 * Renders:  ▪ SOURCE · <method> · <id>
 */
export function SourceNote({ method, id, label = "Source", align = "left", style, ...rest }) {
  const parts = [label, method, id].filter(Boolean).join(" · ");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--gray-3)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: "5px", height: "5px", background: "var(--blue)", flex: "none" }} />
      <span>{parts}</span>
    </div>
  );
}
