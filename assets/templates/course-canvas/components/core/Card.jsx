export function Card({ kicker = null, title = null, accent = "none", children, className = "", ...rest }) {
  const cls = [
    "ccc-card",
    accent === "ox" ? "ccc-card--top" : "",
    accent === "sage" ? "ccc-card--top-sage" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {kicker ? <div className="ccc-card__kicker">{kicker}</div> : null}
      {title ? <h3 className="ccc-card__title">{title}</h3> : null}
      {children}
    </div>
  );
}
