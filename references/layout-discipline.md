# Slide Layout Discipline

Use this reference for Gate 1B samples and production decks when a style needs
editorial, Swiss, memo, research, prospectus, or report-like structure. It adapts
print grid discipline to a fixed 16:9 presentation frame. It is an original
internal rule set; do not copy external unlicensed grid-system skills or code.

## Core Principle

A layout is acceptable only when the grid is load-bearing. The overlay, content,
columns, baseline, and named layout id must share one source of truth. A visible
grid used only as decoration is a failure.

## Required 16:9 Grid Tokens

Every style sample should expose grid tokens on the deck root or slide when the
selected grammar profile has `gridDiscipline.mode` other than `optional`:

```html
<main
  class="deck-shell"
  data-grid-mode="strict"
  data-grid-cols="12"
  data-grid-baseline="8"
  data-grid-gutter="24"
  data-grid-margin-x="72"
  data-grid-margin-y="56">
```

Equivalent CSS custom properties are also accepted:

```css
:root {
  --grid-cols: 12;
  --grid-baseline: 8px;
  --grid-gutter: 24px;
  --grid-margin-x: 72px;
  --grid-margin-y: 56px;
}
```

Allowed defaults for 1280x720:

- `12 columns`, `24px gutter`, `72px x-margin`, `56px y-margin`, `8px baseline`
  for Swiss/editorial/report/memo systems.
- `10 columns`, `24px gutter`, `80px x-margin`, `56px y-margin`, `8px baseline`
  for cinematic/keynote systems with larger hero zones.
- `8 columns`, `24px gutter`, `72px x-margin`, `56px y-margin`, `8px baseline`
  for dense teaching systems when text needs wider columns.

Margins, gutters, padding, media heights, and rule positions should be multiples
of the baseline whenever practical.

## Grid Bands

Use auditable bands for major slide regions:

```html
<div class="grid-band" data-grid-band="hero" data-grid-cols="1 / 8">
  ...
</div>
```

At minimum, significant title, dense content, and diagram regions must either:

- declare `data-grid-band`; or
- use a template class whose manifest/grammar defines grid placement.

Avoid arbitrary absolute positioning unless the component role requires it
(`stage-surface`, `instrument-panel`, etc.) and the element still stays inside the
safe frame.

## Overlay

For styles with strict grid discipline, a debug overlay should exist or be easy to
enable:

```html
<div class="grid-overlay" aria-hidden="true" data-grid-overlay="same-box"></div>
```

Rules:

- overlay must live inside the same content box as the content;
- overlay must read the same grid tokens as the content;
- toggle with `G` or a debug class when practical;
- overlay must not be required for the final audience view.

## Typography And Baseline

- Use Windows-safe stacks unless user approved embedded fonts.
- Display titles can be optically adjusted, but do not depend on macOS-only
  font metrics.
- Body line-height should be a baseline multiple, usually `24px`, `28px`, or
  `32px`.
- Mono labels, folios, and captions should sit on the baseline or inside a
  baseline-height band.

## Failure Conditions

Reject the sample before user approval when any applies:

- grid profile is strict but root lacks grid tokens;
- strict profile has no `data-grid-band` or equivalent layout trace;
- overlay is present but uses a different content box than the slide content;
- visible content spills outside the 1280x720 frame;
- body or slide scrollbars appear in sample view;
- spacing is visually plausible but not measurable by the QA script;
- title, evidence rail, or diagram is placed by one-off coordinates while the
  selected style claims editorial/grid discipline.

## QA

Run after grammar validation and before asking for style approval:

```bash
node scripts/grid-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
node scripts/visual-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_visual_qa
```

`visual-qa-sample.mjs` already calls grid QA when a style id is provided. Use the
standalone command when debugging grid failures.
