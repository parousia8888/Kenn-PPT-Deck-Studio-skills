import React from "react";

/* Launch Theatre — MonoMeta
 * The keynote metadata row: label/value pairs in tracked mono — model name,
 * version, date, presenter. The brand's signature readout. */
export function MonoMeta({ items = [], gap = 48, style, ...rest }) {
  return (
    <dl style={{ display: "flex", flexWrap: "wrap", gap, margin: 0, ...style }} {...rest}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <dt
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
            }}
          >
            {it.label}
          </dt>
          <dd
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              letterSpacing: "0.04em",
              color: it.accent ? "var(--accent)" : "var(--text-primary)",
            }}
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
