import React from "react";

/**
 * Proof Atlas — RiskMarker
 * Restrained limitation / risk row. Oxide marker, never alarmist.
 */
export function RiskMarker({ level = "limitation", title, children, id, style, ...rest }) {
  const labels = { limitation: "Limitation", risk: "Risk", caveat: "Caveat" };
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px 14px",
        background: "var(--paper-pure)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        borderLeft: "2px solid var(--oxide)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: "8px", height: "8px", marginTop: "4px", background: "var(--oxide)", flex: "none", transform: "rotate(45deg)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--oxide)" }}>
            {labels[level] || level}
          </span>
          {id && <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--gray-3)", letterSpacing: "0.08em" }}>{id}</span>}
        </div>
        {title && <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--ink)", marginBottom: children ? "3px" : 0 }}>{title}</div>}
        {children && <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--gray-1)", lineHeight: 1.45 }}>{children}</div>}
      </div>
    </div>
  );
}
