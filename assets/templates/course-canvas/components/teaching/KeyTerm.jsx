export function KeyTerm({ variant = "highlight", children, className = "", ...rest }) {
  const map = { highlight: "ccc-key", underline: "ccc-key ccc-key--underline", ox: "ccc-key ccc-key--ox" };
  const cls = [map[variant] || "ccc-key", className].filter(Boolean).join(" ");
  return <mark className={cls} {...rest}>{children}</mark>;
}
