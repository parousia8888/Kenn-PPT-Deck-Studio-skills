export function NumberTab({ value, label = null, variant = "ox", size = 120, className = "", ...rest }) {
  const cls = ["ccc-numtab", variant === "sage" ? "ccc-numtab--sage" : "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ fontSize: size + "px" }} {...rest}>
      {value}
      {label ? <span className="ccc-numtab__label">{label}</span> : null}
    </div>
  );
}
