import * as React from "react";

export interface KickerProps {
  children?: React.ReactNode;
  /** slide / act number, zero-padded automatically */
  index?: number;
  /** total acts, renders as "03 / 10" */
  total?: number;
  style?: React.CSSProperties;
}

/** Act / slide-kind marker: glowing accent tick + tracked mono label, optional index. */
export function Kicker(props: KickerProps): JSX.Element;
