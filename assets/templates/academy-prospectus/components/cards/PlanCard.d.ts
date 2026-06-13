import React from "react";

/**
 * PlanCard props.
 * @startingPoint section="Cards" subtitle="Enrollment / pricing plan column" viewport="320x300"
 */
export interface PlanCardProps {
  /** Mono tier label, e.g. "Scholar · Most chosen". */
  tier: string;
  /** Serif price, e.g. "¥ 11,400". */
  price: React.ReactNode;
  /** Cadence shown after the price. @default "/ term" */
  per?: string;
  /** Inclusions, one per bullet. */
  items?: string[];
  /** Highlight as the recommended tier. @default false */
  feature?: boolean;
  style?: React.CSSProperties;
}

/**
 * An enrollment / pricing column — tier label, serif price, accent-bulleted
 * inclusions. Use `feature` for the recommended tier (inherits `--accent`).
 */
export function PlanCard(props: PlanCardProps): JSX.Element;
