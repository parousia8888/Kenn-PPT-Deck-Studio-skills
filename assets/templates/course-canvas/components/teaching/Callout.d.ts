import * as React from "react";

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tone of the bracketed note. */
  variant?: "ox" | "sage" | "note" | "straw";
  /** Small mono label, e.g. "In plain words". */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Left-bracketed teaching note — tips, plain-language asides, warnings.
 * @startingPoint section="Teaching" subtitle="Bracketed callouts: note, tip, warning" viewport="700x220"
 */
export function Callout(props: CalloutProps): JSX.Element;
