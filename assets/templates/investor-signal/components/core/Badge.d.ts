import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  /** outline (default) · accent (filled signal) · solid (neutral panel) */
  variant?: "outline" | "accent" | "solid";
  /** Leading status dot. */
  dot?: boolean;
  style?: React.CSSProperties;
}

/**
 * Small mono status / stage chip — "Series A", "Live", "Pilot". Sharp, quiet,
 * accent only when it marks signal.
 * @startingPoint section="Foundations" subtitle="Status & stage chip" viewport="700x120"
 */
export function Badge(props: BadgeProps): JSX.Element;
