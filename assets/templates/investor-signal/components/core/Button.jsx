import React from "react";

/* Decisive keynote CTA. Minimal, architectural — sharp radius, no gloss.
   primary = accent fill · ghost = hairline outline · link = underlined text. */
export function Button({ children, variant = "primary", size = "md", as = "button", style, ...rest }) {
  const Tag = as;
  const sizes = {
    sm: { fontSize: "var(--fs-small)", padding: "9px 16px" },
    md: { fontSize: "var(--fs-body)", padding: "13px 22px" },
    lg: { fontSize: "var(--fs-lead)", padding: "17px 30px" },
  };
  const variants = {
    primary: { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" },
    ghost: { background: "transparent", color: "var(--text-primary)", border: "1px solid var(--hairline)" },
    link: { background: "transparent", color: "var(--accent)", border: "none", padding: 0, textDecoration: "underline", textUnderlineOffset: "4px" },
  };
  return (
    <Tag
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--sp-2)",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--fw-bold)",
        letterSpacing: "var(--tracking-tight)",
        borderRadius: "var(--radius-1)",
        cursor: "pointer",
        lineHeight: 1,
        transition: "transform var(--dur-instant) var(--ease-out), opacity var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (variant !== "link") e.currentTarget.style.transform = "translateY(1px)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
