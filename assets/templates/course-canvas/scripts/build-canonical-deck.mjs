#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const slides = [
  ["01-course-cover.html", "lesson-cover", "Course Cover"],
  ["02-learning-objectives.html", "objective-list", "Learning Objectives"],
  ["03-concept-definition.html", "concept-definition", "Concept Definition"],
  ["04-knowledge-map.html", "knowledge-map", "Knowledge Map"],
  ["05-step-by-step.html", "step-explanation", "Step by Step"],
  ["06-case-breakdown.html", "case-breakdown", "Case Breakdown"],
  ["07-in-class-exercise.html", "exercise", "In-Class Exercise"],
  ["08-common-mistakes.html", "common-mistakes", "Common Mistakes"],
  ["09-recap-handout.html", "recap", "Recap"],
  ["10-homework-next.html", "homework-next", "Homework"],
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function extractStyle(html, source) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!match) return "";
  const css = match[1]
    .replace(/html,body\{[^}]*\}/g, "")
    .replace(/body\{[^}]*\}/g, "")
    .trim();
  if (!css) return "";
  return `\n/* ===== Slide-local styles from ${source} ===== */\n${css}\n`;
}

function extractSection(html, source) {
  const match = html.match(/<section\s+class=(["'])cc-slide[\s\S]*?<\/section>/i);
  if (!match) {
    throw new Error(`No .cc-slide section found in ${source}`);
  }
  return match[0]
    .replace(/\scc-reveal-on\b/g, "")
    .replace(/\sdata-screen-label=(["']).*?\1/i, "");
}

const styles = [];
const sections = [];

for (let i = 0; i < slides.length; i += 1) {
  const [fileName, recipe, label] = slides[i];
  const source = path.join(root, "slides", fileName);
  const html = read(source);
  const style = extractStyle(html, `slides/${fileName}`);
  if (style) styles.push(style);
  const section = extractSection(html, `slides/${fileName}`);
  sections.push(`  <!-- ${String(i + 1).padStart(2, "0")} · ${label} -->\n  <section data-recipe="${recipe}" data-label="${label}">\n${section.split("\n").map((line) => `    ${line}`).join("\n")}\n  </section>`);
}

const output = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course Canvas — Full Teaching Deck</title>
<link rel="stylesheet" href="../../styles.css">
<link rel="stylesheet" href="../../slides/deck.css">
<style>
  html, body { margin: 0; background: #211D18; }
  deck-stage:not(:defined) { visibility: hidden; }
  deck-stage section { background: #211D18; }
  .cc-slide { box-shadow: none; }
${styles.join("\n")}
</style>
</head>
<body>
<deck-stage width="1280" height="720" no-rail>

${sections.join("\n\n")}

</deck-stage>

<script src="../deck-stage.js"></script>
<script src="../../slides/cc-bg.js"></script>
<script src="../../slides/cc-motion.js"></script>
</body>
</html>
`;

const outFile = path.join(root, "decks", "course-canvas-full", "index.html");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, output, "utf8");

console.log(JSON.stringify({
  output: path.relative(root, outFile),
  slides: slides.length,
}, null, 2));
