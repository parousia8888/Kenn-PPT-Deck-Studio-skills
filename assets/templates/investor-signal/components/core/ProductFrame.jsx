import React from "react";

/* Premium product frame for screenshot / demo moments.
   Large controlled frame, one deep controlled shadow, optional
   terminal-style top bar. No browser chrome unless `chrome="window"`.
   Use [data-anim="screen"] on this for the masked reveal. */
export function ProductFrame({
  children,
  chrome = "bar",
  label,
  ratio = "16 / 10",
  anim = true,
  style,
  ...rest
}) {
  return (
    <div
      {...(anim ? { "data-anim": "screen" } : {})}
      style={{
        background: "var(--obsidian-850)",
        border: "1px solid var(--obsidian-600)",
        borderRadius: "var(--radius-3)",
        boxShadow: "var(--shadow-frame)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {chrome !== "none" && (
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--sp-3)",
          padding: "12px 16px",
          borderBottom: "1px solid var(--obsidian-600)",
          background: "var(--obsidian-800)",
        }}>
          {chrome === "window" ? (
            <div style={{ display: "flex", gap: 7 }}>
              {["#3A3F47", "#3A3F47", "#3A3F47"].map((c, i) => (
                <span key={i} style={{ width: 11, height: 11, borderRadius: 999, background: c }} />
              ))}
            </div>
          ) : (
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--accent)" }} />
          )}
          {label && (
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--fs-micro)",
              letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>{label}</span>
          )}
        </div>
      )}
      <div style={{ aspectRatio: ratio, position: "relative", background: "var(--obsidian-900)" }}>
        {children}
      </div>
    </div>
  );
}
