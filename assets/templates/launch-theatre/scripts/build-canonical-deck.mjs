#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const source = path.join(root, "slides", "index.html");
let html = fs.readFileSync(source, "utf8");

html = html
  .replace("<title>Launch Theatre — Slide System</title>", "<title>Launch Theatre — Full Launch Deck</title>")
  .replace('href="../styles.css"', 'href="../../styles.css"')
  .replace('href="../motion/launch-theatre.css"', 'href="../../motion/launch-theatre.css"')
  .replace('href="slides.css"', 'href="../../slides/slides.css"')
  .replace('src="../motion/launch-theatre.js"', 'src="../../motion/launch-theatre.js"')
  .replace('src="deck-stage.js"', 'src="../../slides/deck-stage.js"')
  .replace("<deck-stage>", '<deck-stage width="1920" height="1080" no-rail>')
  .replace(
    "</head>",
    `<style>
  deck-stage:not(:defined) { visibility: hidden; }
  deck-stage > section { background: var(--bg-stage); }
</style>
</head>`
  );

const outFile = path.join(root, "decks", "launch-theatre-full", "index.html");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html, "utf8");

console.log(JSON.stringify({
  input: path.relative(root, source),
  output: path.relative(root, outFile),
  slides: (html.match(/<section\b/g) || []).length,
}, null, 2));
