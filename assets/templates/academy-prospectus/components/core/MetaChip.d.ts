import React from "react";

export interface MetaChipProps {
  children: React.ReactNode;
  /** Remove the tinted fill and border — plain tracked mono text. @default false */
  bare?: boolean;
  style?: React.CSSProperties;
}

/**
 * The signature mono metadata token — course codes, age groups, lesson
 * durations, module labels. Inherits the section `--accent` for its fill.
 */
export function MetaChip(props: MetaChipProps): JSX.Element;
