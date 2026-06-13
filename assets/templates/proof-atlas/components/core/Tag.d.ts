import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "default" */
  variant?: "default" | "accent" | "solid" | "risk";
  /** Optional leading number, zero-padded to 2 digits. */
  index?: number | string;
  children?: React.ReactNode;
}

/**
 * Mono uppercase structural label (section tag, status, finding number).
 * @dsCard group="Components"
 */
export function Tag(props: TagProps): JSX.Element;
