# Investor Signal — Design System

A premium pitch-deck design system for early-stage products, AI startups, and
founder-led fundraising. It makes a company feel **sharp, investable, data-aware,
and visually confident** — a private investment memo transformed into a cinematic
founder keynote.

> Designed from a written art-direction brief (no external codebase or Figma).
> If you later attach a product codebase or Figma file, fold its real components
> into the UI kit and reconcile tokens here.

**Compiler entry point:** `styles.css` (import manifest only).
**Runtime namespace:** `window.InvestorSignalDesignSystem_258ec8`.
**Canonical deck source:** `ui_kits/pitch-deck/index.html`.
**Standalone output:** `scripts/pack-single-html.mjs` packages the canonical deck
into one HTML file without reducing the template.

---

## 1 · Brand context

Investor Signal prices **private risk in real time** — a continuous, auditable mark
for illiquid positions, so capital stops waiting on quarterly PDFs. The brand voice
is that of a decisive operator presenting to a partner meeting: evidence-led, quiet,
expensive. Two surfaces carry the whole system:

- **Stage** — near-black obsidian keynote. Big claims, single accent, dynamic background.
- **Evidence** — off-white memo pages. Crisp data, hairline rules, mono annotations.

One **accent per deck** marks traction, insight, or urgency — never decoration.
Default is Electric Vermilion; Cobalt and Acid Chartreuse are alternates.

---

## 2 · Content fundamentals (copywriting)

How copy is written across slides and UI:

- **Voice:** first-person plural for the company ("We price private risk"), second
  person sparingly when addressing the investor's question. Confident, never hype.
- **One slide = one investor question.** Each slide footer literally states the
  question it answers ("— Investor question: why now?"). Titles are claims, not topics.
  - Topic (avoid): "Market Opportunity"
  - Claim (use): "A wedge into a structurally large market."
- **Casing:** Sentence case for claims and body. **UPPERCASE mono** for eyebrows,
  source labels, KPI captions, and page numbers (tracked +0.14em).
- **Numbers are nouns.** Lead with the figure, label it in mono underneath. Numbers
  are loud but truthful — never inflated. Show the source line.
- **Tone words:** "mark", "signal", "evidence", "audited", "defensible", "continuous".
  Avoid: "revolutionary", "disrupt", "synergy", "world-class".
- **No emoji. No exclamation marks.** Punctuation is full stops. Restraint reads as
  credibility.
- **Source attribution is always present** on data pages, in mono micro type
  ("Source: company data, audited · FY24"). Even illustrative data is labelled.

---

## 3 · Visual foundations

**Color.** Obsidian stage (`#08090B` base → `#181C22` cards) vs warm off-white
evidence (`#F6F6F2` page → `#FFFFFF` panels). Text is white / ink-black / cool gray.
A single accent token (`--accent`, default vermilion `#FB3B1E`) is the only chroma;
swap the whole deck's accent with `[data-accent="cobalt"|"chartreuse"]`. Switch
surface with `[data-mode="evidence"]`.

**Type.** Display is **Manrope 800** (architectural grotesk) — ultra-large for claims,
tracked tight (-0.03em), line-height 0.96. Condensed alt is **Archivo**. Body is
**Inter** 400–500, compact, investor-readable. **JetBrains Mono** carries every
metric, date, source label, and annotation. Full Windows/macOS/Chinese fallbacks
on every stack (see `tokens/typography.css`).

**Spacing & layout.** 8px base scale. Slides are a fixed 1920×1080 canvas with a
120px safe margin, scaled to viewport. Disciplined columns, generous vertical air,
hairline rules to separate data — Swiss financial report logic.

**Corners & borders.** Sharp. Default control radius is 2px; the only 8px radius is
the product frame. Separation is done with **1px hairline rules** (`--hairline`), not
boxes. Cards are flat with a hairline border, not drop-shadowed — except the one
premium product frame.

**Shadow.** Exactly one controlled shadow exists, `--shadow-frame`, reserved for the
product screenshot frame (deep, soft, no cheap offset). Everything else is flat.

**Imagery.** No stock photos, no 3D renders, no rocket/cliché icons. "Imagery" is
data made beautiful: charts, matrices, concept maps, terminal mockups. Product shots
go in `ProductFrame` (large, controlled, one shadow). Cool, precise, high-contrast.

**Motion.** Stage pacing — thesis first, evidence follows. Easing is decisive with a
long settle (`--ease-stage` cubic-bezier(0.16,1,0.3,1)), **no bounce, no playful
motion**. Each slide type has a *semantic* enter recipe (see §5). A subtle canvas
"market grid" drifts behind stage slides. Numbers count up. Product screenshots
reveal under a mask.

**Hover / press.** Buttons nudge **down 1px** on press (no scale-up, no glow). Hover
on chrome shifts a border to accent. Quiet, mechanical, premium.

