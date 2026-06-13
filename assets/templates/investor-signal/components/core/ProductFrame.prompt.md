Premium frame for product screenshots / demo moments. Large, controlled, one deep shadow — never a cheap browser mockup.

```jsx
<ProductFrame label="signal · live pricing" ratio="16 / 10">
  <img src="assets/shot.png" style={{width:'100%',height:'100%',objectFit:'cover'}} />
</ProductFrame>
```

- `chrome`: `bar` (thin signal bar, default) · `window` (muted traffic lights) · `none`.
- Reveals with a subtle bottom mask when the slide activates (`anim`, default on).
- Drop a real screenshot inside; avoid fake 3D renders.
