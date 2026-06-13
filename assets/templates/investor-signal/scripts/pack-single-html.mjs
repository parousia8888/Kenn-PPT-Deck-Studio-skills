#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const input = path.resolve(root, args.get("input") || "ui_kits/pitch-deck/index.html");
const output = path.resolve(root, args.get("output") || "dist/investor-signal-pitch-deck.single.html");
const fontMode = args.get("font-mode") || "online";
const seenCss = new Set();

if (!["online", "system"].includes(fontMode)) {
  throw new Error("--font-mode must be online or system");
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".woff") return "font/woff";
  if (ext === ".woff2") return "font/woff2";
  return "application/octet-stream";
}

function inlineUrlRefs(css, fromFile) {
  return css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (whole, quote, rawUrl) => {
    if (/^(data:|https?:|#)/i.test(rawUrl)) return whole;
    const assetPath = path.resolve(path.dirname(fromFile), rawUrl);
    if (!fs.existsSync(assetPath)) return whole;
    const data = fs.readFileSync(assetPath);
    const encoded = data.toString("base64");
    return `url("data:${mimeFor(assetPath)};base64,${encoded}")`;
  });
}

function inlineCssFile(file) {
  const real = path.resolve(file);
  if (seenCss.has(real)) return "";
  seenCss.add(real);

  let css = readText(real);
  css = css.replace(/@import\s+url\((['"]?)([^)'"]+)\1\)\s*;/g, (whole, quote, href) => {
    if (/^https?:/i.test(href)) return fontMode === "online" ? whole : "";
    const imported = path.resolve(path.dirname(real), href);
    return inlineCssFile(imported);
  });
  css = inlineUrlRefs(css, real);
  return `\n/* ===== Inlined from ${path.relative(root, real)} ===== */\n${css}\n`;
}

function inlineStylesheets(html, htmlFile) {
  return html.replace(/<link\s+([^>]*?)rel=(["'])stylesheet\2([^>]*?)>/gi, (whole, before, quote, after) => {
    const hrefMatch = `${before} ${after}`.match(/\bhref=(["'])([^"']+)\1/i);
    if (!hrefMatch) return whole;
    const href = hrefMatch[2];
    if (/^https?:/i.test(href)) return whole;
    const cssFile = path.resolve(path.dirname(htmlFile), href);
    const css = inlineCssFile(cssFile);
    return `<style data-inlined-from="${href}">${css}</style>`;
  });
}

function inlineScripts(html, htmlFile) {
  return html.replace(/<script\s+([^>]*?)src=(["'])([^"']+)\2([^>]*)><\/script>/gi, (whole, before, quote, src, after) => {
    if (/^https?:/i.test(src)) return whole;
    const jsFile = path.resolve(path.dirname(htmlFile), src);
    const js = readText(jsFile);
    return `<script data-inlined-from="${src}">\n${js}\n</script>`;
  });
}

let html = readText(input);
html = inlineStylesheets(html, input);
html = inlineScripts(html, input);
html = html.replace(
  "<html lang=\"en\">",
  `<html lang="en" data-packaged="single-html" data-font-mode="${fontMode}">`
);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, "utf8");

const stats = fs.statSync(output);
console.log(JSON.stringify({
  input: path.relative(root, input),
  output: path.relative(root, output),
  fontMode,
  bytes: stats.size,
}, null, 2));
