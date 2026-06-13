---
name: investor-signal-design
description: Generate premium investor pitch decks as interactive 1920x1080 HTML slides using the Investor Signal design system: obsidian keynote pages, off-white evidence pages, one accent color, Windows-safe font stacks, dynamic canvas backgrounds, semantic slide animations, count-up metrics, and low-power B mode. Use for startup fundraising, investor memo, traction, market, product, business model, competitive positioning, team/ask decks. Default output is a pixel-faithful single-file HTML built from the full 10-slide UI kit; ask before producing PPTX/PDF or changing the visual style.
user-invocable: true
---

# Investor Signal — design skill

Read `readme.md` first — it is the full design guide (brand context, content
fundamentals, visual foundations, iconography, motion system, and a file index).
Then explore the other files.

## What's here
- `styles.css` — single entry point; link this to inherit every token + font.
- `tokens/` — colors, typography, spacing, motion, and the base reset + the semantic
  slide-enter animation CSS.
- `motion.js` — the dynamic background + animation + low-power engine (plain JS).
- `components/core/` — React primitives: `Eyebrow`, `KpiStat`, `Badge`, `Button`,
  `Wordmark`, `ProductFrame` (see each `.prompt.md`).
- `ui_kits/pitch-deck/index.html` — the canonical interactive 10-slide investor deck.
- `templates/pitch-deck/PitchDeck.dc.html` — copyable deck starter.
- `scripts/pack-single-html.mjs` — packages the canonical deck into one standalone HTML.
- `scripts/verify-deck.mjs` — Playwright/Chrome visual runtime check for the deck.
- `assets/` — `wordmark.svg`, `mark.svg`.

## How to use it
If you are **creating visual artifacts** (a pitch deck, mock, or throwaway prototype):
copy `styles.css`, `motion.js`, the relevant `tokens/`, and any `assets/` you need
into your output folder, then build static HTML. The fastest start is to copy
`ui_kits/pitch-deck/index.html` and rewrite the slide content — the scaling, nav,
dynamic background, semantic animations, and low-power (press **B**) mode are wired.

For the user's personal PPT skill, prefer this workflow:
1. Treat `ui_kits/pitch-deck/index.html` as the full source template. Do not replace it
   with a minimal implementation.
2. Rewrite only deck content, labels, data, and optional accent color unless the user
   explicitly approves a style change.
3. Preserve the 1920x1080 canvas, safe margins, typography scale, slide chrome, dynamic
   canvas background, semantic `data-anim` recipes, count-up metrics, keyboard navigation,
   and `B` low-power mode.
4. Package the final deck as a standalone HTML:
   `node scripts/pack-single-html.mjs --input=ui_kits/pitch-deck/index.html --output=dist/deck.html`
5. Verify before delivery:
   `NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/verify-deck.mjs --input=dist/deck.html --out=_verify_screens`
6. Ask before creating PPTX/PDF. If PPTX is requested, use the verified HTML as the
   visual source of truth and keep screenshots/layout pixel-faithful.

If you are **working in production code**: copy the assets and treat `readme.md` as
the source of truth to become an expert in the brand — two surfaces (obsidian stage /
off-white evidence), one accent, Manrope display + Inter body + JetBrains Mono metrics,
sharp corners, hairline rules, decisive no-bounce motion.

## Non-negotiables
- One accent per deck; accent marks signal, never decoration.
- One investor question per slide; titles are claims, not topics.
- No emoji, no stock photos, no 3D renders, no cliché startup icons.
- Numbers are loud but truthful, and always carry a mono source label.
- Every font stack keeps its Windows/macOS/Chinese fallbacks.
- No smallest-possible substitute: this system's output must keep the full template,
  motion engine, and visual density unless the user explicitly asks to simplify it.

If invoked without guidance, ask what they want to build (a full raise deck? a single
metric slide? a product page?), ask a few focused questions (audience, stage, accent
color, deck length), then act as an expert designer who outputs HTML artifacts or
production code as needed.
