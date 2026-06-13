# Launch Theatre — Design System

**Launch Theatre** is a cinematic product-launch presentation system for premium
product announcements, AI demos, public keynotes, and founder-led launch events.
It turns product stories into dramatic visual sequences — with restraint and
clarity. The medium is a black keynote stage with controlled light; the goal is a
**launch moment, not a report**.

> Design this like a premium keynote stage, a film title sequence, and a hardware
> product launch combined: dramatic, minimal, polished, unmistakably high-end.

**Sources.** This system was authored from a written art-direction brief — there is
no external codebase or Figma file. All visuals, tokens, motion, and components
here are original to Launch Theatre. The sample product narrative ("LT-9 Aurora,"
an on-device model) is illustrative fixture content, not a real product.

---

## CONTENT FUNDAMENTALS

How Launch Theatre writes. Copy is the script for a stage moment — it is spoken,
not skimmed.

- **One idea per slide.** Every screen carries a single thought. If a sentence can
  be cut, cut it. Negative space says the rest.
- **Voice: confident, declarative, present tense.** "The product is the light."
  "We removed everything else." "Measured, not claimed." Short sentences. Full
  stops as punctuation *and* as drama.
- **Second person sparingly, first person plural for the makers.** "Watch it
  think." (you) · "So we removed everything else." (we). Never corporate "we are
  excited to announce."
- **No hype words.** Avoid "revolutionary," "game-changing," "seamless,"
  "cutting-edge," "unlock," "delight." Let the number or the product carry the
  claim. Prefer "40ms" over "blazing fast."
- **Mono carries the facts.** Model name, version, date, latency, benchmark labels
  always sit in mono, upper-case, widely tracked — the keynote metadata voice:
  `MODEL · LT-9 AURORA` · `v2.0` · `06 / 13 / 2026`.
- **Casing.** Display copy is sentence case ("Three things, done completely.").
  Labels, kickers, and metadata are UPPERCASE with wide tracking. Never title-case
  headlines.
- **Numbers are theatrical.** A benchmark is a reveal: one big numeral, a mono
  unit, a tracked label. "2.4×". "98.7%". "0 leaks." Count them up on stage.
- **Punctuation as device.** A single period (`Aurora.`), an em-dash kicker
  (`— The shift`), a slash in metadata (`04 / 10`). Used precisely, never
  decoratively.
- **No emoji. Ever.** The brand vocabulary is the accent tick, the hairline, the
  glowing dot — not emoji, not stock icons.
- **Tone check:** if a line sounds like a press release or a feature spreadsheet,
  rewrite it until it sounds like something a founder would say into a microphone
  on a dark stage.

---

## VISUAL FOUNDATIONS

### Color — a black stage with one light
- **Base:** deep blacks (`--stage-0..3`, near-black `#060709` is the default
  background), graphite for structure and surfaces (`--graphite-1..4`), and
  **soft white** (`#E9ECEF`) for type. Pure white (`#FFFFFF`) is reserved for a
  single peak emphasis — never body text.
- **Accent:** exactly **one luminous color — glacial cyan `#3BE0E6`** (`--signal`).
  It appears only for reveals, progress, focus, and key product moments. A deck
  uses one accent, period. Alternates (signal orange, laser green, titanium blue)
  are provided to re-theme a launch by swapping `--accent`; never mix two.
- **No decorative gradients.** No SaaS gradient blobs, no purple AI haze. Light is
  *optical*: glows around the accent, a slow light-falloff field, a lens ring, a
  sweep across a product. If it looks like a CSS gradient background, it's wrong.

### Typography — type as a stage instrument
- **Display:** Manrope, weights **200–300** (thin to light). Stage-sized
  (88–200px), tracked tight (`-0.03 to -0.05em`), line-height ~0.9.
- **Body:** Hanken Grotesk, 400, small and precise (17px), secondary in tone,
  short measure.
- **Mono:** JetBrains Mono — every technical readout, version, date, model name,
  benchmark label. Upper-case, tracked `0.22em`.