**Transparency / blur.** Used only for floating chrome (nav controls) — a 6px blur
over a 70% obsidian fill. Content surfaces are opaque.

---

## 4 · Iconography

This system is deliberately **icon-light** — investor decks earn trust through type,
number, and rule, not decoration. Approach:

- **No icon set is bundled.** Avoid generic startup iconography entirely (no rockets,
  lightbulbs, gears, smiling teams).
- **Functional glyphs only**, drawn from JetBrains Mono / Unicode: `▲ ▼` for deltas,
  `‹ ›` for navigation, `·` as a separator, `→` for flow. These inherit `--accent`
  when they mark signal.
- **The brand mark** (`assets/mark.svg`, `assets/wordmark.svg`, and the `Wordmark`
  component) is the one bespoke vector: a sharp square frame with an ascending accent
  tick — a price line breaking upward.
- **No emoji, ever.** If a future product surface needs a UI icon set, add Lucide via
  CDN (1.5px stroke matches this system) and document it here — do not hand-roll SVGs.

---

## 5 · Motion & background system

Implemented in plain HTML/CSS/JS in `motion.js` + the recipe CSS in `tokens/base.css`.
Works in any standalone browser file.

- **Dynamic background:** per-slide `<canvas class="is-bg-canvas">`, a subtle drifting
  "market grid" with occasional accent ticker nodes. Theme-aware (reads `--accent` and
  light/dark surface). Only the active slide's canvas animates.
- **Semantic slide-enter:** declare a recipe with `data-anim` on a block —
  `rise`, `mask-up`, `mask-left`, `push`, `screen` (product reveal), `underline`,
  `cell` (evidence sequence), `node` (concept-map reveal), `draw` (timeline),
  `grow` (chart). Order with `data-anim-order`. The visible end-state is the base
  style; elements animate *from* hidden only when the slide is active and motion is
  allowed → **static fallback is automatic**.
- **KPI count-up:** `data-count="4.2" data-count-suf="M" data-count-dec="1"`.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all reveals and the
  background; content shows fully.
- **Low-power mode:** press **B** to toggle `body.low-power` — stops every rAF loop,
  cancels animations, snaps all content to final state, shows a "Static mode" hint.

API: `InvestorSignal.init()` then `InvestorSignal.activate(slideEl)` on each nav.

---

## 6 · Index / manifest

**Root**
- `styles.css` — import manifest (link this).
- `motion.js` — background + animation engine.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front matter for Claude Code.
- `scripts/pack-single-html.mjs` — inline CSS/JS/assets into a standalone HTML deck.
- `scripts/verify-deck.mjs` — Chrome/Playwright runtime validation and screenshots.

**Tokens** (`tokens/`)
- `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `motion.css` · `base.css`

**Components** (`components/core/`) — `window.InvestorSignalDesignSystem_258ec8`
- `Eyebrow` · `KpiStat` · `Badge` · `Button` · `Wordmark` · `ProductFrame`
  (each with `.d.ts`, `.prompt.md`; demo in `core.card.html`)

**UI kit** (`ui_kits/pitch-deck/`)
- `index.html` — the full interactive 10-slide investor deck (the canonical specimen).

**Templates** (`templates/pitch-deck/`)
- `PitchDeck.dc.html` — copyable Design-Component deck starter.

**Foundation cards** (`guidelines/`) — populate the Design System tab (Colors, Type,
Spacing, Motion).

**Assets** (`assets/`)
- `wordmark.svg` · `mark.svg`

---

## 7 · Packaging & QA

The full 10-slide UI kit is the source of truth. Do not replace it with a minimal
HTML mock when producing decks from this system.

Package a single-file HTML deck:

```bash
node scripts/pack-single-html.mjs \
  --input=ui_kits/pitch-deck/index.html \
  --output=dist/investor-signal-pitch-deck.single.html
```

Use `--font-mode=online` by default to preserve the authored Google Font look. Use
`--font-mode=system` only when the output must avoid all external network font calls;
the Windows-safe fallback stacks remain in place.

Verify source or packaged HTML:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
node scripts/verify-deck.mjs \
  --input=dist/investor-signal-pitch-deck.single.html \
  --out=_verify_single
```

The verifier checks 10 slides, 10 background canvases, exactly 10 background engine
instances, keyboard navigation, nonblank text, fitted 16:9 canvas, low-power `B`
mode, and browser errors/warnings.

---

## 8 · The ten investor layouts

One reusable layout per investor question (all in the UI kit deck):
1. **Thesis** — one-line company claim · 2. **Problem** · 3. **Why now** (timeline) ·
4. **Solution** (3-pillar) · 5. **Product** (framed demo) · 6. **Market** (TAM/SAM/SOM
map) · 7. **Business model** (pricing) · 8. **Traction** (dominant KPI) ·
9. **Competitive positioning** (2×2 matrix) · 10. **Team / Ask / Milestone**.

Default deck length: 10–12 slides.
