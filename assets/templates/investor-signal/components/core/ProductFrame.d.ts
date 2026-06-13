import React from "react";

export interface ProductFrameProps {
  children?: React.ReactNode;
  /** bar = thin signal bar (default) · window = traffic lights · none */
  chrome?: "bar" | "window" | "none";
  /** Mono label in the chrome bar, e.g. "dashboard · live". */
  label?: string;
  /** CSS aspect-ratio for the viewport. Default "16 / 10". */
  ratio?: string;
  /** Attach the masked screen-reveal animation. Default true. */
  anim?: boolean;
  style?: React.CSSProperties;
}

/**
 * Premium product frame for screenshot / demo moments — large, controlled, one
 * deep shadow, no cheap browser mockup. Reveals with a subtle bottom mask.
 * @startingPoint section="Product" subtitle="Premium product screenshot frame" viewport="900x560"
 */
export function ProductFrame(props: ProductFrameProps): JSX.Element;
