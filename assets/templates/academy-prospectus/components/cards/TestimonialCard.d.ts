import React from "react";

/**
 * TestimonialCard props.
 * @startingPoint section="Cards" subtitle="Designed testimonial / case story" viewport="420x260"
 */
export interface TestimonialCardProps {
  /** The quote text — keep it human and specific. */
  quote: React.ReactNode;
  name: string;
  /** Mono role line, e.g. "Parent · Hangzhou Campus". */
  role?: string;
  style?: React.CSSProperties;
}

/**
 * A designed testimonial — serif quote, raised quotation mark, attribution
 * under a hairline with a top accent rule. Reads as crafted, not a copied review.
 */
export function TestimonialCard(props: TestimonialCardProps): JSX.Element;
