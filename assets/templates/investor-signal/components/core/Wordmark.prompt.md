The Investor Signal lockup — a sharp framed mark with an ascending accent tick.

```jsx
<Wordmark height={32} />                 {/* full lockup */}
<Wordmark variant="mark" height={40} />  {/* glyph only */}
```

- Inherits `currentColor` for the frame + wordmark; the tick is always `--accent`.
- Use the full lockup on title/ask slides, the mark in slide-corner chrome.
