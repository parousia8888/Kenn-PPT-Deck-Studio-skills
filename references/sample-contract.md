# Style Sample Contract

Use this file when producing Gate 1B visual samples. It is a structural contract,
not a visual template.

## Required Markup

The deck root must declare:

```html
<main
  class="deck-shell"
  data-style-id="braun-graphite-orange"
  data-template-id="course-canvas"
  data-grammar-profile="industrial-control">
```

Every slide must declare:

```html
<section
  class="slide"
  data-slide-role="title"
  data-layout-id="cover-rail">
```

For strict or measured grid profiles, the deck root or each slide must also
declare the 16:9 grid source of truth:

```html
<main
  data-grid-mode="strict"
  data-grid-cols="12"
  data-grid-baseline="8"
  data-grid-gutter="24"
  data-grid-margin-x="72"
  data-grid-margin-y="56">
```

Gate 1B samples should include these roles:

- `title`: title typography, color dominance, background/motion mood.
- `dense`: dense teaching/proof handling, component density, text hierarchy.
- `diagram`: chart/process/diagram language, shape grammar, motion semantics.

## Component Role Tags

Use `data-component-role` whenever a component is more specific than a normal
text block or template primitive:

```html
<aside class="signal-board" data-component-role="instrument-panel">
```

Role examples:

- `instrument-panel`: industrial-control graphite panel with gauges/bars.
- `telemetry-panel`: automotive-telemetry metric panel.
- `terminal-pane`: data-terminal log/table pane.
- `evidence-cell`: proof-dossier source-backed evidence block.
- `source-note`: citation/source footer.
- `course-step`: education/course process item.
- `stage-surface`: cinematic-keynote product/stage surface.

If the selected grammar does not allow a role, do not use it.

## Layout Ids

Use the execution grammar's `layoutGrammar.allowedFamilies` values as the source
for `data-layout-id`. For example, `braun-graphite-orange` maps to
`industrial-control`, so valid layout families include:

- `cover-rail`
- `instrument-grid`
- `comparison-ledger`
- `calibration-process`
- `control-panel-split`
- `metric-strip`

Do not use anonymous structures such as `slide-grid`, `content-page`, `page-2`,
or `custom-layout` unless the grammar has been extended first.

The validator treats the whitelist as binding. A slide that declares
`data-layout-id="custom-layout"` under `industrial-control` must fail even if the
page looks visually acceptable.

## Grid Discipline Trace

For strict/measured profiles, major regions must leave a measurable trace:

```html
<div class="grid-band" data-grid-band="headline" style="grid-column: 1 / 8">
  ...
</div>
<div class="grid-overlay" data-grid-overlay="same-box" aria-hidden="true"></div>
```

Rules:

- `data-grid-band` marks title, dense content, chart/process, evidence rails, or
  other major regions.
- band edges should align to the computed column starts/ends from the grid
  tokens, not merely look aligned by eye.
- overlay/debug guides must live inside the same slide/content box and read the
  same grid tokens as the content.
- optional grid profiles may use looser composition, but must still keep
  `data-layout-id` and safe zones auditable.

## Template Component Trace

Samples should leave an auditable trace back to the chosen template:

- use the template's registered class prefix when the profile lists one, such as
  `cc-` / `ccc-` for `course-canvas`; or
- declare enough `data-component-role` values for derived components to show that
  the sample is following the grammar instead of a one-off mini UI kit.

Do not satisfy the style gate with unregistered classes like `card`, `box`,
`panel`, `pill`, or `metric` unless they are either in the template manifest or
role-tagged and compliant with the profile grammar.

## Braun / Industrial-Control Example

Allowed:

```html
<section class="slide" data-slide-role="diagram" data-layout-id="calibration-process">
  <ol class="calibration-steps">
    <li><span class="step-tab">01</span><strong>先分维度</strong></li>
    <li><span class="step-tab">02</span><strong>设判断问题</strong></li>
  </ol>
</section>
```

Forbidden for `industrial-control`:

```html
<span class="process-num">01</span>  <!-- circle badge if CSS uses border-radius:50% -->
<svg><text>认知</text></svg>         <!-- SVG text labels -->
<div class="radar-card">...</div>    <!-- radar/spider chart -->
<h1 style="font-family:serif;font-weight:800">...</h1>
```

## Validation

Run before showing a sample:

```bash
node scripts/validate-style-sample.mjs --file=<sample-index.html> --style=<style-id> --template=<template-id>
node scripts/visual-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_visual_qa
node scripts/grid-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
```

Validation or visual QA failure means the sample is not ready for user approval.
Visual QA failure includes document scrollbars, slide scroll overflow, browser
errors, elements outside the 1280x720 slide, or clipped text blocks.
Grid QA failure includes missing grid tokens, missing `data-grid-band`,
off-column bands, missing same-box overlay, or baseline drift.

Run the local regression harness after changing grammar or validator behavior:

```bash
node scripts/test-style-grammar.mjs
```
