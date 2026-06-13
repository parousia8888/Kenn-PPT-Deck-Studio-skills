import React from "react";

/* Launch Theatre — ProgressRail
 * Cinematic act progress. A thin segmented rail; played acts fill with accent,
 * the current act glows. Sits at the foot of the stage. */
export function ProgressRail({ total = 10, current = 1, style, ...rest }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", ...style }} {...rest}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i < current;
        const isCur = i === current - 1;
        return (
          <span
            key={i}
            style={{
              flex: 1,
              height: 2,
              background: active ? "var(--accent)" : "var(--hairline)",
              boxShadow: isCur ? "var(--glow-soft)" : "none",
              opacity: active && !isCur ? 0.55 : 1,
              transition: "background var(--dur-med) var(--ease-stage), opacity var(--dur-med) var(--ease-stage), box-shadow var(--dur-med) var(--ease-stage)",
            }}
          />
        );
      })}
    </div>
  );
}
