import React from "react";

/**
 * Proof Atlas — Coordinate
 * Mono coordinate / locator label, e.g. [ 42.361°N · 071.057°W ].
 */
export function Coordinate({ lat, lng, raw, brackets = true, color = "var(--blue)", ...rest }) {
  const text = raw != null ? raw : `${lat} · ${lng}`;
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10.5px",
        letterSpacing: "0.06em",
        color,
        whiteSpace: "nowrap",
      }}
      {...rest}
    >
      {brackets ? `[ ${text} ]` : text}
    </span>
  );
}
