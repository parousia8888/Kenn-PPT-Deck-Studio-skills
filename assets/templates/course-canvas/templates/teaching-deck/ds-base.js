// templates/teaching-deck/ds-base.js
// Loads the Course Canvas design system for a template page with one line
// of config. `base` points at the design-system root relative to this page.
(() => {
  const base = '../..';
  // global stylesheets (tokens + component CSS) and the deck-layout language
  for (const p of ['styles.css', 'slides/deck.css']) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  // compiled component bundle (exposes window.CourseCanvasDesignSystem_*)
  const bundle = document.createElement('script');
  bundle.src = base + '/_ds_bundle.js';
  bundle.onerror = () => console.error(
    'ds-base.js: failed to load ' + bundle.src +
    ' — in a consuming project point `base` at the bound _ds/<folder> tree ' +
    'relative to this page; in a fresh design system this just means the ' +
    'bundle is not compiled yet.'
  );
  document.head.appendChild(bundle);
  // animated paper background + reveal recipes
  for (const p of ['slides/cc-bg.js', 'slides/cc-motion.js']) {
    const s = document.createElement('script');
    s.src = base + '/' + p;
    document.head.appendChild(s);
  }
})();
