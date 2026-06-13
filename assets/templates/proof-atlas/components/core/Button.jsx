import React from "react";

/**
 * Proof Atlas — Button
 * Restrained institutional button. No shadow, near-zero radius.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  as = "button",
  ...rest
}) {
  const pad = size === "sm" ? "6px 12px" : "9px 18px";
  const fz = size === "sm" ? "11px" : "12px";

  const base = {
    fontFamily: "var(--font-mono)",
    fontSize: fz,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    lineHeight: 1,
    padding: pad,
    borderRadius: "var(--r-1)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--d-fast) var(--e-out), color var(--d-fast) var(--e-out), border-color var(--d-fast) var(--e-out)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    opacity: disabled ? 0.4 : 1,
    userSelect: "none",
  };

  const variants = {
    primary: { background: "var(--blue)", color: "var(--paper-pure)", border: "1px solid var(--blue)" },
    secondary: { background: "transparent", color: "var(--ink)", border: "1px solid var(--ink)" },
    ghost: { background: "transparent", color: "var(--gray-1)", border: "1px solid var(--rule)" },
  };

  const Tag = as;
  const [hover, setHover] = React.useState(false);
  const hoverStyle =
    !disabled && hover
      ? variant === "primary"
        ? { background: "var(--blue-deep)", borderColor: "var(--blue-deep)" }
        : variant === "secondary"
        ? { background: "var(--ink)", color: "var(--paper-pure)" }
        : { borderColor: "var(--ink)", color: "var(--ink)" }
      : null;

  return (
    <Tag
      style={{ ...base, ...variants[variant], ...hoverStyle }}
      disabled={as === "button" ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
