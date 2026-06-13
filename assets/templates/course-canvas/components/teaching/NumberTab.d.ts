import * as React from "react";

export interface NumberTabProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The big number or short code, e.g. "04", "M2", "D1". */
  value: React.ReactNode;
  /** Optional mono caption below the number. */
  label?: React.ReactNode;
  /** Accent color. */
  variant?: "ox" | "sage";
  /** Font size in px for the numeral. Default 120. */
  size?: number;
}

/**
 * Large serif section-number anchor used to orient a slide or panel.
 * @startingPoint section="Teaching" subtitle="Large section-number anchor" viewport="700x200"
 */
export function NumberTab(props: NumberTabProps): JSX.Element;
