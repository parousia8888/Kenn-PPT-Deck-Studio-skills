# Course Canvas — Design System

A premium **teaching-deck** visual language for live classes, workshops, and
structured learning modules. Course Canvas turns lessons into clear visual
journeys — concepts, examples, exercises, teacher notes, review moments, and
student-facing summaries — with the calm rigour of a beautifully printed field
manual crossed with a contemporary university studio syllabus.

It is built for three jobs: **premium teaching decks**, **education-brand
brochure presentations**, and **investor pitch decks** that want to feel
crafted and intellectually serious rather than like default slideware.

---

## Sources & provenance

This system was authored from a written art-direction brief — there was **no
attached codebase, Figma file, or prior deck** to reverse-engineer. Everything
here (palette, type, components, slide layouts, motion) is original to Course
Canvas. If a brand kit, real lesson decks, or a product codebase exist
elsewhere, attach them via the Import menu and this guide can be reconciled
against them.

- **Fonts** are loaded from the Google Fonts CDN (see *Font substitution* below)
  so the system renders on Windows; no font binaries are bundled.
- **Logo** (`assets/logomark.svg`, `assets/logo-lockup.svg`) is original.

---

## How this system is organised

| Path | What's there |
|---|---|
| `styles.css` | The single entry point consumers link. `@import` manifest only. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css` — all CSS custom properties + webfont loading. |
| `components/components.css` | Styling for the React primitives (`.ccc-*` classes). Imported by `styles.css`. |
| `components/core/` | `Button`, `Badge`, `Card`. |
| `components/teaching/` | `Callout`, `KeyTerm`, `NumberTab`, `MarginNote`, `StepList`, `RuleHeading`. |
| `slides/` | `deck.css` (the slide-layout language) + 10 ready slide layouts + `cc-bg.js` (animated paper) + `cc-motion.js` (reveal recipes). |
| `decks/course-canvas-full/` | The canonical 10-slide deck assembled from every layout in `slides/`. This is the production starting point. |
| `decks/normal-distribution/` | A live, navigable sample lesson that demonstrates the motion grammar end-to-end. |
| `dist/` | Verified single-file HTML builds: online webfont mode and system-font fallback mode. |
| `scripts/` | Rebuild, single-file pack, and Playwright verification scripts. |
| `guidelines/` | Foundation specimen cards (Type / Colors / Spacing / Brand). |
| `assets/` | Logo SVGs. |
| `SKILL.md` | Makes this folder usable as a downloadable Agent Skill. |

> The compiler generates `_ds_bundle.js`, `_ds_manifest.json`, and
> `_adherence.oxlintrc.json`. Never edit those by hand.

---

## CONTENT FUNDAMENTALS — how Course Canvas writes

The voice is a **calm, expert teacher** — warm but precise, never breezy or
salesy. Copy should sound like it was written by someone who has taught the
material many times and respects the learner.

- **Person.** Address the student directly as **"you"** for objectives,
  exercises, and recaps ("By the end, you'll be able to…", "Try it on your
  own"). Speak about the teacher in the third person inside **teaching cues**
  ("Circulate while they work"). Avoid "we" except for shared classroom moments
  ("before we meet again").
- **Casing.** Sentence case for all headings and body. **Mono labels are
  UPPERCASE** with wide tracking (`LEARNING OBJECTIVES`, `DEFINITION · n.`,
  `DUE WED`). Never title-case headings.
- **Tone.** Plain, declarative, generous. Prefer verbs of cognition —
  *describe, apply, convert, decide, notice, predict*. Each objective starts
  with one. Explanations name the idea, then say it again in plain words.
- **Numbers & rigour.** Use real notation (μ, σ, z, §6.1) set in the mono
  layer. Lessons, steps, and definitions are numbered (`04`, `M2`, `D1`,
  `01–04`) — numbering is part of the identity, not decoration.
- **Punctuation.** Curly quotes, en-dashes for ranges (68–95–99.7), em-dashes
  for asides. "Normal enough" gets quotation marks because it's a judgement
  call, not a fact.
- **Length.** Dense slides are allowed, but every line earns its place. A
  margin note is one or two sentences; a callout is a single thought.
- **Emoji.** Never. Iconography is mono glyphs and thin marks (see below).

Specimen copy lives across the ten slide layouts in `slides/` — read them as the
canonical tone reference.

---

## VISUAL FOUNDATIONS

**Canvas.** A warm **bone paper** (`#F3EDE1`), never pure white, carrying a
barely-there fibre grain. Cards and callouts sit on a slightly lighter sheet
(`#FBF7EE`); wells and table zebra use a sunken tone (`#E9E1D1`). Every slide
draws a thin keyline 22px inside its edge, like a printed page plate.

