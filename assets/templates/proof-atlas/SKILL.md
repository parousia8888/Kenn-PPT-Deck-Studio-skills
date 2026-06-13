---
name: proof-atlas-design
description: Use this skill to generate well-branded interfaces and assets for Proof Atlas — a premium evidence-report presentation system (intelligence dossier × Swiss information design × research atlas). Use for production work or throwaway prototypes, mocks, slide decks, and evidence reports. Contains design guidelines, colors, type, fonts, the atlas motion system, reusable components, and ten slide layouts.
user-invocable: true
---

Read the `readme.md` file within this skill first. It is the full design guide
and manifest for tokens, slide layouts, motion, canonical deck, single-file
builds, and verification scripts.

If creating visual artifacts (slides, mocks, throwaway prototypes, evidence
reports), copy assets out and create static HTML files for the user to view.
For production deck work, start from `decks/proof-atlas-full/index.html`, not
from an isolated slide file. If working on production code, copy assets and read
the rules here to become an expert in designing with this brand.

Default delivery is single-file HTML. Ask before producing PPTX/PDF exports,
before changing the visual style, or before replacing evidence placeholders
with generated/stock/brand imagery.

Quick map:
- `styles.css` — link this one file to get every token (`tokens/*.css`) and the webfonts.
- `assets/atlas-motion.js` + `assets/atlas-anim.css` — the animated atlas-grid background, semantic slide-enter recipes, reduced-motion + low-power (press **B**) fallback.
- `slides/` — ten ready-to-copy 1280×720 layouts (cover, finding, KPI ledger, timeline, comparison, evidence grid, case study, methodology, risk, next actions). Copy a file, swap the content, keep the chrome.
- `decks/proof-atlas-full/` — the canonical 10-slide navigable deck assembled from every slide layout.
- `dist/proof-atlas-evidence-deck.single.html` — default single-file HTML deliverable with CDN webfonts.
- `dist/proof-atlas-evidence-deck.system-fonts.single.html` — single-file HTML deliverable without external font imports, using Windows-safe fallbacks.
- `scripts/build-canonical-deck.mjs` — rebuilds the canonical full deck from the 10 slide files.
- `scripts/pack-single-html.mjs` — inlines local CSS/JS/assets into one HTML file. Use `--font-mode=online|system`.
- `scripts/verify-deck.mjs` — Playwright/Chrome validation for 10 slides, atlas canvases, horizontal navigation, low-power mode, replay, and content bounds.
- `components/core/` — React primitives (Button, Tag, SourceNote, Metric, EvidenceCell, DataTable, BarChart, RiskMarker, Coordinate). Read each `*.prompt.md` for usage.
- `guidelines/` — foundation specimen cards.

Non-negotiable brand rules: off-white paper + ink text + one technical accent (International Blue); grayscale otherwise; oxide-red only for risk; large light-weight numbers; mono for every label/coordinate/source ID; **every data point carries a source line**; hairline rules, no shadows, near-zero radius; information-first motion.

Build commands:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/proof-atlas-full/index.html --output=dist/proof-atlas-evidence-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/proof-atlas-full/index.html --output=dist/proof-atlas-evidence-deck.system-fonts.single.html --font-mode=system
```

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few focused questions, then act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.
