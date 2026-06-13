import * as React from "react";

export interface DataColumn {
  /** Header text. */
  label: string;
  /** Key into row objects (omit when rows are arrays). */
  key?: string;
  align?: "left" | "right" | "center";
  /** Render this column in mono (codes, ids). */
  mono?: boolean;
  /** Render values large + light (a focal figure). */
  emphasize?: boolean;
}

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataColumn[];
  /** Array of objects (keyed by column.key) or array-of-arrays. */
  rows: Array<Record<string, React.ReactNode> | React.ReactNode[]>;
  /** Mono source line beneath the table. */
  source?: string;
  /** Paper-tone zebra striping. @default true */
  zebra?: boolean;
}

/**
 * Ruled, mono-headed evidence table. 2px ink rule under the header, hairline rows.
 * @dsCard group="Components"
 */
export function DataTable(props: DataTableProps): JSX.Element;
