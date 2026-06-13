#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const slideFiles = [
  ["01-report-cover.html", "Report Cover"],
  ["02-executive-finding.html", "Executive Finding"],
  ["03-kpi-ledger.html", "KPI Ledger"],
  ["04-timeline.html", "Timeline"],
  ["05-before-after.html", "Before / After"],
  ["06-evidence-grid.html", "Evidence Grid"],
  ["07-case-study.html", "Case Study"],
  ["08-methodology.html", "Methodology"],
  ["09-risk-limitation.html", "Risk / Limitation"],
  ["10-next-actions.html", "Next Actions"],
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function extractAll(regex, html) {
  return [...html.matchAll(regex)].map((match) => match[1].trim()).filter(Boolean);
}

function extractSlide(html, source) {
  const start = html.search(/<div\s+class=(["'])slide atlas-stage\1/i);
  if (start < 0) throw new Error(`No .slide.atlas-stage found in ${source}`);

  let pos = start;
  let depth = 0;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  while (true) {
    const match = tagRe.exec(html);
    if (!match) throw new Error(`Could not close slide root in ${source}`);
    const tag = match[0];
    if (tag.startsWith("</")) depth -= 1;
    else depth += 1;
    pos = tagRe.lastIndex;
    if (depth === 0) return html.slice(start, pos);
  }
}

const styles = [];
const scripts = [];
const slides = [];

for (let i = 0; i < slideFiles.length; i += 1) {
  const [fileName, label] = slideFiles[i];
  const rel = `slides/${fileName}`;
  const source = path.join(root, "slides", fileName);
  const html = read(source);

  const localStyles = extractAll(/<style>([\s\S]*?)<\/style>/gi, html);
  localStyles.forEach((css) => styles.push(`/* ===== Slide-local styles from ${rel} ===== */\n${css}`));

  const localScripts = extractAll(/<script>([\s\S]*?)<\/script>/gi, html);
  localScripts.forEach((js) => scripts.push(`/* ===== Slide-local script from ${rel} ===== */\n${js}`));

  const slide = extractSlide(html, rel)
    .replace(/\sdata-autoplay\b/g, "")
    .replace(/\sdata-stage\b/g, ' data-stage data-screen-label="' + String(i + 1).padStart(2, "0") + '" data-slide-title="' + label + '"');

  slides.push(`      <!-- ${String(i + 1).padStart(2, "0")} · ${label} -->\n      ${slide.split("\n").join("\n      ")}`);
}

const output = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Proof Atlas — Full Evidence Deck</title>
<link rel="stylesheet" href="../../styles.css">
<link rel="stylesheet" href="../../assets/atlas-anim.css">
<link rel="stylesheet" href="../../slides/slide-base.css">
<style>
  html, body { margin: 0; width: 100%; height: 100%; background: #17150f; overflow: hidden; }
  body { display: block; min-height: 100vh; }
  .deck-shell { position: fixed; inset: 0; display: grid; place-items: center; overflow: hidden; background: #17150f; }
  .deck-canvas { width: 1280px; height: 720px; position: relative; transform-origin: center center; }
  .deck-canvas > .slide { position: absolute; inset: 0; box-shadow: 0 30px 90px rgba(0,0,0,0.35); }
  .deck-canvas:not(.deck-ready) > .slide ~ .slide { display: none; }
  .deck-nav { position: fixed; right: 18px; bottom: 16px; z-index: 80; display: flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--gray-3); }
  .deck-nav button { width: 34px; height: 34px; border: 1px solid var(--rule); background: var(--paper-pure);
    color: var(--ink); border-radius: var(--r-1); cursor: pointer; font: inherit; display: grid; place-items: center; }
  .deck-nav button:hover { border-color: var(--blue); color: var(--blue); }
  .deck-nav .count { min-width: 58px; text-align: center; }
  @media print {
    @page { size: 1280px 720px; margin: 0; }
    html, body { background: #fff; overflow: visible; }
    .deck-shell { position: static; display: block; background: #fff; }
    .deck-canvas { transform: none !important; width: 1280px; height: auto; }
    .deck-canvas > .slide { display: block !important; position: relative !important; page-break-after: always; box-shadow: none; }
    .deck-nav, .atlas-lowpower-hint { display: none !important; }
  }
${styles.join("\n\n")}
</style>
</head>
<body>
  <div class="deck-shell">
    <div class="deck-canvas" data-deck>
${slides.join("\n\n")}
    </div>
  </div>

  <script src="../../assets/atlas-motion.js"></script>
  <script>
${scripts.join("\n\n")}
  </script>
  <script>
    (function () {
      "use strict";
      var canvas = document.querySelector(".deck-canvas");
      var slides = Array.prototype.slice.call(document.querySelectorAll(".deck-canvas > .slide"));
      var index = 0;

      function fit() {
        var scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
        canvas.style.transform = "scale(" + scale + ")";
      }

      function buildNav() {
        var nav = document.createElement("div");
        nav.className = "deck-nav";
        nav.innerHTML = '<button data-prev aria-label="Previous">&#8249;</button><span class="count"></span><button data-next aria-label="Next">&#8250;</button>';
        document.body.appendChild(nav);
        nav.querySelector("[data-prev]").addEventListener("click", prev);
        nav.querySelector("[data-next]").addEventListener("click", next);
        return nav;
      }

      var nav = buildNav();
      function updateNav() {
        nav.querySelector(".count").textContent = String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      }

      function setBgLoops() {
        var loops = window.AtlasMotion && window.AtlasMotion.loops;
        if (!loops) return;
        loops.forEach(function (loop) {
          if (loop.host === slides[index] && !document.body.classList.contains("low-power")) {
            loop.resize();
            loop.startLoop();
          }
          else loop.stop();
        });
      }

      function go(nextIndex) {
        index = Math.max(0, Math.min(slides.length - 1, nextIndex));
        slides.forEach(function (slide, i) {
          var active = i === index;
          slide.style.display = active ? "" : "none";
          slide.toggleAttribute("data-deck-active", active);
          slide.setAttribute("aria-hidden", active ? "false" : "true");
          if (window.AtlasMotion) window.AtlasMotion.reset(slide);
        });
        updateNav();
        setBgLoops();
        if (window.AtlasMotion) window.AtlasMotion.play(slides[index]);
      }

      function next() { go(index + 1); }
      function prev() { go(index - 1); }

      document.addEventListener("keydown", function (e) {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        var key = e.key.toLowerCase();
        if (document.body.classList.contains("low-power")) {
          if (key === "b" && window.AtlasMotion) setTimeout(setBgLoops, 40);
          return;
        }
        if (key === "arrowright" || key === " " || key === "pagedown") { e.preventDefault(); next(); }
        else if (key === "arrowleft" || key === "pageup") { e.preventDefault(); prev(); }
        else if (key === "home") { e.preventDefault(); go(0); }
        else if (key === "end") { e.preventDefault(); go(slides.length - 1); }
        else if (key === "r" && window.AtlasMotion) { e.preventDefault(); window.AtlasMotion.reset(slides[index]); window.AtlasMotion.play(slides[index]); }
      });

      window.addEventListener("resize", fit);
      window.addEventListener("beforeprint", function () {
        slides.forEach(function (slide) { slide.style.display = ""; slide.setAttribute("data-deck-active", ""); });
      });
      window.addEventListener("afterprint", function () { go(index); });

      canvas.classList.add("deck-ready");
      fit();
      go(0);
      window.ProofAtlasDeck = { slides: slides, go: go, next: next, prev: prev, get index() { return index; } };
    })();
  </script>
</body>
</html>
`;

const outFile = path.join(root, "decks", "proof-atlas-full", "index.html");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, output, "utf8");

console.log(JSON.stringify({
  output: path.relative(root, outFile),
  slides: slides.length,
}, null, 2));
