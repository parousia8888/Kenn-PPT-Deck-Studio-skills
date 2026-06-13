Large reveal figure for benchmarks / KPIs — thin display numeral, mono unit and tracked label.

```jsx
<StageNumber value="2.4" unit="×" label="Faster inference" delta="vs prior generation" />
<StageNumber value="98.7" unit="%" label="Accuracy" animate countTo={98.7} />
```

Set `animate` (with `countTo`) to count the number up on slide reveal. `accent={false}` for a neutral numeral.
