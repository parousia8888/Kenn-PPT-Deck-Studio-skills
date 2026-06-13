import React from "react";

/* Investor Signal lockup. Inline SVG so it inherits currentColor + --accent.
   mark = square + ascending tick · full = mark + wordmark. */
export function Wordmark({ variant = "full", height = 36, color = "currentColor", style, ...rest }) {
  if (variant === "mark") {
    const s = height;
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" style={{ color, ...style }} {...rest}>
        <rect x="1.5" y="1.5" width="45" height="45" stroke="currentColor" strokeWidth="1.8" />
        <path d="M11 34 L21 25 L28 30 L37 13" stroke="var(--accent)" strokeWidth="3" fill="none" />
        <circle cx="37" cy="13" r="3.2" fill="var(--accent)" />
      </svg>
    );
  }
  const w = height * (220 / 40);
  return (
    <svg width={w} height={height} viewBox="0 0 220 40" fill="none" style={{ color, ...style }} {...rest}>
      <rect x="1" y="1" width="38" height="38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 28 L17 21 L23 25 L31 11" stroke="var(--accent)" strokeWidth="2.4" fill="none" />
      <circle cx="31" cy="11" r="2.6" fill="var(--accent)" />
      <text x="54" y="18" fontFamily="var(--font-display)" fontSize="15" fontWeight="800" letterSpacing="-0.2" fill="currentColor">INVESTOR</text>
      <text x="54" y="34" fontFamily="var(--font-mono)" fontSize="12.5" fontWeight="500" letterSpacing="3.6" fill="currentColor" opacity="0.62">SIGNAL</text>
    </svg>
  );
}
