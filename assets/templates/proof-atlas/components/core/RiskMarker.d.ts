import * as React from "react";

export interface RiskMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "limitation" */
  level?: "limitation" | "risk" | "caveat";
  title?: string;
  /** Optional reference id, e.g. "L-04". */
  id?: string;
  children?: React.ReactNode;
}

/**
 * Restrained risk / limitation row — oxide marker, factual, never alarmist.
 * @dsCard group="Components"
 */
export function RiskMarker(props: RiskMarkerProps): JSX.Element;
