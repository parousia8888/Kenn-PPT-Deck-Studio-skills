import React from "react";

/* Dominant metric block: huge tabular figure + caption, optional delta.
   Supports count-up via the motion engine when `count` is set:
   the value renders with [data-count] and InvestorSignal.activate()
   animates it. Without the engine it falls back to the static value. */
export function KpiStat({
  value,
  count,
  prefix = "",
  suffix = "",
  decimals = 0,
  caption,
  delta,
  deltaDir = "up",
  size = "lg",
  align = "left",
  style,
}) {
  const sizes = {
    sm: "var(--fs-d3)",
    lg: "var(--fs-d1)",
    mega: "var(--fs-mega)",
  };
  const countAttrs = count != null ? {
    "data-count": count,
    "data-count-dec": decimals,
    "data-count-pre": prefix,
    "data-count-suf": suffix,
  } : {};
  const display = count != null
    ? `${prefix}0${suffix}`
    : (value != null ? value : `${prefix}0${suffix}`);

  return (
    <div style={{ textAlign: align, ...style }}>
      <div
        {...countAttrs}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--fw-black)",
          fontSize: sizes[size] || sizes.lg,
          lineHeight: 1,
          letterSpacing: "var(--tracking-mega)",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary)",
        }}
      >
        {display}
      </div>
      {(caption || delta) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sp-3)",
            marginTop: "var(--sp-3)",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          {delta && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-small)",
                fontWeight: "var(--fw-medium)",
                color: "var(--accent)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {deltaDir === "up" ? "▲" : "▼"} {delta}
            </span>
          )}
          {caption && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-mono)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
