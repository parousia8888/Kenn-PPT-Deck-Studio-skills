The stage object for product screenshots / live UI — dark frame, optical lift, light sweep on reveal.

```jsx
<ScreenFrame src="assets/product.png" label="LT-9 Console" ratio="16 / 10" />

<ScreenFrame label="Console">
  {/* live UI mock as children */}
</ScreenFrame>
```

Place inside a `[data-anim="product"]` block so it emerges from darkness with a slow push and the sweep crosses it.
