Primary button for actions in Course Canvas interfaces — oxblood fill by default, with calm hover/press states.

```jsx
<Button variant="primary" onClick={start}>Begin lesson</Button>
<Button variant="secondary" size="sm">Skip</Button>
<Button variant="sage">Mark complete</Button>
<Button variant="ghost" as="a" href="#notes">Teacher notes</Button>
```

Variants: `primary` (oxblood), `secondary` (ink outline → fills on hover), `sage` (chalk green), `ghost` (quiet, fills with paper-sunken on hover).
Sizes: `sm`, `md` (default), `lg`. Pass `icon` / `iconRight` for inline glyphs. Use `as="a"` for link buttons. Disabled via the native `disabled` attribute.
