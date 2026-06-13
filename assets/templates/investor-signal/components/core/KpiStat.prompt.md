Dominant traction metric — a huge tabular figure with mono caption and optional accent delta. Animates count-up when the slide becomes active.

```jsx
<KpiStat count={4.2} prefix="$" suffix="B" decimals={1}
         caption="Serviceable market · 2025" delta="218% YoY" />
<KpiStat value="$4.2B" size="mega" align="center" caption="ARR run-rate" />
```

- Set `count` for animated reveal; `value` for a static figure.
- `size`: `sm` inline · `lg` section figure · `mega` single hero stat.
- Use one mega stat per slide. Numbers are loud but truthful — never inflate.
