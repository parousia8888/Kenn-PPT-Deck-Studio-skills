import React from "react";

/* Launch Theatre — ScreenFrame
 * The stage object for product screenshots / device UI. Dark frame, optional
 * mono caption bar, optical lift + a light-sweep layer that crosses on reveal.
 * Pass `src` for an image, or `children` for a live UI mock. */
export function ScreenFrame({ src, alt, label, ratio = "16 / 10", glow = true, sweep = true, children, style, ...rest }) {
  return (
    <figure
      style={{
        margin: 0,
        position: "relative",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--hairline-strong)",
        background: "var(--graphite-1)",
        boxShadow: glow ? "var(--lift-product)" : "var(--lift-panel)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <figcaption
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderBottom: "1px solid var(--hairline)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            background: "var(--graphite-2)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "var(--glow-spark)" }} />
          {label}
        </figcaption>
      ) : null}
      <div style={{ position: "relative", aspectRatio: ratio, background: "var(--stage-2)" }}>
        {src ? (
          <img src={src} alt={alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          children
        )}
        {sweep ? <span className="lt-sweep" /> : null}
      </div>
    </figure>
  );
}
