import React from "react";
import { Coordinate } from "./Coordinate.jsx";
import { SourceNote } from "./SourceNote.jsx";

/**
 * Proof Atlas — EvidenceCell
 * The system's modular card: hairline border, mono header (id + coordinate),
 * body, and a mono source-note footer. Squared, no shadow.
 */
export function EvidenceCell({
  cellId,
  coord,
  method,
  id,
  children,
  muted = false,
  style,
  ...rest
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: muted ? "var(--paper-1)" : "var(--paper-pure)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--r-0)",
        ...style,
      }}
      {...rest}
    >
      {(cellId || coord) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            padding: "7px 10px",
            borderBottom: "1px solid var(--rule)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ fontSize: "9.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray-2)" }}>
            {cellId}
          </span>
          {coord && <Coordinate raw={coord} brackets={false} />}
        </div>
      )}
      <div style={{ padding: "12px", flex: 1 }}>{children}</div>
      {(method || id) && (
        <div style={{ padding: "7px 10px", borderTop: "1px solid var(--rule-faint)" }}>
          <SourceNote method={method} id={id} />
        </div>
      )}
    </div>
  );
}
