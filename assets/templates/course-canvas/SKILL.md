---
name: course-canvas-design
description: Use this skill to generate well-branded interfaces, teaching decks, and assets for Course Canvas — a premium teaching-deck design system (warm paper, editorial serif, legible sans, quiet mono, oxblood/sage/straw accents). For production work or throwaway prototypes, mocks, slides, and brochures. Contains design guidelines, color & type tokens, fonts, logo assets, reusable components, ten slide layouts, and a live motion system.
user-invocable: true
---

Read the `readme.md` file within this skill first — it is the full design guide
(content voice, visual foundations, iconography, motion grammar, and a manifest
of everything available). Then explore the other files as needed.

What's here:
- `styles.css` — the one stylesheet to link; it `@import`s all tokens + component CSS.
- `tokens/` — colors, typography (with Windows-safe + Chinese fallback stacks), spacing, effects, fonts (Google CDN).
- `components/` — React primitives (`Button`, `Badge`, `Card`, `Callout`, `KeyTerm`, `NumberTab`, `MarginNote`, `StepList`, `RuleHeading`); each has a `.prompt.md` with usage.
- `slides/` — `deck.css` (the slide-layout language), ten ready slide layouts (`01..10-*.html`), `cc-bg.js` (animated paper background), `cc-motion.js` (reveal recipes).
- `decks/course-canvas-full/` — the canonical 10-slide navigable deck assembled from every slide layout. Use this for deck production; do not reduce it to the 6-slide sample.
- `decks/normal-distribution/` — a live, navigable sample lesson showing the motion grammar.
- `dist/course-canvas-teaching-deck.single.html` — default single-file HTML deliverable with CDN webfonts.
- `dist/course-canvas-teaching-deck.system-fonts.single.html` — single-file HTML deliverable without external font imports, using Windows-safe fallbacks.
- `scripts/build-canonical-deck.mjs` — rebuilds the canonical 10-slide deck from `slides/01..10-*.html`.
- `scripts/pack-single-html.mjs` — inlines local CSS/JS/assets into one HTML file. Use `--font-mode=online|system`.
- `scripts/verify-deck.mjs` — Playwright/Chrome validation for 10 slides, animated canvases, low-power mode, and reveal interactions.
- `guidelines/` — foundation specimen cards.
- `assets/` — logo SVGs.

How to work:
- **Visual artifacts** (slides, mocks, brochures, throwaway prototypes): copy the
  assets you need out of this skill and produce static HTML files for the user to
  view. For decks, start from a `slides/*.html` layout or assemble `<section>`s in
  a `<deck-stage>` like the sample deck; link `../styles.css` + the deck CSS, set
  `data-bg` and `data-recipe` per slide.
- **Production teaching decks:** start from `decks/course-canvas-full/index.html`
  or rebuild it with `node scripts/build-canonical-deck.mjs`. The full deck must
  keep all 10 layout families unless the user explicitly asks to remove pages.
  Default delivery is a single HTML file; ask before producing PPTX/PDF exports.
- **Production code**: copy assets and read the rules here to design accurately in
  the Course Canvas brand. Use the `.ccc-*` component classes (shipped via
  `styles.css`) and the design tokens — never hard-code hex values.

Hard rules to honour: warm paper (never pure white), the disciplined oxblood /
sage / straw accents (straw is highlight-only), the three type voices, no emoji,
no gradients/glass/blobs, small corners only, diagrams instead of stock imagery,
and subtle teacherly motion. Chinese text must use the Noto SC / Windows fallback
stacks (never macOS-only fonts). Press `B` toggles low-power/static mode; keep it
available in any generated deck.

If the user invokes this skill without other guidance, ask what they want to
build or design, ask a few clarifying questions, then act as an expert Course
Canvas designer who outputs HTML artifacts *or* production code as the need
dictates.
