import * as React from "react";

/**
 * Props for the Button primitive.
 * @startingPoint section="Core" subtitle="Buttons — primary / secondary / ghost" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost";
  /** @default "md" */
  size?: "sm" | "md";
  disabled?: boolean;
  /** Render as a different element (e.g. "a"). @default "button" */
  as?: "button" | "a";
  children?: React.ReactNode;
}

/**
 * Mono, uppercase institutional button — no shadow, near-zero radius.
 * @dsCard group="Components"
 */
export function Button(props: ButtonProps): JSX.Element;
