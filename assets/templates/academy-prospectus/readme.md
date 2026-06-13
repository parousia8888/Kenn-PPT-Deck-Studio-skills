# Academy Prospectus — Design System

A premium, brochure-style **presentation system for education institutions** — schools, academies, training centres and learning brands. It presents curriculum, faculty, outcomes, student stories and enrollment with **trust and warmth**. Every artifact is built to work two ways at once: a **live keyboard-driven presentation** and a **print-ready PDF brochure**.

> **Art direction in one line:** a boutique school prospectus, a museum program booklet and a refined editorial brochure, combined. Trustworthy, warm, intelligent, quietly premium. Never childish, cartoonish, or corporate.

The sample brand used throughout — **"Linden Academy"** (林登语言与人文学院), a fictional bilingual language & humanities school — is illustrative. Replace its copy, figures and imagery with the real institution's.

> **Sources:** This system was authored from a written art-direction brief only — there was **no external codebase, Figma file, or existing brand kit** to import. All visuals, tokens, components and the deck template are original to this brief. If a real Linden Academy (or your institution's) brand assets exist, supply them and they will supersede the placeholders here.

---

## Content fundamentals — how the prospectus speaks

The voice addresses **parents, adult learners, and institutional buyers**. It prioritises **credibility over marketing hype**.

- **Tone:** warm, intelligent, plain-spoken, quietly confident. Reassuring without gushing. It sounds like a respected head teacher writing a letter, not an ad.
- **Person:** mostly **"we"** for the institution and **"every learner / your daughter / students"** for the audience. Occasional direct **"you"** ("Choose a path to begin"). Avoid "I".
- **Casing:** sentence case for headlines and body. **UPPERCASE is reserved for mono metadata** (course codes, age groups, durations, section labels) and is always tracked (`letter-spacing`).
- **Emoji:** **never.** Not part of the brand.
- **Numbers & claims:** always **sourced and honest**. Every statistic carries a small methodology line ("Cohort 2024–25 · n=312", "Verified by certified examiners"). The system explicitly says it "publishes what we can stand behind." No vanity metrics, no rounded-up hype.
- **Sentence shape:** short declaratives, the occasional em-dash aside, one idea per line. Reading is calm and unhurried.
- **Signature phrases (examples):** "We teach the *person*, not only the syllabus." · "A serious education, given *gently*." · "Taught by scholars who stay." · "Results, honestly reported." · "We publish what we can stand behind."
- **Bilingual:** Chinese sits comfortably beside English (the brand is bilingual). Always use the CJK-safe font stacks (below) so 中文 renders on Windows and macOS alike.

---

## Visual foundations

### Colour — identity, not decoration
Colour is used as **section identity**. The deck is built on a calm parchment base with charcoal text; each chapter "owns" one of four muted accents, applied via a `data-accent` scope.

- **Base / surfaces:** warm white `--paper #FAF6EF`, `--porcelain`, `--parchment`, `--paper-deep`, and a dark `--paper-ink #211E1A` for contrast moments.
- **Ink / text:** `--ink #221F1A` (display) → `--charcoal` (body) → `--ink-muted` (captions) → `--ink-faint` (metadata).
- **Accents (section identities):** muted **terracotta** `#B05C3B`, **forest** `#3C5A45`, **soft navy** `#324A63`, **dusty gold** `#A98545`. Each has a `-deep` variant and a barely-tinted `-field` for calm colour panels.
- **Rule:** never use accents as candy/rainbow decoration. One accent per section, set once via `[data-accent="forest"]` so the eyebrow, chips, rules, KPI numbers and feature panels all inherit it.

### Typography
- **Display — Spectral** (literary humanist serif): covers, statements, titles, quotes, prices. Weights 300–600 + italic. Italic is the system's emphasis device ("the *person*").
- **Body — Source Sans 3** (humanist sans): all reading copy. Calm, legible at length.
- **Metadata — JetBrains Mono**: course codes, age groups, lesson durations, module labels, folios, section labels. Always UPPERCASE + tracked `0.14–0.22em`. This mono-small-caps device is the system's most recognisable signature.
- **Every stack ships explicit Windows + CJK fallbacks** (Segoe UI / Microsoft YaHei UI / Noto Sans SC / SimSun / Georgia). Fonts load from Google Fonts via `tokens/fonts.css`; if the webfont fails, the fallback stack keeps everything readable. See `--font-display`, `--font-body`, `--font-meta`.

### Spacing & layout
- **8px rhythm** (`--s-1 … --s-10`) with **generous editorial margins** (`--margin-slide` clamps 48–110px). Air is a feature — the calm comes from white space.
- Fixed **1280×720** slide canvas, scaled-to-fit and letterboxed on near-black `#1c1916`.
- Structured **image grids** and **module grids** use 1px hairline gridlines over `--line`, not heavy borders.

### Imagery
- **Documentary, human-centred, editorial.** Warm grade (`saturate(0.92) contrast(1.02)`), **tight 4px corners** (`--r-image`), soft drop shadow, optional uppercase-mono caption on a gentle bottom gradient. No stock-y gloss, no duotones, no rainbow.
- Until real photography is supplied, slides use an intentional **documentary placeholder** (`.img-ph`) — a warm tinted field with a lens glyph and a mono label — so layouts read as designed, not broken.

### Borders, radii, shadows
- **Corners are gentle, never bubbly:** images 4px, cards 10px, panels 16px, pills only for chips. This is a brochure, not an app.
- **Hairlines** (`--line`, 1px) do the structural work; a heavier `--rule` (2px ink) underlines the contact block.
- **Shadows are soft and paper-lifted** — `--shadow-card`, `--shadow-lift`, `--shadow-image` — warm-tinted, low-opacity, never harsh or neon.

### Motion
- **Page-like, warm, editorial.** Gentle fades and soft reveals on slow, settling easings (`--ease-page`, `--ease-ink`, `--ease-calm`); durations 360–1400ms. No bounces, no techy effects.
- **Dynamic background:** a canvas-2D **paper-light layer** — barely-visible laid-paper fibres + a slow breathing vignette that swells, recedes and gently drifts (~35s). Almost photographic; it never reduces text readability and runs at ~25fps.
- **Semantic slide-enter system** (CSS `@keyframes`, not transitions, so they replay reliably): each slide type declares its recipe via `data-anim` —
  - `prospectus-cover` — title blooms like ink (`ap-ink`); image pushes in; mark settles last.
  - `philosophy` — statement first, supporting paragraph soft-up after.
  - `curriculum-pathway` — track draws left→right, stations settle along it.
  - `teacher-team` / generic — cards rise in a measured staggered rhythm (`--step`).
  - `environment-gallery` — images reveal with a soft top-down crop mask (`ap-curtain`), no bounce.
  - `outcomes` — numbers fade up, captions follow.
  - `testimonial` — quote line by line, attribution last.
  - `enrollment` — plan columns in reading order, contact block settles at the end.
- **Resting state is always the finished design.** The hidden→visible arc only plays when a slide is active and motion is allowed — so **print, no-JS, and `prefers-reduced-motion` always show complete content.**
- **Low-power mode:** press **B** to toggle `body.low-power` — rAF stops, the paper canvas hides, all content snaps to its final static state, and a small "Static mode" hint appears. Press **B** again to resume. **R** replays the current slide's entrance.

### Hover / press states
- Buttons: hover **darkens** the fill (primary → charcoal; accent → `-deep`) or reveals an underline (ghost); press **shrinks** to `scale(0.975)`. Nav arrows lift to porcelain on hover, `scale(0.96)` on press. Transitions are quick (`--dur-fast`) and calm.

---

## Iconography

This system is **deliberately icon-light** — editorial restraint over UI furniture. There is **no icon font and no decorative icon set**, and **no emoji**.

- The **institution mark** is a typographic glyph: the school's initial set in italic display serif inside a thin accent circle (`.slide-rail .mark .glyph`), locked up with the wordmark. Swap the letter and name per brand.
- A few **geometric primitives** carry meaning where an icon might otherwise go: the pathway **node** (ringed dot), the **lens** glyph in image placeholders, accent **bullet dots** in plan lists, and the leading **rule** in eyebrows. All are drawn with CSS borders/shapes, not SVG art.
- Arrows in the deck nav use Unicode glyphs `‹ ›` (`&#8249; &#8250;`), and quotation marks use real typographic `&ldquo;`.
- **If you need functional icons** (e.g. a contact sheet with phone/mail marks), add **Lucide** from CDN (`https://unpkg.com/lucide@latest`) — its thin, humanist 1.5px stroke matches this system. Flag any icon use to the brand owner; keep it minimal and monochrome in `--ink-muted`.

No raster icon assets ship with this system; nothing to copy into `assets/`. (There is no `assets/` folder yet — add one only when real logos/photography arrive.)

---

## Index — what's in this system

**Global entry:** `styles.css` — `@import`s only; link this one file. It reaches:
- `tokens/fonts.css` — Google Fonts (@import) for Spectral / Source Sans 3 / JetBrains Mono / Noto Serif SC / Noto Sans SC.
- `tokens/colors.css` — base, ink, four accents (+ `[data-accent]` scopes), lines, shadows, semantic aliases.
- `tokens/typography.css` — families (with Windows + CJK fallbacks), type scale, weights, line-heights, tracking, `.meta-label`.
- `tokens/spacing.css` — 8px scale, editorial margins, radii, hairline weights.
- `tokens/motion.css` — durations, easings, stagger.

**Slide system** (`slides/`):
- `prospectus-slides.css` — the ten brochure layouts (`.l-cover … .l-enroll`), shared furniture (`.slide-rail`, `.eyebrow`, `.chip`, `.img-frame`, `.img-ph`), the keyframe slide-enter system, low-power styles, and deck nav chrome.
- `prospectus-motion.js` — the paper-light background, slide activation + keyboard/click nav, **B** low-power toggle, **R** replay, print reveal-all. Robust to single-slide and zero-slide pages.
- Ten layout specimen pages: `cover · promise · philosophy · curriculum · pathway · teachers · environment · outcomes · testimonial · enrollment` (each tagged into the **Slides** card group).

**Components** (`components/`) — React primitives, bundled to `window.AcademyProspectusDesignSystem_9696cb`:
- `core/` — **Button** (primary/accent/secondary/ghost), **MetaChip** (mono token), **Eyebrow** (chapter label).
- `cards/` — **TeacherCard** (editorial faculty profile), **OutcomeStat** (sourced KPI), **TestimonialCard** (designed quote), **PlanCard** (enrollment column).

**Template** (`templates/prospectus-deck/`) — the original full 10-slide Linden Academy prospectus from the UI kit. It scales to any viewport, exports to PDF (one slide per page), and demonstrates the complete prospectus narrative.

**Canonical deck** (`decks/academy-prospectus-full/index.html`) — the production starting point for deck work. It preserves the full 10-slide template DOM, removes the unused React / `ds-base.js` runtime path, links the local token and slide CSS directly, and keeps the paper-light motion engine.

**Single-file builds** (`dist/`):
- `academy-prospectus-deck.single.html` — default single-file HTML deliverable with Google Fonts imports kept online.
- `academy-prospectus-deck.system-fonts.single.html` — single-file HTML deliverable without external font imports, relying on the Windows-safe fallback stacks.

**Scripts** (`scripts/`):
- `build-canonical-deck.mjs` — rebuilds `decks/academy-prospectus-full/index.html` from the original template.
- `pack-single-html.mjs` — inlines local CSS/JS/assets into one HTML file. Use `--font-mode=online|system`.
- `verify-deck.mjs` — Playwright/Chrome validation for slide count, viewport fit, motion recipes, paper canvas, low-power mode, replay, and content staying inside slide bounds.

**Foundations** (`guidelines/`) — specimen cards for the Design System tab: colour (base / ink / accents), type (display / body / metadata), spacing (scale / radii-shadow), brand (mark / imagery / motion background).

**`SKILL.md`** — makes this folder usable as a downloadable Claude Code skill.

### Quick start
1. Start from `decks/academy-prospectus-full/index.html`, not from a minimal sample.
2. Replace the fictional Linden Academy copy, statistics and placeholders with the real institution's materials.
3. Set each slide's chapter colour with `data-accent="terracotta|forest|navy|gold"` and its entrance with `data-anim="..."`.
4. Present with left/right arrows (or click the nav arrows); press **B** for static low-power mode, **R** to replay a slide.
5. Default delivery is single-file HTML. Ask before producing PPTX/PDF exports or changing the visual style.

Rebuild and package:

```bash
node scripts/build-canonical-deck.mjs
node scripts/pack-single-html.mjs --input=decks/academy-prospectus-full/index.html --output=dist/academy-prospectus-deck.single.html --font-mode=online
node scripts/pack-single-html.mjs --input=decks/academy-prospectus-full/index.html --output=dist/academy-prospectus-deck.system-fonts.single.html --font-mode=system
```

Verify in Chrome/Playwright:

```bash
NODE_PATH=/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/verify-deck.mjs --input=dist/academy-prospectus-deck.single.html --out=_verify_single
```

The `system` font mode is intended for offline/Windows handoff checks. It removes Google Fonts imports while preserving readable fallback stacks (`Segoe UI`, `Microsoft YaHei UI`, `Microsoft YaHei`, `SimSun`, `Cascadia Code`, `Consolas`, Georgia, Arial).