**Colour logic.** Ink and warm graphite carry all text. The accent trio is
disciplined and always purposeful:
- **Oxblood** (`#8A2D22`) — the primary academic accent: chapter rules,
  section numbers, key emphasis, primary buttons, the notebook's red margin
  line.
- **Chalk sage** (`#5E7257`) — the secondary: correctness, worked examples,
  the exercise rhythm, "in plain words".
- **Pale straw** (`#E7CD80`) — **highlight only**: the highlighter swipe behind
  a key term, a worked-result emphasis. Never a fill or a background.
- **Blackboard** (`#2A322B`) — a dark sage-charcoal surface for micro-diagrams
  and formulas, with chalk-toned text. No bright/rainbow colour anywhere.

**Type.** Three voices. An editorial **serif display** (Newsreader) for chapter
and slide titles, with italics used for subtitles and emphasis. A highly legible
**sans** (Inter) for all teaching body. A quiet **mono** (JetBrains Mono) for
lesson numbers, time markers, formulas, definitions, and metadata. The deck type
floor is **22px** (never smaller on a 1280×720 slide).

**Backgrounds.** Flat warm paper + a faint animated grain/ruled-line layer
(canvas 2D). No photographic heroes, no gradients, no glass, no blobs. Imagery,
when present, is a **diagram** (bell curve, knowledge tree, micro-chart) — drawn
with thin ink rules and restrained sage/straw fills, never a stock photo or a
decorative illustration.

**Borders & rules.** Identity comes from line, not shadow: hairline rules
(`#D9D0BE`), a 2px ink rule under chapter titles, a 56px oxblood "mark" above a
heading, dashed sage frames for exercises, annotation brackets, and a thin
keyline around every sheet.

**Corners.** Small only — 2/4/6px. Pills (`999px`) are reserved for numbered
tabs and chips. Nothing is "over-rounded".

**Shadows.** Warm, low, paper-on-desk (`--shadow-card`, `--shadow-raised`).
The blackboard gets a soft inset to read as a recessed board. Shadows are
support, never the headline.

**Hover / press.** Calm. Buttons darken to the deep tone on hover (oxblood →
oxblood-deep), secondary fills with ink, ghost fills with sunken paper. Press
nudges 1px down (`translateY(1px)`) — no shrink, no bounce. Focus shows a 2px
oxblood ring offset on paper.

**Motion.** A teacher drawing on paper. Slow, calm, never flashy. The animated
background is most present on cover / divider / recap slides and nearly
invisible on dense teaching slides (set per slide via `data-bg`). Reveal
recipes (in `cc-motion.js`) underline terms, draw connector lines, highlight
the current step, and hold an exercise answer back until asked. Easing is
`--ease-paper` (settle, no overshoot); reveals are gated on `[data-deck-active]`
and `prefers-reduced-motion` so print and PDF show the finished slide. Press
`B` to toggle low-power/static mode, which pauses background canvases and
forces final reveal states for weaker machines or recording workflows.

**Transparency & blur.** Essentially none — tints are solid, opaque washes
(`--oxblood-tint`, `--sage-tint`). No frosted glass.

---

## ICONOGRAPHY

Course Canvas is deliberately **near-iconless**. Meaning is carried by
typography, numbering, and thin drawn marks rather than a glyph set:

- **Mono glyphs** do most icon work: `×` / `✓` (wrong/right), `→`, `·`, `§`,
  `!`, leading-zero numerals. They live in the mono layer and inherit accent
  colour.
