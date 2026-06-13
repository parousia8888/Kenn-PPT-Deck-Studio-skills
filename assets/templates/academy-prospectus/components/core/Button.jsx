import React from "react";

/**
 * Button — the academy's restrained call to action.
 * Editorial, rectangular, gentle radius; warm hover, soft press. Never bubbly.
 */
export function Button({
  children,
  variant = "primary",   // "primary" | "accent" | "secondary" | "ghost"
  size = "md",            // "sm" | "md" | "lg"
  as = "button",
  href,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const pads = {
    sm: "8px 16px",
    md: "12px 24px",
    lg: "15px 32px",
  };
  const sizes = { sm: 13, md: 15, lg: 17 };

  const base = {
    fontFamily: "var(--font-body)",
    fontSize: sizes[size],
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1,
    padding: pads[size],
    borderRadius: "var(--r-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid transparent",
    transition:
      "background var(--dur-fast) var(--ease-page), border-color var(--dur-fast) var(--ease-page), color var(--dur-fast) var(--ease-page), transform var(--dur-fast) var(--ease-page)",
    transform: press && !disabled ? "scale(0.975)" : "none",
    textDecoration: "none",
  };

  const variants = {
    primary: {
      background: hover ? "var(--charcoal)" : "var(--ink)",
      color: "var(--ink-on-dark)",
      borderColor: "var(--ink)",
    },
    accent: {
      background: hover ? "var(--accent-deep)" : "var(--accent)",
      color: "var(--paper)",
      borderColor: "transparent",
    },
    secondary: {
      background: hover ? "var(--porcelain)" : "transparent",
      color: "var(--ink)",
      borderColor: hover ? "var(--ink-faint)" : "var(--line-strong)",
    },
    ghost: {
      background: "transparent",
      color: hover ? "var(--accent-deep)" : "var(--accent)",
      borderColor: "transparent",
      padding: 0,
      borderBottom: `1.5px solid ${hover ? "var(--accent)" : "transparent"}`,
      borderRadius: 0,
    },
  };

  const Tag = href ? "a" : as;
  return (
    <Tag
      href={href}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
