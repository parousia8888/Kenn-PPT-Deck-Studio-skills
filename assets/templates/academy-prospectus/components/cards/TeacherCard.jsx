import React from "react";

/**
 * TeacherCard — an editorial faculty profile. Documentary portrait, name in
 * display serif, discipline in mono, a short scholarly bio under a hairline.
 * Deliberately not a generic centred avatar card.
 */
export function TeacherCard({ name, discipline, bio, image, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <div
        style={{
          aspectRatio: "3 / 4",
          borderRadius: "var(--r-image)",
          overflow: "hidden",
          background: "var(--parchment)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.02)" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "grid", placeItems: "center",
            background: "radial-gradient(120% 90% at 30% 20%, var(--accent-field), var(--parchment))",
            color: "var(--ink-faint)", fontFamily: "var(--font-meta)", fontSize: 10, letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>Portrait</div>
        )}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20, color: "var(--ink)", margin: "16px 0 2px" }}>
        {name}
      </div>
      <div style={{ fontFamily: "var(--font-meta)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
        {discipline}
      </div>
      {bio && (
        <p style={{
          fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-muted)",
          margin: "10px 0 0", paddingTop: 10, borderTop: "1px solid var(--line)",
        }}>{bio}</p>
      )}
    </div>
  );
}