- **Drawn marks**: rule lines, the oxblood "mark", annotation brackets,
  margin ticks, dots, and the connector lines in diagrams — all CSS/SVG
  hairlines, not an icon font.
- **Diagrams over illustration**: bell curves, knowledge trees, and
  blackboard micro-diagrams are the only "imagery". Drawn with thin strokes
  and restrained fills.
- **No emoji, ever.** No coloured icon sets.

**If you need a UI icon set** (e.g. inside an app surface), there is no bundled
icon font. Use **Lucide** from CDN at a **1.75px stroke**, coloured ink or
oxblood, to match the thin-rule aesthetic — *this is a suggested substitution,
not an existing brand asset; confirm before shipping.* Keep icons sparse.

---

## Font substitution — please confirm

No font files were provided, so all faces load from **Google Fonts (CDN)** with
explicit Windows fallback stacks (`tokens/typography.css`):

| Role | Primary (CDN) | Windows / fallback |
|---|---|---|
| Display / editorial serif | **Newsreader** | Noto Serif SC · SimSun · Georgia |
| Teaching sans | **Inter** | Segoe UI · Microsoft YaHei UI · Noto Sans SC · Arial |
| Mono | **JetBrains Mono** | Cascadia Code · Consolas · Courier New |
| Chinese serif | **Noto Serif SC** | Source Han Serif SC · SimSun · Georgia |
| Chinese sans | **Noto Sans SC** | Microsoft YaHei UI · Microsoft YaHei |

Chinese text never depends on macOS-only fonts (no PingFang, Hiragino, Songti,
Kaiti). **If you have licensed brand fonts, send the files** and I'll swap them
in behind the same tokens.

---

## Index / manifest

- **Foundations** — `guidelines/*.card.html` (Type, Colors, Spacing, Brand specimen cards).
- **Components** — `components/core/{Button,Badge,Card}`, `components/teaching/{Callout,KeyTerm,NumberTab,MarginNote,StepList,RuleHeading}` (each with `.jsx` + `.d.ts` + `.prompt.md`; group cards in each folder).
- **Slide layouts** — `slides/01..10-*.html`: Course cover · Learning objectives · Concept definition · Knowledge map · Step-by-step · Case breakdown · In-class exercise · Common mistakes · Recap/handout · Homework/next.
- **Motion** — `slides/cc-bg.js` (animated paper background), `slides/cc-motion.js` (reveal recipes), `slides/deck.css` (layout + motion CSS).
- **Canonical full deck** — `decks/course-canvas-full/index.html` (10 slides, navigable, motion on, no thumbnail rail).
- **Sample deck** — `decks/normal-distribution/index.html` (6-slide live sample only; do not treat it as the full kit).
- **Single-file deliverables** — `dist/course-canvas-teaching-deck.single.html` and `dist/course-canvas-teaching-deck.system-fonts.single.html`.
- **Build scripts** — `scripts/build-canonical-deck.mjs`, `scripts/pack-single-html.mjs`, `scripts/verify-deck.mjs`.
- **Brand** — `assets/logomark.svg`, `assets/logo-lockup.svg`.
- **SKILL.md** — Agent-Skill manifest.

### Building a new deck
Start from `decks/course-canvas-full/index.html` for production work. It is
assembled from all ten slide files in `slides/` and preserves each layout's
local CSS. Use the 6-slide `decks/normal-distribution/` only as a motion
reference.

Rebuild and package:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/course-canvas-full/index.html --output=dist/course-canvas-teaching-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/course-canvas-full/index.html --output=dist/course-canvas-teaching-deck.system-fonts.single.html --font-mode=system
```

Verify in Chrome/Playwright:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/verify-deck.mjs --input=dist/course-canvas-teaching-deck.single.html --out=_verify_single
```

Default delivery is the single-file HTML deck. Ask before producing PPTX/PDF
exports or changing the visual style. The `system` font mode removes external
Google Fonts imports and relies on the Windows-safe fallback stacks.
