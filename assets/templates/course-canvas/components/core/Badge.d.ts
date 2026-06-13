import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color treatment. */
  variant?: "ink" | "ox" | "sage" | "straw" | "ghost" | "ok" | "error";
  /** Optional difficulty meter, 0–3 filled dots. */
  level?: number | null;
  children?: React.ReactNode;
}

/**
 * Compact mono label — lesson tags, status, difficulty.
 * @startingPoint section="Core" subtitle="Badges & tags: status, lesson, difficulty" viewport="700x150"
 */
export function Badge(props: BadgeProps): JSX.Element;
