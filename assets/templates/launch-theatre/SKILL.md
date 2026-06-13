---
name: launch-theatre-design
description: Use this skill to generate well-branded interfaces and assets for Launch Theatre, a cinematic product-launch presentation system, either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, the optical motion system, slide layouts, and UI kit components for prototyping dramatic, minimal, high-end launch moments.
user-invocable: true
---

# Launch Theatre

A cinematic product-launch presentation system: a black keynote stage with one
luminous accent, massive thin grotesk type, full-bleed product visuals, and a
restrained optical motion system. The goal of any artifact is a **launch moment,
not a report** — one idea per slide, negative space as a material, no decoration.

## Start here
Read **`readme.md`** first — it holds CONTENT FUNDAMENTALS (how copy is written),
VISUAL FOUNDATIONS (color, type, space, light, motion), ICONOGRAPHY, and the full
file index. Then explore:

- `styles.css` — the single stylesheet to link; `@import`s all tokens + fonts.
- `tokens/` — colors, typography, spacing, effects, motion (CSS custom properties).
- `motion/launch-theatre.{css,js}` — the optical WebGL background, semantic
  slide-reveal recipes (`data-anim`), number count-ups, and the **B** low-power
  toggle. Load both; put `data-lt-bg` on `<body>` or `data-lt-field` on a section.
- `slides/` — 10 ready cinematic slide layouts (`index.html`, `slides.css`) on a
  deck shell. The canonical way to build a Launch Theatre presentation.
- `decks/launch-theatre-full/` — the canonical 10-slide navigable deck, preserving
  all slide types and using a 1920x1080 stage.
- `dist/launch-theatre-keynote-deck.single.html` — default single-file HTML
  deliverable with CDN webfonts.
- `dist/launch-theatre-keynote-deck.system-fonts.single.html` — single-file HTML
  deliverable without external font imports, using Windows-safe fallbacks.
- `scripts/build-canonical-deck.mjs` — rebuilds the canonical deck from
  `slides/index.html`.
- `scripts/pack-single-html.mjs` — inlines local CSS/JS/assets into one HTML file.
  Use `--font-mode=online|system`.
- `scripts/verify-deck.mjs` — Chrome/Playwright validation for navigation, optical
  fields, reveal recipes, low-power mode, and screenshot contact sheets.
- `components/` — React primitives (`Button`, `Kicker`, `MonoMeta`, `Badge`,
  `ScreenFrame`, `FeatureCell`, `StageNumber`, `ProgressRail`).
- `ui_kits/launch-site/` — a full cinematic launch microsite built from the system.
- `guidelines/` — foundation specimen cards.

## How to use it
- **Visual artifacts** (decks, mocks, throwaway prototypes): copy the assets and
  CSS/JS you need into your output folder and build **static/standalone HTML** the
  user can open directly. Start from `slides/` for a deck or `ui_kits/launch-site/`
  for a page. Keep the motion system wired so backgrounds and reveals work, and
  always preserve the static fallback (content visible with no JS).
- **Production launch decks:** start from `decks/launch-theatre-full/index.html`
  or rebuild it with `node scripts/build-canonical-deck.mjs`. Default delivery is
  single-file HTML. Ask before producing PPTX/PDF exports or changing the visual
  style. Use the `system-fonts` build for Windows/offline handoff checks.
- **Production code:** read the tokens and rules here, link `styles.css`, and use
  the components to become an expert in designing with this brand.

## Non-negotiables
- One accent only (glacial cyan by default; swap `--accent` to re-theme). No
  decorative gradients — light is optical (glows, sweeps, a slow field).
- Display type thin (200–300), tracked tight; mono for every readout/version/date.
- No emoji. The graphic vocabulary is the accent tick, hairline, and live dot.
- Motion is slow and cinematic — no bounce, spring, or confetti. Respect
  `prefers-reduced-motion` and the **B** static low-power mode.
- Every font stack keeps explicit Windows + Chinese fallbacks.
- Keep product visuals/screenshot moments as the main stage object. Do not reduce
  this to a minimal text-only deck.

If invoked with no other guidance, ask what the user wants to build (a deck? a
launch page? a single key slide?), ask a few sharp questions, then act as an
expert launch designer who outputs HTML artifacts or production code as needed.
