import * as React from "react";

export interface KeyTermProps extends React.HTMLAttributes<HTMLElement> {
  /** Emphasis treatment for an inline key term. */
  variant?: "highlight" | "underline" | "ox";
  children?: React.ReactNode;
}

/**
 * Inline emphasis for a key term — straw highlighter swipe, straw underline, or oxblood ink.
 * @startingPoint section="Teaching" subtitle="Inline key-term emphasis" viewport="700x130"
 */
export function KeyTerm(props: KeyTermProps): JSX.Element;
