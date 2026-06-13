export function Badge({ variant = "ink", level = null, children, className = "", ...rest }) {
  const cls = ["ccc-badge", "ccc-badge--" + variant, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {children}
      {typeof level === "number" ? (
        <span className="ccc-dots" aria-label={level + " of 3"}>
          {[0, 1, 2].map((i) => (
            <i key={i} className={i < level ? "on" : ""} />
          ))}
        </span>
      ) : null}
    </span>
  );
}
