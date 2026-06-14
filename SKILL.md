---
name: kenn-ppt-deck-studio
description: "Use this skill to guide and produce high-aesthetic HTML/PPT decks end to end for Kenn: class teaching decks, investor pitch decks, education prospectus decks, evidence/data decks, and launch-event keynote decks. It covers information gathering, source/material reading, style confirmation with sample preview, narrative framework confirmation, section/detail confirmation, single-file HTML production, optional generated visuals, and optional PPTX/PDF export after explicit confirmation."
---

# Kenn PPT Deck Studio

Purpose: build high-recognition, high-aesthetic presentation decks with a guided
plain-language workflow. Default deliverable is a **single-file HTML deck**. Ask
before generating images, browsing, producing PPTX/PDF, or changing style.

## Hard Workflow

Do not start slide production until these gates are confirmed:

1. **Style first, with two approvals.** Identify deck type and recommend 1-3
   candidate styles from the locked style catalog. A style must define color
   master, typography temperament, layout density, graphic language, motion
   grammar, **component grammar, shape grammar, layout whitelist, grid
   discipline, typography discipline, CJK line-break discipline, data/source
   discipline, contrast discipline, and motion snapshot discipline**. Gate 1 has
   two separate approvals:
   - **1A Style ID approval:** user chooses a template/style direction.
   - **1B Visual sample approval:** after 1A, produce a mandatory 2-3 slide
     style sample, validate it with the selected style execution grammar, and ask
     whether the sample is accepted.
   Choosing a style id, approving web research, or requesting PPTX/PDF does **not**
   permit Gate 2. Only explicit approval of the visual sample permits narrative
   framework work.
2. **Narrative framework second.** Confirm the story arc, page count, audience,
   use case, and expected outcome.
3. **Detailed sections third.** Confirm slide-by-slide sections, paragraph/detail
   level, required data, must-include/must-avoid content, and source/material use.
4. **Production last.** Build the deck only after the previous gates are accepted.

If the user has no idea, guide them through the gates in short Chinese/plain
language. If the user already has ideas or materials, read/inspect materials first,
then still confirm style -> narrative -> details.

## Template Routing

Use bundled templates in `assets/templates/`:

- **上课课件 / lesson / courseware** -> `course-canvas`
- **投资人 pitch deck / fundraising / demo day** -> `investor-signal`
- **教育机构宣传册 / school brochure / prospectus** -> `academy-prospectus`
- **研究报告 / 数据证据 / 战略复盘 / case proof** -> `proof-atlas`
- **产品发布会 / 高级发布会 / keynote / launch event** -> `launch-theatre`
- **杂志感 / 瑞士风 / custom lightweight web PPT** -> `assets/guizang-base`

For visual specifics, read `references/style-routing.md` and the chosen template's
own `SKILL.md` or `readme.md`. Load only the chosen template docs, not every
template.

## Style System Lock

Before making any deck or full outline, read `references/style-system.md` and use
`assets/style-systems/style-catalog.json` to select a style system. After a style
id is chosen, read `assets/style-systems/execution-grammar.json` or run
`node scripts/list-style-grammar.mjs --style=<style-id>` before making the visual
sample. Do not invent freehand palettes or ad hoc UI component libraries. Do not
accept vague labels like "科技感" or "高级简洁" as the final style; translate them
into a named style id plus concrete choices on:

- color master and usage ratio
- Windows-safe typography temperament
- layout density and whitespace
- graphic language for diagrams/charts/images
- motion grammar and B low-power mode
- component grammar: allowed/forbidden panels, cards, badges, callouts, icons
- shape grammar: radius, shadows, circle/pill/rect rules, chart primitives
- layout whitelist: named slide families and title/content safe zones
- grid discipline: 16:9 grid tokens, column/baseline alignment, same-box overlay
- typography discipline: title line count, readable floors, CJK line breaks,
  Windows-safe font roles
- data/source discipline: table density, chart primitive, source-note limits
- contrast discipline: measured text/background readability
- motion snapshot discipline: initial, settled, and B-mode states are approvable

Style gate output may only be:

1. a style candidate proposal, or
2. a 2-3 slide visual sample for the selected style.

After the user picks a style candidate, the next assistant action must be making
or showing the visual sample, not giving the narrative framework, source list,
12-page outline, or production plan. Do not produce the full outline or full deck
until the user explicitly accepts the visual sample. Before asking for sample
approval, run both checks:

```bash
node scripts/validate-style-sample.mjs --file=<sample-index.html> --style=<style-id> --template=<template-id>
node scripts/type-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
node scripts/contrast-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
node scripts/motion-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_motion_qa
node scripts/visual-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_visual_qa
```

If validation or visual QA fails, revise the sample first. Do not ask the user to
approve a sample with known grammar violations, browser errors, scrollbars,
clipped text, elements outside the 1280x720 slide frame, missing grid tokens,
off-column grid bands, missing same-box overlay for strict/measured grid
profiles, unreadable type, bad Chinese title breaks, low contrast, over-dense
tables/source notes, or hidden first-frame motion states.

