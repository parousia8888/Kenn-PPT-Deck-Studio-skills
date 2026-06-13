import React from "react";

export interface EyebrowProps {
  /** Label text — kept short, set in mono uppercase. */
  children: React.ReactNode;
  /** accent = signal label (default) · muted = source/footnote · secondary */
  tone?: "accent" | "muted" | "secondary";
  /** Element to render. Default "div". */
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

/**
 * Mono uppercase eyebrow / source label used above claims and on data pages.
 * @startingPoint section="Foundations" subtitle="Mono eyebrow & source label" viewport="700x120"
 */
export function Eyebrow(props: EyebrowProps): JSX.Element;
