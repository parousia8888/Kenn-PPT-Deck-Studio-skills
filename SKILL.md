---
name: kenn-ppt-deck-studio
description: "Use this skill to guide and produce high-aesthetic HTML/PPT decks end to end for Kenn: class teaching decks, investor pitch decks, education prospectus decks, evidence/data decks, and launch-event keynote decks. It covers information gathering, source/material reading, style confirmation with sample preview, narrative framework confirmation, section/detail confirmation, single-file HTML production, optional generated visuals, and optional PPTX/PDF export after explicit confirmation."
---

# Kenn PPT Deck Studio

Purpose: build high-recognition, high-aesthetic presentation decks with a guided
plain-language workflow. Default deliverable is a **single-file HTML deck**. Ask
before generating images, browsing, producing PPTX/PDF, or changing style.

## Hard Workflow

Do not start slide production until these gates are confirmed:

1. **Style first.** Identify deck type and recommend 1-3 candidate styles. Show or
   reference a sample/contact sheet before production. If the user says the sample
   is not right, switch template or modify a style direction first.
2. **Narrative framework second.** Confirm the story arc, page count, audience,
   use case, and expected outcome.
3. **Detailed sections third.** Confirm slide-by-slide sections, paragraph/detail
   level, required data, must-include/must-avoid content, and source/material use.
4. **Production last.** Build the deck only after the previous gates are accepted.

If the user has no idea, guide them through the gates in short Chinese/plain
language. If the user already has ideas or materials, read/inspect materials first,
then still confirm style -> narrative -> details.

## Template Routing

Use bundled templates in `assets/templates/`:

- **上课课件 / lesson / courseware** -> `course-canvas`
- **投资人 pitch deck / fundraising / demo day** -> `investor-signal`
- **教育机构宣传册 / school brochure / prospectus** -> `academy-prospectus`
- **研究报告 / 数据证据 / 战略复盘 / case proof** -> `proof-atlas`
- **产品发布会 / 高级发布会 / keynote / launch event** -> `launch-theatre`
- **杂志感 / 瑞士风 / custom lightweight web PPT** -> `assets/guizang-base`

For visual specifics, read `references/style-routing.md` and the chosen template's
own `SKILL.md` or `readme.md`. Load only the chosen template docs, not every
template.

## Confirmation Gates

Required user confirmations:

- **Research/materials:** confirm whether to browse web, use provided files, or use
  only user-supplied notes. Use web browsing when facts may be current or the user
  asks to search.
- **Style:** confirm template and style sample. Contact sheets live in
  `assets/contact-sheets/<template>/contact-sheet.png`.
- **Generated visuals:** ask before generating images. Default recommendation is
  to generate visuals when they materially improve clarity or stage impact.
- **Export:** ask before producing PPTX/PDF. Default is single-file HTML.
- **External assets:** assets are allowed, but default output should still be a
  self-contained single HTML when practical.

## Build Rules

- Preserve the chosen template's design system. Do not reduce a template to a
  minimal implementation.
- Keep dynamic backgrounds and semantic motion. Keep **B** low-power/static mode.
- Keep Windows-safe font fallbacks. Prefer the `.system-fonts.single.html` build
  for offline/Windows handoff checks.
- Use product screenshots, diagrams, generated visuals, or data visualization when
  they clarify the deck. Avoid text-only decks unless the user asks.
- Use concise, spoken, slide-native copy. One slide should carry one job.
- Ask before switching style after approval.

## Key References

- `references/workflow.md` — full guided process and confirmation scripts.
- `references/style-routing.md` — template decision matrix and sample-preview rule.
- `references/build-and-export.md` — how to copy, package, verify, and optionally export.
- `references/compliance.md` — provenance and license handling, including guizang MIT attribution.

## Common Commands

List templates:

```bash
node scripts/list-templates.mjs
```

Copy a template pack to a working folder:

```bash
node scripts/create-project.mjs --template=launch-theatre --out=/path/to/project
```

After editing a template's canonical deck, run that template's own pack/verify
scripts from inside the copied project.
