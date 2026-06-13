import * as React from "react";

export interface CoordinateProps extends React.HTMLAttributes<HTMLSpanElement> {
  lat?: string;
  lng?: string;
  /** Arbitrary locator string instead of lat/lng. */
  raw?: string;
  /** Wrap in [ … ]. @default true */
  brackets?: boolean;
  /** @default "var(--blue)" */
  color?: string;
}

/**
 * Mono coordinate / locator label — the "located evidence" motif.
 * @dsCard group="Components"
 */
export function Coordinate(props: CoordinateProps): JSX.Element;
