import * as React from "react";

export interface ScreenFrameProps {
  /** image source for a product screenshot */
  src?: string;
  alt?: string;
  /** mono caption bar text */
  label?: string;
  /** CSS aspect-ratio, e.g. "16 / 10" */
  ratio?: string;
  /** product lift shadow (default true) */
  glow?: boolean;
  /** light-sweep layer that crosses on reveal (default true) */
  sweep?: boolean;
  /** live UI mock instead of an image */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * The stage object for product screenshots / device UI: dark frame, optional
 * caption bar, optical lift and a light sweep on reveal.
 * @startingPoint section="Stage" subtitle="Product screenshot / UI stage object" viewport="700x440"
 */
export function ScreenFrame(props: ScreenFrameProps): JSX.Element;
