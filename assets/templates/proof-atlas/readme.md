# Proof Atlas — Design System

**Proof Atlas** is a premium evidence-report presentation system. It converts raw
facts — results, data, case studies, learning outcomes, strategic reviews — into
*structured proof*: timelines, comparisons, metrics, maps, ledgers, and case
evidence. The deliverable is a controlled evidence system, not a dashboard.

The art direction is an **intelligence dossier × Swiss information design × high-end
research atlas**: precise, factual, structured, visually distinctive. It supports
dense information without becoming cluttered, and it builds trust through order, not
decoration.

> **Sources.** This system was authored from a written brand brief; there is no
> upstream codebase or Figma file. If a brand repo or Figma library exists, link it
> here so future contributors can reconcile against source.

---

## Index / Manifest

Root files
- `styles.css` — global entry point (import manifest only — link this one file).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`.
- `assets/atlas-motion.js` — motion engine (animated background, reveal controller, low-power B toggle).
- `assets/atlas-anim.css` — semantic slide-enter recipes + static fallback.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Motion, Brand).
- `components/` — reusable React primitives (see below).
- `slides/` — the ten reusable evidence-report slide layouts.
- `decks/proof-atlas-full/` — the canonical 10-slide horizontal deck assembled from every slide layout.
- `dist/` — verified single-file HTML builds: online webfont mode and system-font fallback mode.
- `scripts/` — rebuild, single-file pack, and Playwright verification scripts.
- `SKILL.md` — Agent-Skill manifest for downloadable use.

Components (`components/core/`)
- `Button` · `Tag` · `SourceNote` · `Metric` · `EvidenceCell` · `DataTable` · `BarChart` · `RiskMarker` · `Coordinate`

Slide layouts (`slides/`)
1. Report cover · 2. Executive finding · 3. KPI ledger · 4. Timeline · 5. Before/after comparison · 6. Evidence grid · 7. Case study · 8. Methodology · 9. Risk / limitation · 10. Next actions

---

## CONTENT FUNDAMENTALS

**Voice.** Factual, declarative, restrained. Proof Atlas reports findings — it does
not sell them. Sentences are short and lead with the claim, then qualify it with a
source. The reader should feel they are reading an audited record.

- **Person.** Third-person and impersonal in the evidence itself ("Throughput rose
  2.4×"). First-person plural only in methodology and recommendations ("We reviewed
  412 cases"). Never "you."
- **Casing.** Sentence case for headlines and body. **UPPERCASE + mono** for
  structural labels only — section tags, coordinates, source IDs, table headers,
  timestamps. Never uppercase a full sentence.
- **Numbers.** Large, light-weight, and always sourced. A number without a source
  slot is incomplete. Use a thin space or `·` as separators, units set smaller and
  in gray (`84.2%`, `2.4×`, `n=412`).
- **Source lines.** Every data point gets one: `Source · <method> · <id>`. Phrased
  as provenance, not citation prose.
- **Tone words.** verified · corroborated · observed · estimated · projected. Hedge
  honestly — "estimated" and "projected" are first-class, not weaknesses.
- **Emoji.** Never. **Decorative icons.** Avoid. The only marks are structural:
  crosshair, tick, rule, coordinate.
- **Examples.**
  - Section tag: `FINDING 03` · `METHODOLOGY` · `LIMITATIONS`
  - Headline: "Adoption outpaced the forecast in every region."
  - Source: `Source · internal telemetry · SRC-2087` · `Source · audit panel · n=412`

---

## VISUAL FOUNDATIONS

**Color.** Off-white paper base (`--paper-0 #F4F2EC`), ink-black text
(`--ink #17150F`), and exactly **one** technical accent — **International Blue**
(`--blue #1A36C4`). Everything else is a neutral grayscale ramp. A single restrained
**oxide-red** (`--oxide #9C3A2B`) is reserved for risk/limitation semantics and
negative deltas; **research-green** (`--green #2E6B4F`) for confirmed positive
deltas only. No other hues. No gradients as fills (the only gradient anywhere is the
near-invisible scan band in the background canvas).

