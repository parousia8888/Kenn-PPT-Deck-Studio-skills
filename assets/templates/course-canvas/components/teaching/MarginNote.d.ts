import * as React from "react";

export interface MarginNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small mono label, e.g. "Etymology", "Before we start". */
  label?: React.ReactNode;
  /** Accent of the left rule. */
  variant?: "default" | "ox" | "sage";
  children?: React.ReactNode;
}

/**
 * Annotation set in the gutter — etymology, prerequisites, asides.
 * @startingPoint section="Teaching" subtitle="Gutter annotation note" viewport="380x220"
 */
export function MarginNote(props: MarginNoteProps): JSX.Element;
