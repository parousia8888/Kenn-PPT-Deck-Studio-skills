Numbered procedure for step-by-step explanations. Each step has an optional title and body.

```jsx
<StepList steps={[
  { title: "Find the center", body: "Write down the mean μ." },
  { title: "Measure the gap", body: "Subtract the mean: x − μ." },
  { title: "Scale by spread", body: "Divide by σ." },
]} />
```

`variant`: `ox` (default) or `sage` numbers. Markers are auto-numbered with leading zeros.
