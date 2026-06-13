import * as React from "react";

export interface Step {
  title?: React.ReactNode;
  body?: React.ReactNode;
}

export interface StepListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Ordered steps; each rendered with a mono leading-zero number. */
  steps: Step[];
  /** Accent color of the step numbers. */
  variant?: "ox" | "sage";
}

/**
 * Numbered step-by-step procedure with mono leading-zero markers.
 * @startingPoint section="Teaching" subtitle="Numbered worked procedure" viewport="700x320"
 */
export function StepList(props: StepListProps): JSX.Element;
