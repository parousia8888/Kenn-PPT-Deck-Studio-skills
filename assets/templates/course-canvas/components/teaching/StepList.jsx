export function StepList({ steps = [], variant = "ox", className = "", ...rest }) {
  const cls = ["ccc-steps", variant === "sage" ? "ccc-steps--sage" : "", className].filter(Boolean).join(" ");
  return (
    <ol className={cls} {...rest}>
      {steps.map((s, i) => (
        <li key={i}>
          <div>
            {s.title ? <span className="ccc-steps__title">{s.title}</span> : null}
            {s.body ? <span className="ccc-steps__body">{s.body}</span> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
