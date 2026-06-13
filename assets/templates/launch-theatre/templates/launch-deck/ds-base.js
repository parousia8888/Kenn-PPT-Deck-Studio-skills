// templates/launch-deck/ds-base.js
// One line for the consumer: <script src="./ds-base.js"></script> (after React).
// Loads the Launch Theatre global CSS, the optical motion system, the slide
// layout CSS, and the compiled component bundle — then the deck shell + motion
// controller are pulled in by index.html.
(() => {
  const base = '../..'; // path from this template folder to the DS root
  const styles = [
    'styles.css',
    'motion/launch-theatre.css',
    'slides/slides.css',
  ];
  for (const p of styles) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src +
    ' — in a consuming project point `base` at the bound _ds/<folder> tree relative to this page; in the source design system this just means the bundle is not compiled yet.');
  document.head.appendChild(s);
})();
