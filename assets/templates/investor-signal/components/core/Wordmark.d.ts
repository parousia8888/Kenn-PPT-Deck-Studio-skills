import React from "react";

export interface WordmarkProps {
  /** full = mark + wordmark (default) · mark = square signal glyph only */
  variant?: "full" | "mark";
  /** Pixel height; width scales proportionally. */
  height?: number;
  /** Ink color of the frame + wordmark. Tick is always --accent. */
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Investor Signal lockup — sharp framed mark with an ascending accent tick.
 * Inherits currentColor so it works on stage (light ink) or evidence (dark ink).
 * @startingPoint section="Brand" subtitle="Logo lockup" viewport="700x120"
 */
export function Wordmark(props: WordmarkProps): JSX.Element;
