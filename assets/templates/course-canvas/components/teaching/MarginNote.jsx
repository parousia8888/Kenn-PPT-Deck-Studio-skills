export function MarginNote({ label = null, variant = "default", children, className = "", ...rest }) {
  const map = { default: "", ox: "ccc-marginnote--ox", sage: "ccc-marginnote--sage" };
  const cls = ["ccc-marginnote", map[variant] || "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {label ? <span className="ccc-marginnote__label">{label}</span> : null}
      {children}
    </div>
  );
}
