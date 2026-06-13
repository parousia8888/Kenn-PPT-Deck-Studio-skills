import * as React from "react";

/**
 * Props for the EvidenceCell primitive.
 * @startingPoint section="Core" subtitle="Modular evidence cell with source slot" viewport="700x220"
 */
export interface EvidenceCellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono cell label, e.g. "CELL A·01". */
  cellId?: string;
  /** Coordinate / locator shown top-right. */
  coord?: string;
  /** Footer source method + id. */
  method?: string;
  id?: string;
  /** Use recessed panel fill. @default false */
  muted?: boolean;
  children?: React.ReactNode;
}

/**
 * The modular evidence card — hairline border, mono header + source footer, no shadow.
 * @dsCard group="Components"
 */
export function EvidenceCell(props: EvidenceCellProps): JSX.Element;
