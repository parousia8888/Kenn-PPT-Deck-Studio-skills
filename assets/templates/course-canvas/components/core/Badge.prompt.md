Small uppercase mono label for lesson tags, status, and difficulty meters.

```jsx
<Badge variant="ox">Lesson 04</Badge>
<Badge variant="ok">Mastered</Badge>
<Badge variant="ghost" level={2}>Intermediate</Badge>
```

Variants: `ink`, `ox`, `sage`, `straw`, `ghost`, `ok` (sage tint), `error` (oxblood tint). Pass `level={0..3}` to append a difficulty dot meter.
