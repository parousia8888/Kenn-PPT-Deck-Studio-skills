# Data, Table, And Source Discipline

Use this reference when a deck contains tables, evidence ledgers, charts, KPI
blocks, citations, or source notes.

## Core Rule

Data design starts from the reader's task:

- compare values;
- locate one row;
- explain a change;
- show a process or relationship;
- document evidence and limits.

Do not default to dashboard panels, radar charts, pies, or decorative diagrams.
Pick the smallest chart primitive that makes the relationship inspectable.

## Table Rules

Default 1280x720 floors:

| Element | Minimum |
|---|---:|
| Header text | 10px mono / 12px sans |
| Body text | 12px dense / 13px normal |
| Row height | 28px dense / 34px normal |
| Cell horizontal padding | 8px dense / 12px normal |
| Source note | 9.5px, non-critical only |

Dense sample limits:

- max 6 columns in a full-width table;
- max 7 body rows without pagination or grouping;
- max 3 lines inside a cell;
- numeric columns use tabular figures and right alignment;
- row rules may be faint, but header/body separation must be unambiguous;
- do not use zebra stripes unless they materially improve scanning.

## Chart Rules

- Use bar charts for magnitude comparison.
- Use line charts only when time or ordered sequence matters.
- Use slope charts for before/after across multiple categories.
- Use matrix/heat tables for two-dimensional classification.
- Use small multiples when one chart would need too many encodings.
- Use annotation callouts when the main story is a specific exception.
- Avoid pie/donut charts for more than three slices.
- Avoid radar/spider charts unless the selected grammar explicitly allows them.
- Avoid 3D charts, decorative gradients, and fake terminal noise.

## Source Notes

Every number with argumentative weight needs a source note or a visible "示意 /
sample / estimate" mark.

Source notes must be:

- attached to the metric/table/chart they support;
- short enough to read at 1280x720;
- no more than 2 lines by default;
- in mono only when the selected style uses mono metadata;
- outside the main title slot and away from footers that already carry navigation.

## Data Aesthetics By Family

- `data-terminal`: ruled tables, ticker rows, compact deltas, no soft SaaS cards.
- `proof-dossier`: source tags, evidence cells, risk markers, footnoted ledgers.
- `founder-memo`: memo rows, decision tables, sparse KPI evidence, low decoration.
- `education-institutional`: checklists, path diagrams, parent decision tables.
- `cinematic-keynote`: single KPI, capability scale, before/after, sparse labels.
- `swiss-grid-signal`: matrix, ledger, axis, hard rules, no shaded card soup.

## QA Expectations

Run contrast QA before asking for approval:

```bash
node scripts/contrast-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
```

The script should fail on unreadable foreground/background pairs and report the
text role involved. Typography QA handles table row and source-note density.

Reference anchors:

- Financial Times Visual Vocabulary: https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md
- Datawrapper Academy: https://www.datawrapper.de/academy/
- Nielsen Norman Group data tables: https://www.nngroup.com/articles/data-tables/
- WCAG 2.2 contrast: https://www.w3.org/TR/WCAG22/
