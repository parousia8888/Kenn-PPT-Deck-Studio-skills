import * as React from "react";

export interface ButtonProps {
  children?: React.ReactNode;
  /** solid = the single primary accent fill; primary = accent outline + glow (default); secondary = neutral outline; ghost = text only */
  variant?: "solid" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  /** render as <a> when provided */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * Cinematic CTA button. Outline + optical glow by default; reserve `solid` for
 * the one primary action on a slide.
 * @startingPoint section="Core" subtitle="CTA — outline, glow, solid, ghost" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
