# Workflow

This skill should behave like a deck director, not a silent template copier. Use
plain language, preferably Chinese when the user is speaking Chinese.

## Gate 0: Input State

Classify the user's starting point:

- **No idea:** ask for audience, occasion, rough topic, duration/page count, and
  whether web research is allowed.
- **Some idea:** restate the idea as options, then ask what should be emphasized
  or excluded.
- **Materials provided:** inspect the files first. Identify useful facts, visuals,
  narrative tension, and missing parts. Then continue to style confirmation.

Do not infer the user's final position when the choice is subjective. Present the
variables and ask for a decision.

## Gate 1: Style

Confirm deck type and style before narrative. Gate 1 has two sub-gates:

- **Gate 1A: style id approval.** The user chooses a template/style direction.
- **Gate 1B: visual sample approval.** After 1A, produce a mandatory deck-specific
  2-3 slide sample and ask whether it matches the desired style.

Do not enter Gate 2 after only Gate 1A. User phrases such as "牛津海军蓝羊皮纸",
"允许联网", "需要 PPT", "ok 通用的", or "可以导出 PDF/PPTX" do not mean the
visual sample is approved. Only explicit approval of the sample unlocks Gate 2.

Ask:

1. 用途是什么：上课课件、投资人 pitch、教育机构宣传、数据/研究证明、产品发布会，还是别的？
2. 你想要哪种观感：稳重、锋利、舞台感、温和教育感、证据感、杂志感，还是给我参考？
3. 是否允许我先基于模板给你看一个样本方向？

Then read `references/style-system.md` and select 1-3 candidates from
`assets/style-systems/style-catalog.json`. Show/reference the contact sheet path
for the selected template and describe each style candidate by the execution axes:

- color master and usage ratio
- Windows-safe typography temperament
- layout density and whitespace
- graphic language for diagrams/charts/images
- motion grammar and B low-power mode
- component grammar and forbidden UI components
- shape grammar and forbidden primitives
- layout whitelist / safe-zone implications
- grid discipline: strict/measured/optional mode, column count, baseline,
  auditable `data-grid-band` regions, and same-box overlay requirement

If the user does not like it, either choose another template/style id or propose
concrete changes on the full execution axes: color, type, density, graphics,
motion, components, shapes, layout whitelist, and grid discipline. Do not solve
style feedback with random colors. Do not use "科技感", "高级", "简洁", "温和" as
final instructions; lock a named style id or a derived style with explicit
tokens.

Do not proceed until both the style id and the visual sample are accepted.

Style gate output should be a proposal or a 2-3 slide visual sample only. The
sample must cover: title slide, dense content slide, and chart/process slide. Do
not produce the full narrative outline or production deck until the user accepts
the style sample.

Before building the visual sample:

1. Run or read:

```bash
node scripts/list-style-grammar.mjs --style=<style-id>
```

2. Read the chosen template's `SKILL.md` and manifest listed in
   `assets/style-systems/execution-grammar.json`.
3. Choose named layout families from the execution grammar. Every slide must have
   `data-layout-id`.
4. Decide component roles before drawing them. Dark surfaces, instrument panels,
   telemetry panels, source ledgers, and callouts must use `data-component-role`.
5. Use the template component library first. Do not write an anonymous mini design
   system for the sample.
6. If the grammar profile is strict/measured for grid discipline, set grid tokens
   on the deck root or each slide, place major regions with `data-grid-band`, and
   keep the grid overlay in the same content box as the slide content.

Before showing the visual sample:

```bash
node scripts/validate-style-sample.mjs --file=<sample-index.html> --style=<style-id> --template=<template-id>
node scripts/visual-qa-sample.mjs --file=<sample-index.html> --style=<style-id> --out=<sample-dir>/_visual_qa
```

`visual-qa-sample.mjs` calls `grid-qa-sample.mjs` automatically when `--style` is
provided. If either check fails, revise the sample. Do not show screenshots or ask
for approval while any slide has scrollbars, clipped text, element overflow,
missing 1280x720 framing, browser errors, missing grid tokens, off-column grid
bands, missing `data-grid-band`, or missing same-box overlay for strict/measured
profiles. Tell the user only after the sample can pass the grammar, visual, and
grid-discipline gates, or explicitly state which rule still needs design
judgment.

After the user chooses one candidate style, the next assistant action must be one
of:

- create/show the 2-3 slide visual sample;
- if the environment cannot create the sample yet, say so and ask whether to make
  the sample now.

Do not browse sources, draft the 12-page framework, or list references before the
sample is accepted unless the user explicitly asks for research before sampling.

Smoke-test example:

User: "牛津海军蓝羊皮纸，允许联网，需要 PPT"

Correct next response: "已确认风格 id、联网权限和 PPTX 意向。下一步仍然不能进叙事框架；我先做 2-3 页
oxford-navy-parchment 样片，覆盖封面、信息密集页、判断清单/流程页。样片会先按 academic-institutional
语法校验：无随机黑底块、无假学院纹章、布局都有 data-layout-id。样片确认后再做页纲和资料研究。"

Incorrect next response: listing CEFR/ACTFL sources, proposing a 12-page outline,
or saying production can start.

## Gate 2: Narrative Framework

Confirm:

- audience and scene
- target result after the talk
- page count / talk duration
- key tension or main claim
- beginning, middle, ending
- what must be proven, taught, sold, or remembered

Useful arcs:

- **Teaching:** why it matters -> concept -> map -> steps -> case -> exercise ->
  mistakes -> recap -> assignment.
- **Investor:** shift -> wedge -> product -> market -> traction -> model ->
  moat -> ask.
- **Prospectus:** promise -> programs -> method -> outcomes -> campus/team ->
  proof -> admissions/action.
- **Evidence:** finding -> metric -> timeline -> comparison -> cases ->
  method -> limitations -> next actions.
- **Launch:** tension -> removal -> reveal -> capabilities -> demo -> proof ->
  availability.

Do not write full slides yet. Confirm the arc and slide count first.

## Gate 3: Detailed Sections

Create a slide-by-slide table:

- slide number
- role in narrative
- headline draft
- key bullets/paragraph
- visual type
- data/source/material
- motion/layout note

Ask the user to confirm or revise the table. If sources are missing, state which
slides need evidence or whether placeholder claims are acceptable.

## Gate 4: Production

After approval:

- copy the chosen template pack into the project
- edit canonical deck or slide sources, preserving the design system
- package to single HTML
- verify in browser/Playwright if scripts exist
- show or point to the contact sheet/screenshot
- ask before PPTX/PDF export

## Research And Materials

Use web browsing when:

- the user asks to search
- facts may have changed
- claims are high-stakes or need attribution
- current market, competitor, pricing, regulation, or model info is needed

When browsing, cite sources in the working notes or final handoff as appropriate.
Do not bury unsupported claims in the deck.

## Visual Generation

Before generating images, ask. If accepted:

- define visual role per slide
- match template art direction
- choose ratio from the slide slot
- keep text in visuals minimal and in the deck language
- save assets with semantic names
- repack single-file HTML if the final deliverable needs one file