- All stacks carry explicit **Windows + Chinese fallbacks** (Segoe UI / Microsoft
  YaHei UI / Noto Sans SC). The deck stays readable if the webfont fails.

### Space — negative space is a material
- 4px base scale, but used **generously**. Stage safe-margins are wide (96px
  vertical, 128px horizontal). One idea sits alone, framed by the void. Density is
  low-to-medium by default.

### Surfaces, borders, light
- **Mostly hard edges.** Radii are small (0–8px); only large product frames soften
  to 14px. No rounded "cards." The only card-like surfaces are product-UI reveals
  (the console, architecture layers).
- **Borders are hairlines:** `rgba(255,255,255,0.08)` default, `0.16` strong, an
  accent hairline for focus. They structure the stage quietly.
- **Elevation is optical, not drop-shadow.** Product objects use a deep, soft lift
  (`--lift-product`) plus a faint inner light. The accent's behaviour is *glow*
  (`--glow-signal/soft/spark`), never a coloured box-shadow card.
- **Protection scrims** (`--scrim-bottom/edge`) sit over full-bleed product imagery
  so type stays legible — a cinematic bottom fade and edge vignette, not a flat
  overlay.

### Imagery
- Full-bleed product visuals and screenshots are the **main stage objects**. Cool,
  controlled, slightly desaturated; black backgrounds; light spills from one side.
  No warm stock photography, no lifestyle shots, no busy collage.

### Motion — cinematic but restrained
- **Easing:** slow settle (`--ease-stage`), mask wipe (`--ease-mask`), light sweep
  (`--ease-light`). **No bounce, no overshoot, no spring, no confetti.**
- **Durations are long:** reveals 1200ms, cover/sweep 1800ms. Timing *is* the drama.
- **Reveals are semantic** — see the motion section below. Each slide type has its
  own recipe; nothing uses a generic fade-up.
- **Hover:** accent outline gains a soft glow; ghost buttons lift text from
  secondary to primary; never a colour-flip. **Press:** a 1px downward nudge, no
  scale-bounce.
- **Background:** a dark optical WebGL field (slow light falloff, fine volumetric
  haze, a faint lens ring) that reacts lightly to the pointer like stage light
  shifting. Strongest on cover, product reveal, and closing. Degrades to a Canvas-2D
  drifting-light field, then to flat black.

### The motion system (how to drive it)
Load `motion/launch-theatre.css` + `motion/launch-theatre.js`.
- **Background:** put `data-lt-bg` on `<body>` for a full-page fixed field, or
  `data-lt-field` on any element for a contained field (used inside deck slides,
  since the deck covers the page background).
- **Reveals:** tag blocks with `data-anim="<recipe>"`. Recipes: `cover-title`,
  `meta`, `tension`, `product`, `feature` (+ `.lt-feature__line`), `step`,
  `before`/`divider`/`after`, `layer`/`connector`, `bar`/`num`, `closing`, `rise`.
  Stagger with `style="--i:N"`. Number count-ups: `data-anim="num"` +
  `data-count-to`/`-decimals`/`-prefix`/`-suffix`.
- **Intensity:** per-slide `data-bg="strong|base|dim"` lerps the field strength
  (use `strong` on cover / reveal / closing).
- **Triggers:** reveals fire when an ancestor has `[data-deck-active]` (deck-stage
  sets this) or `.lt-on` (standalone via `[data-anim-root]` + IntersectionObserver).
- **Low-power:** press **B** to toggle `body.low-power` — RAF loops stop, every
  reveal snaps to its final static state, a small hint shows. Also fully respects
  `prefers-reduced-motion`. **Static fallback is the base case: if JS never runs,
  all content is visible.**

---

## ICONOGRAPHY

Launch Theatre is **deliberately near-iconless**. The brand's graphic vocabulary is
a tiny set of precise optical devices, not an icon library:

- **The accent tick** — a short glowing horizontal rule (`--glow-spark`) before a
  kicker or wordmark. The signature mark.
