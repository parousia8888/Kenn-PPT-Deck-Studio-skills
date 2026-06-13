# Build And Export

## Create A Project

Use the helper:

```bash
node scripts/create-project.mjs --template=<template-id> --out=<project-dir>
```

This copies the full template pack. Edit inside the project copy, not inside the
skill assets, unless the user explicitly asks to update the skill template itself.

## Template Entrypoints

| Template | Canonical Deck | Default Single HTML | System-Fonts Single HTML |
|---|---|---|---|
| `course-canvas` | `decks/course-canvas-full/index.html` | `dist/course-canvas-teaching-deck.single.html` | `dist/course-canvas-teaching-deck.system-fonts.single.html` |
| `investor-signal` | source package / dist deck | `dist/investor-signal-pitch-deck.single.html` | `dist/investor-signal-pitch-deck.system-fonts.single.html` |
| `academy-prospectus` | `decks/academy-prospectus-full/index.html` | `dist/academy-prospectus-deck.single.html` | `dist/academy-prospectus-deck.system-fonts.single.html` |
| `proof-atlas` | `decks/proof-atlas-full/index.html` | `dist/proof-atlas-evidence-deck.single.html` | `dist/proof-atlas-evidence-deck.system-fonts.single.html` |
| `launch-theatre` | `decks/launch-theatre-full/index.html` | `dist/launch-theatre-keynote-deck.single.html` | `dist/launch-theatre-keynote-deck.system-fonts.single.html` |

## Packaging

Most template packs include:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=<canonical> --output=<dist-file> --font-mode=online
node scripts/pack-single-html.mjs --input=<canonical> --output=<system-dist-file> --font-mode=system
```

`investor-signal` starts from its dist-ready deck and uses its pack/verify scripts.
Read that template's `readme.md` before changing build commands.

## Verification

Run style grammar validation before template-specific rendering checks:

```bash
node scripts/validate-style-sample.mjs --file=<html-file> --style=<style-id> --template=<template-id>
```

After editing the shared style catalog, execution grammar, or validator, run:

```bash
node scripts/test-style-grammar.mjs
```

This checks style/profile coverage and verifies that a compliant Braun sample
passes while a known bad Braun sample fails for circular badges, radar/SVG text,
wrong layout id, unroled dark surfaces, and forbidden title typography.

For Gate 1B samples, validation must pass before asking for approval. For full
decks, validation should still pass unless a user explicitly approved a grammar
exception.

Use template-specific verifier when present:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/verify-deck.mjs --input=<single-html> --out=_verify_single
```

Check:

- 10 slides or intended page count
- navigation
- dynamic backgrounds
- semantic reveal final states
- B low-power/static mode
- no obvious overflow
- contact sheet
- `data-style-id`, `data-template-id`, `data-grammar-profile` on the deck root
- `data-slide-role` and `data-layout-id` on every slide
- no forbidden component/shape/chart/type violations for the selected style

## Export

Default output is single-file HTML. Before PPTX or PDF:

1. Ask the user whether they want export.
2. Clarify target: editable PPTX, PDF handout, image deck, or browser-first HTML.
3. Explain likely fidelity tradeoff if exporting from HTML to PPTX.
4. Generate only after confirmation.

For PPTX generation, use the available presentation tooling only after this
confirmation. Keep the HTML source as the visual source of truth unless the user
explicitly asks for a native PPTX-first rebuild.
