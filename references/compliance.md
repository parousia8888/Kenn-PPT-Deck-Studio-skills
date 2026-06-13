# Compliance

## Sources

The five bundled authored templates were provided by the user as design system
packages and converted into usable deck packages in this workspace:

- `investor-signal`
- `course-canvas`
- `academy-prospectus`
- `proof-atlas`
- `launch-theatre`

Each package keeps its own `SKILL.md` and `readme.md` where applicable.

## Guizang Base

`assets/guizang-base` includes selected local assets and references from
`guizang-ppt-skill`, which is MIT licensed.

Required handling:

- Keep `assets/guizang-base/LICENSE`.
- Preserve source/provenance files in the skill package.
- Do not place guizang provenance text into generated deck slides, HTML visible
  content, cover pages, or generated imagery.
- If redistributing the skill repository, include the MIT license notice.

## Generated Decks

For any deck based on web research or third-party material:

- track source URLs in working notes or speaker notes when relevant
- avoid unsupported statistics
- respect user-provided confidentiality constraints
- ask before using external assets beyond screenshots/materials the user supplied

## Template Modifications

Second modification is acceptable when license/provenance is preserved and the
result does not falsely claim authorship over upstream MIT content. For user-owned
templates, keep original package docs unless the user asks to remove them.
