One feature in a feature-trio — drawing hairline, mono index, name and a single line of copy.

```jsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 48 }}>
  <FeatureCell i={0} index={1} name="On-device">Runs fully local, no round-trip.</FeatureCell>
  <FeatureCell i={1} index={2} name="Instant">First token under 40ms.</FeatureCell>
  <FeatureCell i={2} index={3} name="Private">Nothing leaves the device.</FeatureCell>
</div>
```

Pass `i` to stagger each cell's reveal. The hairline draws in via the feature-trio motion recipe.
