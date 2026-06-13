import * as React from "react";

export interface SourceNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Collection / method, e.g. "internal telemetry". */
  method?: string;
  /** Source identifier, e.g. "SRC-2087" or "n=412". */
  id?: string;
  /** Leading word. @default "Source" */
  label?: string;
  /** @default "left" */
  align?: "left" | "right";
}

/**
 * Provenance line for any data point — ▪ SOURCE · method · id.
 * @dsCard group="Components"
 */
export function SourceNote(props: SourceNoteProps): JSX.Element;