- **The live dot** — a small accent circle with a glow, for LIVE / READY status.
- **Hairlines & rules** — structure, dividers, the feature line-draw, the benchmark
  track. These *are* the iconography.
- **No emoji, no unicode-symbol icons, no decorative glyph set.**

When functional UI genuinely needs glyphs (play, pause, arrow, close, external-link
in the launch microsite or presenter console), use **Lucide** from CDN
(`https://unpkg.com/lucide-static`) at its default thin stroke — it matches the
minimal, hairline aesthetic. **This is a substitution flagged for the user:** there
is no proprietary icon set in the brief. Keep icons monochrome (`currentColor`),
1.5px stroke, used at hairline weight, accent only on the single active control.
Swap to another thin-stroke CDN set (e.g. Phosphor "thin") if preferred.

---

## INDEX — what's in this system

**Global entry**
- `styles.css` — the one file consumers link. `@import`s everything below.
- `base.css` — stage reset + type primitives (`.lt-display`, `.lt-kicker`, `.lt-mono`…).

**Tokens** (`tokens/`)
- `colors.css` · `typography.css` · `spacing.css` · `effects.css` · `motion.css` · `fonts.css`

**Motion** (`motion/`)
- `launch-theatre.css` — semantic reveal recipes + fallbacks
- `launch-theatre.js` — WebGL/Canvas optical background, orchestration, count-ups, B toggle

**Components** (`components/`) — `window.<Namespace>` after the bundle loads
- core: `Button`, `Kicker`, `MonoMeta`, `Badge`
- stage: `ScreenFrame`, `FeatureCell`, `StageNumber`, `ProgressRail`

**Slides** (`slides/`)
- `index.html` — the 10 cinematic slide layouts as a live deck
- `slides.css` — layout CSS for all ten acts

**Production deck package**
- `decks/launch-theatre-full/index.html` — canonical 10-slide horizontal deck,
  built from `slides/index.html` with a 1920x1080 stage and presenter rail hidden.
- `dist/launch-theatre-keynote-deck.single.html` — verified single-file HTML build
  with online webfonts preserved.
- `dist/launch-theatre-keynote-deck.system-fonts.single.html` — verified
  single-file HTML build with Google Fonts imports removed, relying on Windows-safe
  fallback stacks.
- `scripts/build-canonical-deck.mjs` — rebuilds the canonical deck.
- `scripts/pack-single-html.mjs` — packages a standalone HTML file
  (`--font-mode=online|system`).
- `scripts/verify-deck.mjs` — Playwright/Chrome validation and screenshot/contact
  sheet generation.

**UI kit** (`ui_kits/launch-site/`)
- `index.html` — a cinematic product-launch microsite built from the system

**Foundation cards** (`guidelines/`) — specimens shown in the Design System tab.

**Skill** — `SKILL.md` makes this folder usable as a downloadable Agent Skill.

---

## Production Deck Workflow

Start from the canonical deck for real presentation work:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/launch-theatre-full/index.html --output=dist/launch-theatre-keynote-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/launch-theatre-full/index.html --output=dist/launch-theatre-keynote-deck.system-fonts.single.html --font-mode=system
```

Verify with the bundled Playwright runtime:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/verify-deck.mjs --input=dist/launch-theatre-keynote-deck.single.html --out=_verify_single
```

The verifier checks 10-slide navigation, the 1920x1080 stage fit, four contained
optical WebGL/Canvas fields, semantic reveal recipes, number/count-up visibility,
content bounds, the **B** low-power/static mode, and contact-sheet output.

Default delivery is the single-file HTML build. Produce PPTX/PDF only after the
user explicitly confirms that export format.

The `system` font mode removes Google Fonts imports and uses the existing fallback
stacks: `Segoe UI`, `Microsoft YaHei UI`, `Microsoft YaHei`, `Noto Sans SC`,
`Cascadia Code`, `Consolas`, Arial, and generic sans/mono fallbacks.
