import React from "react";

/**
 * TeacherCard props.
 * @startingPoint section="Cards" subtitle="Editorial teacher profile card" viewport="320x440"
 */
export interface TeacherCardProps {
  name: string;
  /** Mono discipline / role line, e.g. "Director · Linguistics". */
  discipline: string;
  /** Short scholarly bio shown under a hairline. */
  bio?: string;
  /** Portrait image URL; a documentary placeholder is shown if omitted. */
  image?: string;
  style?: React.CSSProperties;
}

/**
 * An editorial faculty profile — documentary portrait, serif name, mono
 * discipline, a short bio. Intentionally not a generic centred avatar card.
 */
export function TeacherCard(props: TeacherCardProps): JSX.Element;
