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

Confirm deck type and style before narrative.

Ask:

1. 用途是什么：上课课件、投资人 pitch、教育机构宣传、数据/研究证明、产品发布会，还是别的？
2. 你想要哪种观感：稳重、锋利、舞台感、温和教育感、证据感、杂志感，还是给我参考？
3. 是否允许我先基于模板给你看一个样本方向？

Then show/reference the contact sheet path for the selected template. If the user
does not like it, either choose another template or propose concrete changes:
accent color, typography weight, density, motion intensity, image treatment,
page rhythm.

Do not proceed until style direction is accepted.

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
