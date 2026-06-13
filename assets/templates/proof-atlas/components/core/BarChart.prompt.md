A custom horizontal bar chart — deliberately not chart-library styling. Mono labels, hairline baseline, light-weight display values, built-in source.

```jsx
<BarChart
  unit="%"
  data={[
    { label: "North", value: 72 },
    { label: "South", value: 58 },
    { label: "West",  value: 41, accent: false },
  ]}
  source="Source · regional audit · n=3,402"
/>
```

Bars carry `data-anim="draw-x"` and grow left-to-right when revealed inside an `.atlas-stage`. Set one bar `accent: false` to recede it.
