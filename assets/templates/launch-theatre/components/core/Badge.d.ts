import * as React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "accent" | "solid" | "muted";
  /** glowing live dot before the label */
  dot?: boolean;
  style?: React.CSSProperties;
}

/** Small tracked-mono status chip: version tags, LIVE, NEW, PREVIEW. */
export function Badge(props: BadgeProps): JSX.Element;
