import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary = oxblood fill, secondary = ink outline, sage = green fill, ghost = quiet. */
  variant?: "primary" | "secondary" | "sage" | "ghost";
  /** Size. md is the default teaching-UI size. */
  size?: "sm" | "md" | "lg";
  /** Render as a different element, e.g. "a" for links. */
  as?: "button" | "a";
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

/** Primary action control for Course Canvas interfaces. */
export function Button(props: ButtonProps): JSX.Element;
