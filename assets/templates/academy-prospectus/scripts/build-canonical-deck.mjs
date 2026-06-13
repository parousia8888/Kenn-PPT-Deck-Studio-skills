#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const source = path.join(root, "templates", "prospectus-deck", "index.html");
const output = path.join(root, "decks", "academy-prospectus-full", "index.html");

let html = fs.readFileSync(source, "utf8");

html = html.replace(
  /\n<!-- React UMD before ds-base\.js[\s\S]*?<!-- Slide system: layouts \+ motion engine -->\n<link rel="stylesheet" href="\.\.\/\.\.\/slides\/prospectus-slides\.css">/,
  `
<!-- Academy Prospectus canonical deck: static HTML, no React runtime needed. -->
<link rel="stylesheet" href="../../styles.css">
<link rel="stylesheet" href="../../slides/prospectus-slides.css">`
);

html = html.replace(
  /<title>Academy Prospectus — Linden Academy<\/title>/,
  "<title>Academy Prospectus — Full Deck</title>"
);

html = html.replace(
  "<!-- Motion engine: paper background, semantic slide-enter, B = low-power -->",
  "<!-- Motion engine: paper background, semantic slide-enter, B = low-power, R = replay -->"
);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, "utf8");

console.log(JSON.stringify({
  input: path.relative(root, source),
  output: path.relative(root, output),
  slides: (html.match(/<section class="slide/g) || []).length,
}, null, 2));
