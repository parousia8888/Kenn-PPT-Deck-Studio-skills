import React from "react";

/**
 * Button props.
 * @startingPoint section="Core" subtitle="Primary / accent / secondary / ghost buttons" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Render as a different element (e.g. "a"). @default "button" */
  as?: keyof JSX.IntrinsicElements;
  /** When set, renders an anchor. */
  href?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * The academy's restrained call to action: editorial, rectangular, gentle radius.
 * Pair `variant="accent"` with a `data-accent` section scope to inherit chapter colour.
 */
export function Button(props: ButtonProps): JSX.Element;
