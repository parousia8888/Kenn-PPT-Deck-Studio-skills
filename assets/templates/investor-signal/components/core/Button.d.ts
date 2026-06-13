import React from "react";

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** primary = accent fill · ghost = hairline outline · link = underlined */
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Decisive keynote CTA — sharp, architectural, no gloss. Press nudges 1px.
 * @startingPoint section="Foundations" subtitle="Keynote CTA button" viewport="700x140"
 */
export function Button(props: ButtonProps): JSX.Element;
