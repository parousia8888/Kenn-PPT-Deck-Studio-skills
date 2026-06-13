A ruled, mono-headed table — used only when a table improves clarity. 2px ink rule under headers, hairline rows, paper-tone zebra.

```jsx
<DataTable
  columns={[
    { label: "Region", key: "r" },
    { label: "Cases", key: "n", align: "right", mono: true },
    { label: "Δ vs. base", key: "d", align: "right", emphasize: true },
  ]}
  rows={[{ r: "North", n: "1,204", d: "+18%" }, { r: "South", n: "986", d: "+7%" }]}
  source="Source · field audit · SRC-3310"
/>
```

`emphasize` renders a column in light display type for a focal figure. `mono` for codes/ids.