**Type.** Display = **Manrope** at weight 200–300 for large numerals and titles
(the light-weight big number is the signature). Body = **Inter**, compact and highly
legible (16/14px). Mono = **JetBrains Mono** for every label, coordinate, source ID,
timestamp, and table header (uppercase, 0.14em tracking). All stacks carry explicit
Windows + CJK fallbacks (see `tokens/typography.css`).

**Spacing & grid.** 8px base unit. The atlas grid is the spine: a coordinate gutter,
modular evidence cells, and 56px page margins on the 1280×720 reference frame.

**Backgrounds.** A subtle animated **atlas-grid canvas field** — faint coordinate
lines, major-node ticks, sparse pulsing measurement marks, and a slow 14s scanning
band. Visible on covers and chapter pages, quieter (`data-atlas-bg="quiet"`) on
data-heavy pages. Never imagery, never texture-noise, never gradient washes.

**Borders & depth.** Depth comes from **hairline rules and paper tone only** — never
shadows. Three rule weights: faint (`gray-5`), hair (`gray-4`, default), strong (ink
2px). Corner radii are near-zero: `0` for evidence cells, `2px` for chips/controls.

**Cards.** "Evidence cells" — squared, paper-pure fill, 1px hairline border, a mono
header row (ID + coordinate) and a mono source-note footer. No rounding beyond 2px,
no shadow, no colored left-border accent.

**Hover / press.** Restrained. Hover = accent border or +1 step paper tone, never a
color wash. Press = `--blue-deep` fill or a 1px inset, never a scale-down bounce.
Focus = 2px accent outline offset 2px.

**Imagery.** Evidence images sit in consistent bordered slots with a mono caption and
source line. Treatment leans neutral/archival — desaturated, even, document-like —
never warm glossy stock. Use real images in fixed slots; never invent decorative art.

**Motion.** Information-first and semantic. Bars grow, axes and timelines draw,
evidence cells appear in scanline order, source notes always fade in **last**. Easing
is controlled (`--e-out`, `--e-lock` for titles "locking in") — never bouncy. Each
slide type has its own recipe (see `assets/atlas-anim.css`). Respects
`prefers-reduced-motion` and a manual low-power mode (**press B**).

---

## ICONOGRAPHY

Proof Atlas is **near-iconless by design**. It does not use an icon font, emoji, or a
decorative pictogram set. Meaning is carried by typography, rules, and a small family
of **structural marks** drawn in CSS:

- **Registration crosshair** — the brand mark and "located evidence" motif.
- **Tick** — coordinate nodes and measurement marks (from the background field).
- **Rule** — the primary divider and table structure.
- **Dot / square bullet** — the lead glyph on source notes and risk markers.

When a true UI icon is genuinely required (rare — e.g. an external-link or download
affordance in a kit), use **Lucide** (`https://unpkg.com/lucide@latest`) at 1.5px
stroke, ink or gray, sized to the mono cap-height. This is a *substitution* flagged
for review — the system ships no icon assets of its own. No PNG icons, no Unicode
dingbats as icons.

---

## How consumers use this system

Link the one stylesheet, then read components off the compiled bundle:

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="assets/atlas-anim.css">
<script src="_ds_bundle.js"></script>      <!-- generated -->
<script src="assets/atlas-motion.js"></script>
```

Build a slide as an `.atlas-stage` with a `data-atlas-bg` field and `data-anim`
recipes on its blocks; the motion engine sequences entry and handles the B toggle.

### Building a full deck

Start from `decks/proof-atlas-full/index.html` for production deck work. It
preserves all ten slide layouts, keeps the atlas-grid animated background, and
adds horizontal keyboard navigation.

Default delivery is single-file HTML. Ask before producing PPTX/PDF exports or
changing the visual style.

Rebuild and package:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/proof-atlas-full/index.html --output=dist/proof-atlas-evidence-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/proof-atlas-full/index.html --output=dist/proof-atlas-evidence-deck.system-fonts.single.html --font-mode=system
```

Verify in Chrome/Playwright:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/verify-deck.mjs --input=dist/proof-atlas-evidence-deck.single.html --out=_verify_single
```

The `system` font mode removes Google Fonts imports and relies on Windows-safe
fallback stacks (`Segoe UI`, `Microsoft YaHei UI`, `Microsoft YaHei`,
`Cascadia Code`, `Consolas`, Arial).
