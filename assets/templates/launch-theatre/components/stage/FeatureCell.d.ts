import * as React from "react";

export interface FeatureCellProps {
  index?: number;
  name: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  /** sequence index for staggered reveal within a trio */
  i?: number;
  style?: React.CSSProperties;
}

/** One feature in a trio: a drawing hairline, mono index, name and one line of copy. */
export function FeatureCell(props: FeatureCellProps): JSX.Element;
