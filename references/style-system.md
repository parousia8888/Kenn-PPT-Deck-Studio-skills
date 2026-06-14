# Style System

Use this reference during Gate 1 whenever the user asks for a stronger artistic
direction, a custom style, a palette change, or a style sample.

## Core Rule

Every deck must choose a **style system** before production. A style system is not
just a palette or mood label. It must lock these axes:

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
6. **Component grammar:** allowed panels, cards, badges, callouts, counters,
   nav, source notes, icon buttons, and their semantic roles.
7. **Shape grammar:** permitted primitives, forbidden primitives, radius range,
   shadow/elevation, circle/pill/rect rules, and chart node geometry.
8. **Layout whitelist:** named slide families, safe zones, title/content slots,
   max cards/modules, and required layout ids.
9. **Grid discipline:** 16:9 frame tokens, column/baseline rhythm, major-region
   `data-grid-band` trace, same-box overlay/debug hook, and measurable alignment.
10. **Typography discipline:** title line count, readable floors, CJK line-start
    and line-end rules, role-based font stacks, and table/source text limits.
11. **Contrast discipline:** measured foreground/background contrast for text,
    chart marks, rules, and essential non-text UI.
12. **Motion snapshot discipline:** the first frame, settled frame, and B/static
    mode must all be approvable and nonblank.

Do not use vague instructions like "tech feel", "premium", "simple", "warm", or
"high-end black" as a final style. Translate them into one catalog style plus
explicit modifications on all required axes.

## Execution Grammar Lock

After a user selects a style id, read the execution grammar before drawing the
sample:

```bash
node scripts/list-style-grammar.mjs --style=<style-id>
```

The grammar in `assets/style-systems/execution-grammar.json` is the binding rule
set for:

- component roles: which panels/cards/badges/callouts exist, what they mean, and
  which ones are forbidden;
- shape rules: whether circles, pills, rounded cards, black panels, glows, radar
  charts, SVG text, or shadows are allowed;
- layout families: which slide structures can be used and which title/content
  safe zones must be preserved;
- grid discipline: whether the style is strict, measured, or optional; what
  columns, gutters, margins, and baseline apply to a 1280x720 deck; and whether
  the sample must expose `data-grid-band` plus a same-box overlay/debug hook;
- type locks: title/body/mono role, Windows stack, forbidden font temperament;
- chart rules: approved chart primitives and explicitly banned chart types;
- typography, table/source, contrast, and motion snapshot discipline;
- validator flags: what `scripts/validate-style-sample.mjs` must reject.

If the chosen template already has a component library, use it as the first
source of truth. A derived style may remap tokens or restrict variants, but it
must not replace the template with anonymous ad hoc CSS. If a new component is
unavoidable in a sample, it must declare `data-component-role="<role>"` and be
listed in the grammar role it satisfies.

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
- W3C Chinese Layout Requirements and modern CSS text wrapping:
  https://www.w3.org/TR/clreq/
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap
- Fluent 2 typography and Financial Times Visual Vocabulary:
  https://fluent2.microsoft.design/typography
  https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md
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
   - component/shape restrictions that matter for this deck
   - grid discipline and overlay/debug expectations
   - what it must avoid
3. Ask the user to confirm one style or request changes.
4. If the user asks for a new style, derive it from the closest catalog entry and
   still define all style axes before making a sample.
5. After the user chooses a style id, produce only a style sample at this gate:
   2-3 slides max, usually title, information-dense content, and chart/process.
   Do not make the full deck or the full narrative outline until the style sample
   is accepted.
6. Validate the style sample before asking for approval:

```bash
node scripts/validate-style-sample.mjs --file=<sample-index.html> --style=<style-id> --template=<template-id>
node scripts/type-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
node scripts/contrast-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
node scripts/motion-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_motion_qa
node scripts/visual-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_visual_qa
```

