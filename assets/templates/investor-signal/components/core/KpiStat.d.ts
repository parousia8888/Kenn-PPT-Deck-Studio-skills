import React from "react";

export interface KpiStatProps {
  /** Static display value, e.g. "$4.2B". Ignored if `count` is set. */
  value?: React.ReactNode;
  /** Numeric target for count-up (driven by InvestorSignal.activate). */
  count?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Mono uppercase caption under the figure. */
  caption?: string;
  /** Accent delta chip, e.g. "218% YoY". */
  delta?: string;
  deltaDir?: "up" | "down";
  /** sm = inline KPI · lg = section figure · mega = single dominant stat */
  size?: "sm" | "lg" | "mega";
  align?: "left" | "center";
  style?: React.CSSProperties;
}

/**
 * Dominant traction metric — visually loud, never exaggerated. Pairs a huge
 * tabular figure with a mono caption and optional accent delta. Animates with
 * count-up when the slide activates.
 * @startingPoint section="Data" subtitle="Count-up KPI metric block" viewport="700x300"
 */
export function KpiStat(props: KpiStatProps): JSX.Element;
