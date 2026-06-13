import * as React from "react";

export interface MonoMetaItem {
  label: string;
  value: React.ReactNode;
  /** render the value in accent */
  accent?: boolean;
}

export interface MonoMetaProps {
  items: MonoMetaItem[];
  /** gap between pairs in px */
  gap?: number;
  style?: React.CSSProperties;
}

/** Keynote metadata row — label/value pairs in tracked mono (model, version, date, presenter). */
export function MonoMeta(props: MonoMetaProps): JSX.Element;