`visual-qa-sample.mjs` runs grid QA when `--style` is passed. If either check
fails, revise the sample. Do not ask the user to approve known violations.

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
- **Title wrapping:** h1/h2 line count, title slot width, CJK punctuation breaks,
  and tail-line quality pass typography QA.
- **Data/source readability:** tables, source notes, KPI captions, and chart labels
  meet style-specific density floors.
- **Contrast:** text and essential chart labels pass measured contrast checks.
- **Motion snapshots:** initial, settled, and B/static screenshots show content
  in an approvable state.
- **B mode:** mention or include low-power/static behavior.
- **Windows font fallback:** use the system-font stack unless the user approved
  embedded fonts.
- **Execution grammar:** root has `data-style-id`, `data-template-id`,
  `data-grammar-profile`; each slide has `data-slide-role` and `data-layout-id`.
- **Component library:** uses the chosen template's registered components/classes
  or explicitly role-tagged derived components.
- **Shape proof:** the diagram/process page must demonstrate the style's allowed
  primitives and avoid its forbidden primitives.
- **Grid proof:** strict/measured profiles must expose `data-grid-*` or
  `--grid-*` tokens, align major `data-grid-band` regions to computed columns,
  and include a same-box overlay/debug hook.

If the user asks for PPTX/PDF, the visual sample may still be HTML first. Export
comes later after narrative and detailed sections are approved.

## Fail Conditions

Reject a sample before showing it when any of these are true:

- style id is selected but execution grammar was not read;
- sample uses anonymous cards/panels that are not in the template or grammar;
- root lacks `data-style-id` / `data-template-id` / `data-grammar-profile`;
- slides lack `data-layout-id`, so the layout cannot be audited;
- strict/measured grid profile lacks grid tokens, lacks `data-grid-band`, places
  bands off computed column lines, or lacks a same-box grid overlay/debug hook;
- style says no circular badges but CSS uses `border-radius:50%`, SVG `<circle>`,
  or circular process numbers;
- style says no radar/spider chart but the diagram uses radar geometry;
- dark/black panels appear without a permitted semantic role such as
  `instrument-panel`, `telemetry-panel`, or `terminal-pane`;
- title font family contradicts the style temperament, e.g. heavy Songti/serif
  display in `braun-graphite-orange`;
- SVG contains visible text in styles that require HTML labels;
- title or side panel overlaps in a 1280x720 check;
- title breaks into too many lines, creates a one/two-character CJK tail, or has
  forbidden CJK punctuation at line start/end;
- body/table/source text falls below the style's readability floor;
- foreground/background contrast fails the style's threshold;
- animation hides core content during sample approval screenshots;
- B low-power mode is missing.

## Quality Rubric

Score each sample from 0-3 before showing it:

| Axis | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Color | random/dirty | mostly coherent | tokenized | source-anchored, ratio-controlled, high contrast |
| Type | default | legible | role-based | strong temperament with Windows-safe fallbacks |
| Density | cramped/empty | usable | slide-appropriate | tuned to audience and talk rhythm |
| Graphics | generic cards | clear but plain | distinctive | recognizable system across diagrams/charts/images |
| Motion | absent/noisy | decorative | semantic | restrained, layered, B-mode safe |
| Components | anonymous ad hoc UI | mostly coherent | template-based | role-locked, reusable, validator-checkable |
| Shapes | mixed primitives | mostly matching | profile compliant | distinctive, style-specific grammar |
| Layout | improvised pages | usable grid | named layouts | registered family + safe-zone checked |
| Grid | decorative or absent | plausible by eye | tokenized with bands | measured columns/baseline + same-box overlay verified |

Do not ask the user to approve a sample with any axis below 2. For Kenn's decks,
aim for at least 24/27 total.

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
- Style samples made from fresh one-off CSS instead of the selected template
  component system.
- Circular number badges, pill chips, or radar charts appearing in a style whose
  grammar forbids them.
- Black panels used as visual decoration instead of a declared semantic component.
