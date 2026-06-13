---
name: academy-prospectus-design
description: Use this skill to generate well-branded interfaces and assets for Academy Prospectus — a premium, brochure-style presentation system for schools, academies, training centres and learning brands — either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, motion system, slide layouts, and reusable components for prospectus-style work.
user-invocable: true
---

Read the `readme.md` file within this skill first. It is the full design guide
and manifest for the available tokens, slide layouts, motion system, canonical
deck, single-file builds, and verification scripts.

If creating visual artifacts (slides, prospectus decks, mocks, throwaway
prototypes, etc), copy assets out and create static HTML files for the user to
view. For production deck work, start from
`decks/academy-prospectus-full/index.html`, not from a reduced sample. The
original UI-kit template remains in `templates/prospectus-deck/index.html`;
the canonical deck preserves its full 10-slide DOM but removes unused React /
`ds-base.js` runtime dependencies.

Default delivery is single-file HTML. Ask before producing PPTX/PDF exports,
before changing the visual style, or before replacing the intentional image
placeholders with generated/stock/brand photography.

Key things to honour:
- **Tone:** warm, intelligent, credible — never hype, never childish, no emoji. Sentence case; UPPERCASE only for tracked mono metadata (course codes, age groups, durations).
- **Colour as section identity:** parchment base, charcoal text, one muted accent per chapter via `data-accent="terracotta|forest|navy|gold"`.
- **Type:** Spectral (display serif), Source Sans 3 (body), JetBrains Mono (metadata) — always with the Windows + CJK fallback stacks defined in `tokens/typography.css`.
- **Motion:** gentle, page-like; semantic per-slide entrances via `data-anim`; resting state is always the finished design; **B** toggles static low-power mode.
- **Imagery:** documentary, warm, editorial; tight 4px corners. Use the `.img-ph` placeholder until real photography is supplied.
- **Stats must be sourced and honest.** Pricing, outcomes and claims always carry a methodology line.
- **Single-file packaging:** use `scripts/pack-single-html.mjs` with
  `--font-mode=online` for the default deck and `--font-mode=system` for an
  offline/Windows-safe fallback build.
- **Verification:** run `scripts/verify-deck.mjs` after changes. It checks the
  10-slide deck, viewport fit, paper-light background, semantic animation
  recipes, `B` low-power mode, `R` replay, and content staying inside slide
  bounds.

Build commands:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/academy-prospectus-full/index.html --output=dist/academy-prospectus-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/academy-prospectus-full/index.html --output=dist/academy-prospectus-deck.system-fonts.single.html --font-mode=system
```

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few focused questions (institution, audience, which of the ten layouts, real copy/figures/photography), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
