export function RuleHeading({ eyebrow = null, title, variant = "ox", as = "h2", className = "", ...rest }) {
  const cls = ["ccc-rulehead", variant === "sage" ? "ccc-rulehead--sage" : "", className].filter(Boolean).join(" ");
  const Tag = as;
  return (
    <div className={cls} {...rest}>
      {eyebrow ? <span className="ccc-rulehead__eyebrow">{eyebrow}</span> : null}
      <hr className="ccc-rulehead__mark" />
      <Tag className="ccc-rulehead__title">{title}</Tag>
    </div>
  );
}
