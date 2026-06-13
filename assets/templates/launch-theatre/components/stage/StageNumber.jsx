import React from "react";

/* Launch Theatre — StageNumber
 * A large reveal figure for benchmarks / KPIs: thin display numeral, mono unit,
 * tracked label, optional delta. Theatrical, never spreadsheet-like.
 * Add data-anim="num" + data-count-to on the value to count up on reveal. */
export function StageNumber({ value, unit, label, delta, accent = true, animate = false, countTo, style, ...rest }) {
  const numAttrs = animate
    ? { "data-anim": "num", "data-count-to": countTo != null ? countTo : value, "data-count-suffix": "" }
    : {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          {...numAttrs}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: "clamp(3rem, 6vw, 6rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: accent ? "var(--accent)" : "var(--text-primary)",
          }}
        >
          {value}
        </span>
        {unit ? (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--text-muted)", letterSpacing: "0.04em" }}>{unit}</span>
        ) : null}
      </div>
      {label ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</span>
      ) : null}
      {delta ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.04em" }}>{delta}</span>
      ) : null}
    </div>
  );
}
