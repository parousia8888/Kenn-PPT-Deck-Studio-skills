import * as React from "react";

export interface RuleHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono eyebrow above the title. */
  eyebrow?: React.ReactNode;
  /** Serif heading text. */
  title: React.ReactNode;
  /** Accent color of eyebrow + mark. */
  variant?: "ox" | "sage";
  /** Heading element to render the title as. */
  as?: "h1" | "h2" | "h3";
}

/**
 * Section heading with a mono eyebrow, a short accent mark, and a serif title.
 * @startingPoint section="Teaching" subtitle="Eyebrow + mark + serif heading" viewport="700x180"
 */
export function RuleHeading(props: RuleHeadingProps): JSX.Element;
