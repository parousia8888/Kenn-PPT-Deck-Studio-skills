A restrained, editorial call to action — used sparingly on enrollment and contact moments.

```jsx
<Button variant="accent" size="lg">Request a prospectus</Button>
<Button variant="secondary">Book a visit</Button>
<Button variant="ghost">Read the curriculum →</Button>
```

Variants: `primary` (ink fill), `accent` (inherits the section's `--accent`), `secondary` (hairline outline), `ghost` (underline-on-hover text link). Sizes: `sm` / `md` / `lg`. Put it inside a `[data-accent="forest|navy|gold|terracotta"]` scope so `accent`/`ghost` pick up the chapter colour.
