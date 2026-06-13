import * as React from "react";

export interface ProgressRailProps {
  /** total acts in the deck */
  total?: number;
  /** current act (1-based); fills up to and including this segment */
  current?: number;
  style?: React.CSSProperties;
}

/** Cinematic act progress — a thin segmented rail; the current act glows. */
export function ProgressRail(props: ProgressRailProps): JSX.Element;
