import React from "react";

/* Launch Theatre — Button
 * Cinematic CTA. Outline + optical glow by default; one `solid` accent fill
 * reserved for the single primary action on a slide. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconRight = null,
  disabled = false,
  href,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { fs: 13, pad: "8px 16px", min: 34 },
    md: { fs: 15, pad: "12px 22px", min: 44 },
    lg: { fs: 17, pad: "15px 30px", min: 54 },
  };
  const sz = sizes[size] || sizes.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    fontSize: sz.fs,
    lineHeight: 1,
    letterSpacing: "0.01em",
    padding: sz.pad,
    minHeight: sz.min,
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    transition: "background var(--dur-fast) var(--ease-out-soft), color var(--dur-fast) var(--ease-out-soft), border-color var(--dur-fast) var(--ease-out-soft), box-shadow var(--dur-fast) var(--ease-out-soft), transform var(--dur-fast) var(--ease-out-soft)",
    transform: press && !disabled ? "translateY(1px)" : "none",
    opacity: disabled ? 0.4 : 1,
  };

  const variants = {
    solid: {
      background: hover ? "var(--accent-bright)" : "var(--accent)",
      color: "#04181a",
      borderColor: "transparent",
      boxShadow: hover ? "var(--glow-soft)" : "none",
    },
    primary: {
      background: hover ? "rgba(var(--accent-rgb), 0.10)" : "transparent",
      color: "var(--accent)",
      borderColor: "var(--accent)",
      boxShadow: hover ? "var(--glow-soft)" : "none",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      borderColor: hover ? "var(--hairline-strong)" : "var(--hairline)",
    },
    ghost: {
      background: hover ? "rgba(255,255,255,0.04)" : "transparent",
      color: hover ? "var(--text-primary)" : "var(--text-secondary)",
      borderColor: "transparent",
    },
  };

  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      disabled={Tag === "button" ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
      {iconRight ? <span style={{ display: "inline-flex" }}>{iconRight}</span> : null}
    </Tag>
  );
}
