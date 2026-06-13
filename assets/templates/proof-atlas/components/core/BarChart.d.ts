import * as React from "react";

export interface BarDatum {
  label: string;
  value: number;
  /** Render in accent blue (true) or neutral gray (false). @default true */
  accent?: boolean;
}

/**
 * Props for the BarChart primitive.
 * @startingPoint section="Core" subtitle="Custom sourced bar chart" viewport="700x260"
 */
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarDatum[];
  /** Scale maximum. Defaults to the largest value. */
  max?: number;
  /** Unit appended to each value, e.g. "%". */
  unit?: string;
  /** Mono source line beneath the chart. */
  source?: string;
}

/**
 * Custom horizontal bar chart — hairline baseline, light-weight values, no library chrome.
 * Bars grow on reveal inside an .atlas-stage.
 * @dsCard group="Components"
 */
export function BarChart(props: BarChartProps): JSX.Element;
