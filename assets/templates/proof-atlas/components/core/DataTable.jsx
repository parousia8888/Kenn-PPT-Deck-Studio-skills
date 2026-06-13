import React from "react";

/**
 * Proof Atlas — DataTable
 * Ruled, mono-headed table. Columns may be aligned; an optional source row
 * sits below. Zebra is paper-tone, not color.
 */
export function DataTable({ columns = [], rows = [], source, zebra = true, ...rest }) {
  return (
    <div style={{ border: "1px solid var(--rule)", background: "var(--paper-pure)" }} {...rest}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: c.align || "left",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9.5px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--gray-2)",
                  fontWeight: 500,
                  padding: "8px 12px",
                  borderBottom: "2px solid var(--ink)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: zebra && ri % 2 ? "var(--paper-1)" : "transparent" }}>
              {columns.map((c, ci) => {
                const val = Array.isArray(r) ? r[ci] : r[c.key];
                const emphasize = c.emphasize;
                return (
                  <td
                    key={ci}
                    style={{
                      textAlign: c.align || "left",
                      padding: "9px 12px",
                      borderBottom: "1px solid var(--rule-faint)",
                      fontSize: emphasize ? "15px" : "13px",
                      fontFamily: emphasize ? "var(--font-display)" : c.mono ? "var(--font-mono)" : "var(--font-body)",
                      fontWeight: emphasize ? 300 : 400,
                      color: ci === 0 ? "var(--ink)" : "var(--gray-1)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {source && (
        <div
          style={{
            padding: "7px 12px",
            borderTop: "1px solid var(--rule)",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gray-3)",
          }}
        >
          {source}
        </div>
      )}
    </div>
  );
}
