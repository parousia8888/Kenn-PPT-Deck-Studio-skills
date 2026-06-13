import * as React from "react";

/**
 * Props for the Metric primitive.
 * @startingPoint section="Core" subtitle="Big light-weight sourced metric" viewport="700x180"
 */
export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The number, pre-formatted (e.g. "84.2", "2.4"). */
  value: string | number;
  /** Unit set smaller and gray (e.g. "%", "×", "pt"). */
  unit?: string;
  /** Description beneath the number. */
  label?: string;
  /** Change indicator text, e.g. "+12 pts". Leading "-" infers downward. */
  delta?: string;
  /** Force delta direction. */
  deltaDir?: "up" | "down";
  /** Source method + id (renders a SourceNote). */
  method?: string;
  id?: string;
  /** @default "l" */
  size?: "xl" | "l" | "m" | "s";
}

/**
 * Large light-weight KPI number with unit, label, delta and source.
 * @dsCard group="Components"
 */
export function Metric(props: MetricProps): JSX.Element;
