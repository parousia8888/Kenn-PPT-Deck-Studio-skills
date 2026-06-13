import * as React from "react";

export interface StageNumberProps {
  value: React.ReactNode;
  unit?: string;
  label?: string;
  /** secondary line, e.g. "+2.4× vs prior" */
  delta?: React.ReactNode;
  /** accent-color the numeral (default true) */
  accent?: boolean;
  /** wire the count-up reveal (data-anim="num") */
  animate?: boolean;
  /** target number for the count-up when animate is set */
  countTo?: number;
  style?: React.CSSProperties;
}

/**
 * Large reveal figure for benchmarks / KPIs — thin display numeral, mono unit,
 * tracked label. Theatrical, never spreadsheet-like.
 */
export function StageNumber(props: StageNumberProps): JSX.Element;
