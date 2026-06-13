import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small mono kicker above the title. */
  kicker?: React.ReactNode;
  /** Serif card title. */
  title?: React.ReactNode;
  /** Top accent rule color. */
  accent?: "none" | "ox" | "sage";
  children?: React.ReactNode;
}

/**
 * Raised paper concept card with optional kicker, title and top accent rule.
 * @startingPoint section="Core" subtitle="Concept card on warm paper" viewport="700x260"
 */
export function Card(props: CardProps): JSX.Element;
