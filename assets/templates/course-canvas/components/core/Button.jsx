export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  icon = null,
  iconRight = null,
  children,
  className = "",
  ...rest
}) {
  const cls = [
    "ccc-btn",
    "ccc-btn--" + variant,
    size !== "md" ? "ccc-btn--" + size : "",
    className,
  ].filter(Boolean).join(" ");
  const Tag = as;
  return (
    <Tag className={cls} {...rest}>
      {icon ? <span className="ccc-btn__icon" aria-hidden="true">{icon}</span> : null}
      {children}
      {iconRight ? <span className="ccc-btn__icon" aria-hidden="true">{iconRight}</span> : null}
    </Tag>
  );
}
