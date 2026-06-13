export function Callout({ variant = "ox", label = null, children, className = "", ...rest }) {
  const map = { ox: "", sage: "ccc-callout--sage", note: "ccc-callout--note", straw: "ccc-callout--straw" };
  const cls = ["ccc-callout", map[variant] || "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {label ? <div className="ccc-callout__label">{label}</div> : null}
      <div className="ccc-callout__body">{children}</div>
    </div>
  );
}
