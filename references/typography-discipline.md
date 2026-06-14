# Typography Discipline

Use this reference when a Gate 1B sample or production deck needs tighter type,
Chinese line breaking, projection readability, or Windows-safe font behavior.

## Non-Negotiable Checks

- Titles must be deliberately wrapped. A passed visual sample may not rely on the
  browser's accidental line breaks.
- H1/H2 blocks must declare a measurable width (`max-width`, grid span, or fixed
  slot) and use `text-wrap: balance` when supported.
- Chinese titles must avoid bad line starts/ends. Do not leave closing punctuation
  or sentence particles as the first visible character on a line, and do not leave
  a one- or two-character tail line.
- Body text must have a projection floor. Use larger text than normal web UI:
  body 18px+, dense body 16px+ only when row height and contrast are strong,
  source notes 10px+ only for non-critical metadata.
- Every role must use the selected style's type temperament. Do not swap serif,
  sans, mono, or weight because a single page "looks premium".
- Use Windows-safe stacks unless embedded fonts were explicitly approved.

## Role Floors At 1280x720

These are default gates. Profile overrides in `execution-grammar.json` can be
stricter.

| Role | Minimum | Normal Range | Line Height | Max Lines |
|---|---:|---:|---:|---:|
| Cover H1 | 48px | 56-84px | 0.95-1.14 | 3 |
| Slide H1/H2 | 30px | 34-58px | 1.02-1.22 | 2-3 |
| Lead | 18px | 20-28px | 1.25-1.5 | 3 |
| Body | 16px | 18-24px | 1.32-1.65 | 5 |
| Table body | 12px | 13-17px | 1.25-1.55 | per cell 3 |
| Source note | 9.5px | 10-12.5px | 1.15-1.4 | 2 |
| Mono label | 10px | 11-14px | 1.0-1.35 | 1-2 |

## Title Wrapping Rules

For every `h1`, `h2`, `.title`, `.cover-title`, or `[data-type-role="title"]`:

- width must be constrained; no full-width accidental measure unless the layout
  family explicitly says so;
- cover/title slide: max 3 lines; dense/diagram slide: max 2 lines unless the
  grammar profile overrides it;
- last line should contain at least 4 CJK characters or 8 Latin characters;
- avoid breaking fixed phrases such as product names, model names, numbers with
  units, and named frameworks;
- use manual line breaks only when they are semantic; avoid `<br>` as an escape
  hatch for bad copy length.

Useful CSS:

```css
h1, h2 {
  text-wrap: balance;
  overflow-wrap: normal;
  word-break: normal;
  line-break: strict;
}
```

## CJK Line-Start And Line-End Guardrails

Bad line starts include:

```text
， 。 、 ； ： ？ ！ ） 】 》 」 』 ” ’ % ‰
```

Bad line ends include:

```text
（ 【 《 「 『 “ ‘
```

When a CJK heading fails this check, revise the copy, reduce the font size within
the style range, change the title slot width, or add a semantic line break.

## Windows-Safe Font Stacks

Use these stacks unless the user approved embedded fonts:

- Clean sans: `Aptos, "Segoe UI", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif`
- Editorial serif: `Georgia, "Times New Roman", SimSun, "Microsoft YaHei", serif`
- Mono labels: `"Cascadia Mono", Consolas, "Courier New", monospace`

Do not depend on macOS-only metrics such as PingFang, SF Pro, or Hiragino. They
can appear as optional earlier fallbacks only when a Windows-safe fallback is
present and QA is run against the system-font build.

## QA Expectations

Run typography QA before asking for Gate 1B approval:

```bash
node scripts/type-qa-sample.mjs --file=<sample-index.html> --style=<style-id>
```

The script should fail on:

- headings below the style floor or above the title-line limit;
- title slots without constrained width;
- CJK punctuation at line starts/ends;
- one- or two-character tail lines;
- body/source/table text below the projection floor;
- source notes or table cells with excessive line counts.

Reference anchors:

- Fluent 2 typography type ramp: https://fluent2.microsoft.design/typography
- IBM Carbon typography tokens: https://carbondesignsystem.com/elements/typography/overview/
- W3C Chinese Layout Requirements: https://www.w3.org/TR/clreq/
- MDN `text-wrap`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap
