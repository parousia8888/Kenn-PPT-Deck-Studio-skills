# Style System

Use this reference during Gate 1 whenever the user asks for a stronger artistic
direction, a custom style, a palette change, or a style sample.

## Core Rule

Every deck must choose a **style system** before production. A style system is not
just a palette. It must lock these five axes:

1. **Color master:** named palette tokens, usage ratio, contrast target, accent
   discipline, and forbidden color habits.
2. **Typography temperament:** Windows-safe font stack, serif/sans/mono role,
   title scale, casing, weight range, and line-height behavior.
3. **Layout density:** grid, margins, card count, whitespace ratio, paragraph
   limits, and information density per slide.
4. **Graphic language:** diagrams, charts, icons, imagery, texture, borders,
   shadows/glow, and data visualization style.
5. **Motion grammar:** background motion, entrance order, chart animation, hover
   behavior, duration/easing, low-power mode, and forbidden motion.

Do not use vague instructions like "tech feel", "premium", "simple", "warm", or
"high-end black" as a final style. Translate them into one catalog style plus
explicit modifications on the five axes.

## Source-Informed Principles

- Use design tokens rather than hardcoded one-off values: color, type, spacing,
  radius, shadow, grid, and motion must be tokenized.
- Assign colors by semantic role (`bg`, `surface`, `text`, `muted`, `accent`,
  `accent2`, `danger`, `grid`, `glow`) rather than by taste.
- Keep neutrals dominant; accents are sparse and purposeful. Typical ratios:
  `70/20/8/2`, `76/16/6/2`, or `82/12/4/2`.
- Meet contrast before beauty: normal slide text should target 4.5:1; large
  display type and essential non-text marks should target at least 3:1.
- Motion must have a job: reveal structure, focus attention, show state change,
  or express background atmosphere. Avoid decorative bounce, stretch, sudden
  stops, and constant high-energy movement.
- Current premium signals can include bold minimalism, metallic restraint,
  pixel/terminal traces, textured grain, retro serif, cinematic stage lighting,
  collage/layering, dark mode, vibrant but disciplined accents, and tactile
  imperfect surfaces. Use them as controlled ingredients, not as a pile-up.

Reference anchors used to shape these rules:

- Material Design 3 color roles and design tokens:
  https://m3.material.io/styles/color/roles
  https://m3.material.io/foundations/design-tokens
- IBM Carbon color/type/motion tokens and Carbon for AI:
  https://carbondesignsystem.com/elements/color/overview/
  https://carbondesignsystem.com/elements/typography/overview/
  https://carbondesignsystem.com/elements/motion/overview/
  https://carbondesignsystem.com/guidelines/carbon-for-ai/
- Apple HIG color, typography, motion, and material guidance:
  https://developer.apple.com/design/human-interface-guidelines/color
  https://developer.apple.com/design/Human-Interface-Guidelines/typography
  https://developer.apple.com/design/human-interface-guidelines/motion
  https://developer.apple.com/design/Human-Interface-Guidelines/materials
- WCAG 2.2 contrast requirements:
  https://www.w3.org/TR/WCAG22/
  https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Current trend signals used only as ingredients, not as templates:
  https://www.adobe.com/express/learn/blog/design-trends-2026
  https://www.canva.com/newsroom/news/design-trends-2026/
  https://www.figma.com/resource-library/web-design-trends/

## Style Gate Procedure

1. Pick 1-3 candidate styles from `assets/style-systems/style-catalog.json`.
2. Show the user a short Chinese comparison:
   - style id/name
   - why it fits this deck
   - color master
   - typography temperament
   - density
   - graphic language
   - motion grammar
   - what it must avoid
3. Ask the user to confirm one style or request changes.
4. If the user asks for a new style, derive it from the closest catalog entry and
   still define all five axes before making a sample.
5. After the user chooses a style id, produce only a style sample at this gate:
   2-3 slides max, usually title, information-dense content, and chart/process.
   Do not make the full deck or the full narrative outline until the style sample
   is accepted.

Important distinction:

- "I choose this style" = permission to make the sample.
- "Allow web research" = permission to browse when needed, not permission to skip
  the sample.
- "Need PPTX/PDF" = export intent, not permission to skip the sample.
- "OK, generic version" = content scope, not permission to skip the sample.
- Only "this sample is approved / use this sample / 这个样片确认" unlocks
  narrative framework work.

## Style Sample Requirements

A valid sample must show:

- **Title slide:** headline typography, color dominance, background/motion mood.
- **Dense teaching/proof slide:** paragraph handling, card density, grid, line
  lengths, visual hierarchy.
- **Diagram/chart/process slide:** graphic language, accent usage, chart motion,
  data labels.
- **B mode:** mention or include low-power/static behavior.
- **Windows font fallback:** use the system-font stack unless the user approved
  embedded fonts.

If the user asks for PPTX/PDF, the visual sample may still be HTML first. Export
comes later after narrative and detailed sections are approved.

## Quality Rubric

Score each sample from 0-3 before showing it:

| Axis | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Color | random/dirty | mostly coherent | tokenized | source-anchored, ratio-controlled, high contrast |
| Type | default | legible | role-based | strong temperament with Windows-safe fallbacks |
| Density | cramped/empty | usable | slide-appropriate | tuned to audience and talk rhythm |
| Graphics | generic cards | clear but plain | distinctive | recognizable system across diagrams/charts/images |
| Motion | absent/noisy | decorative | semantic | restrained, layered, B-mode safe |

Do not ask the user to approve a sample with any axis below 2. For Kenn's decks,
aim for at least 13/15 total.

## Red Flags

- Dark green/gray monotone masquerading as "AI Lab".
- Cyan-only "tech" palettes with no secondary accent or neutral discipline.
- Black-gold generic luxury.
- Purple-blue gradient overuse.
- Beige/cream/sand dominance unless the source style demands it and contrast is
  high.
- Cards inside cards, low-contrast hairlines, or grids that cover every surface
  at equal strength.
- Mac-only fonts, web fonts without confirmation, or screenshots that rely on
  unavailable assets.
- Full deck production before style acceptance.
