The modular evidence card — every fact sits in one. Hairline border, mono header (id + coordinate), body, mono source footer. Squared, no shadow.

```jsx
<EvidenceCell cellId="CELL A·01" coord="42.36 / 71.05"
              method="internal telemetry" id="SRC-2087">
  <Metric value="2.4" unit="×" label="Throughput vs. baseline" />
</EvidenceCell>
```

Compose `Metric`, images, or text inside. Use `muted` for secondary cells. Lay several in a CSS grid with `gap` to form an evidence grid.
