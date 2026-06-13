# Style Routing

Use this file after the user has described deck purpose or visual taste.

## Template Matrix

| Template | Use | Visual Signature | Avoid When |
|---|---|---|---|
| `course-canvas` | 上课课件、培训、课堂讲解 | warm paper, editorial teaching diagrams, calm motion | product-launch drama or investor sharpness is required |
| `investor-signal` | pitch deck, demo day, fundraising | sharp investor signal, dark/light business surfaces, decisive KPI moments | educational warmth or brochure storytelling is central |
| `academy-prospectus` | 教育机构宣传册、招生、课程品牌介绍 | premium prospectus, warm institutional credibility, brochure rhythm | dense proof/data analysis is central |
| `proof-atlas` | 研究报告、数据证明、案例证据、战略复盘 | intelligence dossier x Swiss atlas, grids, ledgers, sourced metrics | emotional launch or classroom explanation is central |
| `launch-theatre` | 产品发布会、高级 keynote、舞台发布 | black stage, glacial cyan optical light, cinematic reveal | detailed reporting or many paragraphs are required |
| `guizang-base` | 杂志感、瑞士风、轻量自定义网页 PPT | electronic magazine / Swiss international style | the five authored templates fit better |

## Contact Sheets

Use these sample sheets for style confirmation:

- `assets/contact-sheets/course-canvas/contact-sheet.png`
- `assets/contact-sheets/investor-signal/contact-sheet.png`
- `assets/contact-sheets/academy-prospectus/contact-sheet.png`
- `assets/contact-sheets/proof-atlas/contact-sheet.png`
- `assets/contact-sheets/launch-theatre/contact-sheet.png`

Show or reference the sheet before production. If the user rejects the style,
change style before narrative detailing.

## Style Modification

Allowed after confirmation:

- accent color within the approved style catalog token system
- density and page count
- motion intensity, while keeping semantic motion and B low-power mode
- image treatment
- headline scale
- custom template derived from one base template
- stricter component variants inside the chosen template, when the execution
  grammar requires it

Not allowed by default:

- mixing two templates in one deck without explicit approval
- freehand/random palettes outside `assets/style-systems/style-catalog.json`
- vague final art direction such as "more tech", "高级简洁", or "有艺术感" without
  a locked style id and full execution-axis specification
- removing the template motion system
- using macOS-only fonts
- flattening the design into plain cards or text-only slides
- replacing the chosen template's component library with fresh one-off CSS
- adding a component shape forbidden by the selected execution grammar, such as
  circular process badges in `braun-graphite-orange`
- using dark/black panels unless their semantic role is permitted by the grammar

## Creating A New Style Template

Supported. Treat it as a new style derivation:

1. Pick the closest base template.
2. Pick the closest style id from `assets/style-systems/style-catalog.json`.
3. Confirm artistic anchors in concrete terms: color master, typography
   temperament, layout density, graphic language, motion grammar, component
   grammar, shape grammar, layout whitelist, and forbidden motifs.
4. Create a 2-3 slide style sample first.
5. Validate the sample with `scripts/validate-style-sample.mjs`.
6. Ask for approval.
7. Only then expand into the full deck template.

Keep the new template in a project folder first. Add it back into `assets/templates`
only after it is verified.

## Style Catalog Usage

Use `references/style-system.md` for the gate rules and
`assets/style-systems/style-catalog.json` for locked style systems. Use
`assets/style-systems/execution-grammar.json` for the binding component/shape
rules after a style id is chosen. The catalog contains 50+ options spanning
technical manuals, premium keynote, Swiss poster, editorial print, education
prospectus, investor memo, data terminal, AI lab, archive, research, and
cultural/art styles.

Useful command:

```bash
node scripts/list-styles.mjs --use=courseware
node scripts/list-style-grammar.mjs --style=braun-graphite-orange
```
