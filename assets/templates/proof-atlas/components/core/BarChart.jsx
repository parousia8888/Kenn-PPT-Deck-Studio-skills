import React from "react";

/**
 * Proof Atlas — BarChart
 * Custom horizontal bar chart (no chart-library styling). Hairline baseline,
 * mono labels, light-weight values. Bars carry data-anim="draw-x" so they
 * grow when revealed inside an .atlas-stage.
 */
export function BarChart({ data = [], max, unit = "", source, ...rest }) {
  const top = max != null ? max : Math.max(...data.map((d) => d.value), 1);
  return (
    <div {...rest}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((d, i) => {
          const pct = Math.max(0, Math.min(100, (d.value / top) * 100));
          const accent = d.accent !== false;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--gray-1)",
                  textAlign: "right",
                  lineHeight: 1.2,
                }}
              >
                {d.label}
              </div>
              <div style={{ position: "relative", height: "18px", background: "var(--paper-1)", borderBottom: "1px solid var(--rule)" }}>
                <div
                  data-anim="draw-x"
                  data-seq={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: pct + "%",
                    background: accent ? "var(--blue)" : "var(--gray-3)",
                    transformOrigin: "left center",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "20px",
                  color: "var(--ink)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "52px",
                  textAlign: "right",
                }}
              >
                {d.value}
                {unit && <span style={{ fontSize: "0.55em", color: "var(--gray-1)", marginLeft: "1px" }}>{unit}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {source && (
        <div
          data-anim="source"
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gray-3)",
          }}
        >
          <span style={{ width: "5px", height: "5px", background: "var(--blue)" }} />
          {source}
        </div>
      )}
    </div>
  );
}