## Confirmation Gates

Required user confirmations:

- **Research/materials:** confirm whether to browse web, use provided files, or use
  only user-supplied notes. Use web browsing when facts may be current or the user
  asks to search.
- **Style:** confirm both selected style id and produced visual sample. Contact
  sheets live in `assets/contact-sheets/<template>/contact-sheet.png`, but a
  contact sheet is only a template reference; it does not replace the mandatory
  deck-specific 2-3 slide sample.
- **Generated visuals:** ask before generating images. Default recommendation is
  to generate visuals when they materially improve clarity or stage impact.
- **Export:** ask before producing PPTX/PDF. Default is single-file HTML.
- **External assets:** assets are allowed, but default output should still be a
  self-contained single HTML when practical.

## Build Rules

- Preserve the chosen template's design system. Do not reduce a template to a
  minimal implementation.
- Keep dynamic backgrounds and semantic motion. Keep **B** low-power/static mode.
- Use the approved style catalog tokens and execution grammar for colors, type,
  layout, graphics, motion, components, and shapes. If a new style is needed,
  derive it from the closest catalog style and define all axes before sampling.
- Use the chosen template's registered component classes and layout families
  before creating new HTML/CSS. New sample-only components must declare
  `data-component-role` and match the style grammar.
- Every sample/production deck root should declare `data-style-id`,
  `data-template-id`, and `data-grammar-profile`; every slide should declare
  `data-slide-role` and `data-layout-id`.
- For strict/measured grid profiles, expose grid tokens (`data-grid-*` or
  `--grid-*`), mark major regions with `data-grid-band`, and include a same-box
  grid overlay/debug hook before showing the sample.
- Gate 1B quality is not only "no overflow": run typography, contrast, motion,
  visual, and grid QA before asking for style approval.
- Keep Windows-safe font fallbacks. Prefer the `.system-fonts.single.html` build
  for offline/Windows handoff checks.
- Use product screenshots, diagrams, generated visuals, or data visualization when
  they clarify the deck. Avoid text-only decks unless the user asks.
- Use concise, spoken, slide-native copy. One slide should carry one job.
- Ask before switching style after approval.

## Key References

- `references/workflow.md` — full guided process and confirmation scripts.
- `references/style-routing.md` — template decision matrix and sample-preview rule.
- `references/style-system.md` — style gate rules, nine-axis execution lock, and quality rubric.
- `references/sample-contract.md` — required Gate 1B markup, role tags, layout ids,
  and examples of grammar-compliant/forbidden sample components.
- `references/layout-discipline.md` — 16:9 grid tokens, column/baseline discipline,
  same-box overlay rule, and grid QA failure modes.
- `references/typography-discipline.md` — title wrapping, CJK line breaking,
  readable type floors, and Windows-safe font stacks.
- `references/data-viz-discipline.md` — chart choice, table density, source-note,
  and contrast expectations.
- `references/style-archetypes.md` — high-granularity art-direction families for
  deriving new styles without vague mood labels.
- `assets/style-systems/style-catalog.json` — 50+ locked high-aesthetic style systems.
- `assets/style-systems/execution-grammar.json` — component grammar, shape grammar,
  layout families, type locks, chart rules, and validation flags for each style.
- `references/build-and-export.md` — how to copy, package, verify, and optionally export.
- `references/compliance.md` — provenance and license handling, including guizang MIT attribution.

## Common Commands

List templates:

```bash
node scripts/list-templates.mjs
```

List style systems, optionally filtered by use:

```bash
node scripts/list-styles.mjs
node scripts/list-styles.mjs --use=courseware
node scripts/list-style-grammar.mjs --style=braun-graphite-orange
```

Copy a template pack to a working folder:

```bash
node scripts/create-project.mjs --template=launch-theatre --out=/path/to/project
```

After editing a template's canonical deck, run that template's own pack/verify
scripts from inside the copied project.

Validate a Gate 1B style sample before showing it:

```bash
node scripts/validate-style-sample.mjs --file=/path/to/index.html --style=<style-id> --template=<template-id>
node scripts/type-qa-sample.mjs --file=/path/to/index.html --style=<style-id>
node scripts/contrast-qa-sample.mjs --file=/path/to/index.html --style=<style-id>
node scripts/motion-qa-sample.mjs --file=/path/to/index.html --style=<style-id> --out=/path/to/_motion_qa
node scripts/visual-qa-sample.mjs --file=/path/to/index.html --style=<style-id> --out=/path/to/_visual_qa
```

Debug grid discipline failures directly:

```bash
node scripts/grid-qa-sample.mjs --file=/path/to/index.html --style=<style-id>
```

Run style grammar regression checks after changing style rules or validators:

```bash
node scripts/test-style-grammar.mjs
```
