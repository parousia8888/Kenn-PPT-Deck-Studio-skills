// templates/prospectus-deck/ds-base.js
// One file, one line for consumers: loads the Academy Prospectus design system
// (global tokens + the compiled component bundle) relative to this template.
(() => {
  const base = '../..';                 // project root, relative to this template folder
  for (const p of ['styles.css']) {     // this DS's global stylesheet(s)
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error(
    'ds-base.js: failed to load ' + s.src +
    ' — in a consuming project point the `base` line at the bound _ds/<folder> tree ' +
    'relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); ' +
    'in a fresh design system this just means the bundle is not compiled yet.'
  );
  document.head.appendChild(s);
})();
