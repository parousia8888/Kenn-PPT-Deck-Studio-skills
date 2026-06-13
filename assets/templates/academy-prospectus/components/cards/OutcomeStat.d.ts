import React from "react";

/**
 * OutcomeStat props.
 * @startingPoint section="Cards" subtitle="Outcome KPI with sourcing" viewport="300x200"
 */
export interface OutcomeStatProps {
  /** The headline figure, e.g. "94" or "+2.1". */
  value: React.ReactNode;
  /** Optional unit shown smaller, e.g. "%". */
  unit?: string;
  /** Plain-language caption beneath the number. */
  caption: string;
  /** Small sourcing / methodology line — keeps outcomes credible. */
  source?: string;
  style?: React.CSSProperties;
}

/**
 * A credible outcome KPI — large serif number, plain caption, sourcing line.
 * Built for honesty over hype; always pair figures with a source.
 */
export function OutcomeStat(props: OutcomeStatProps): JSX.Element;
