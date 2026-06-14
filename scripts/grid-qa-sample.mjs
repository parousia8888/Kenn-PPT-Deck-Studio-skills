#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const grammarPath = path.join(root, "assets", "style-systems", "execution-grammar.json");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const file = args.get("file") || process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const styleId = args.get("style");
const width = Number(args.get("width") || 1280);
const height = Number(args.get("height") || 720);
const tolerance = Number(args.get("tolerance") || 3);
const explicitBrowser = args.get("browser");

if (!file) {
  console.error("Usage: node scripts/grid-qa-sample.mjs --file=<index.html> [--style=<style-id>] [--width=1280] [--height=720]");
  process.exit(2);
}

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire("playwright");
  } catch (firstError) {
    const fallbackRoot = process.env.CODEX_PLAYWRIGHT_NODE_MODULES
      || "/Users/kenn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
    try {
      return createRequire(path.join(fallbackRoot, "package.json"))("playwright");
    } catch {
      throw firstError;
    }
  }
}

function findBrowserExecutable() {
  const candidates = [
    explicitBrowser,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function readGrammar(style) {
  if (!style || !fs.existsSync(grammarPath)) return { profileId: null, profile: null };
  const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
  const profileId = grammar.styleProfileMap?.[style] || null;
  return { profileId, profile: profileId ? grammar.grammarProfiles?.[profileId] : null };
}

function issueText(issue) {
  const box = issue.box ? ` box=${JSON.stringify(issue.box)}` : "";
  return `slide ${issue.slide}: ${issue.kind} ${issue.selector || ""}${issue.detail ? ` ${issue.detail}` : ""}${box}`;
}

const { profileId, profile } = readGrammar(styleId);
const requiredMode = profile?.gridDiscipline?.mode || "optional";
const requireGrid = ["strict", "measured"].includes(requiredMode);

const { chromium } = loadPlaywright();
const executablePath = findBrowserExecutable();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: "networkidle" });

const slideCount = await page.locator(".slide").count();
if (!slideCount) {
  await browser.close();
  console.error("Grid QA failed: no .slide elements found.");
  process.exit(1);
}

const issues = [];

for (let index = 0; index < slideCount; index += 1) {
  await page.evaluate((slideIndex) => {
    const slides = [...document.querySelectorAll(".slide")];
    slides.forEach((slide, current) => {
      slide.style.display = current === slideIndex ? "" : "none";
      slide.toggleAttribute("data-qa-active", current === slideIndex);
    });
    document.documentElement.style.width = "1280px";
    document.documentElement.style.height = "720px";
    document.body.style.width = "1280px";
    document.body.style.height = "720px";
    document.body.style.margin = "0";
    window.scrollTo(0, 0);
  }, index);

  await page.waitForTimeout(80);
  const slideIssues = await page.evaluate(({ slideIndex, requireGrid, requiredMode, tol }) => {
    const active = document.querySelector(".slide[data-qa-active]");
    const root = document.querySelector("[data-style-id]") || document.documentElement;
    const results = [];
    if (!active) return [{ slide: slideIndex + 1, kind: "missing-active-slide" }];

    function nearestDistanceInPage(value, lines) {
      if (!lines.length) return Infinity;
      return lines.reduce((best, line) => Math.min(best, Math.abs(value - line)), Infinity);
    }

    function numAttr(name, fallback = null) {
      const raw = active.getAttribute(name) || root.getAttribute(name);
      if (raw == null || raw === "") return fallback;
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    }

    function cssPx(name, fallback = null) {
      const raw = getComputedStyle(root).getPropertyValue(name).trim()
        || getComputedStyle(active).getPropertyValue(name).trim();
      if (!raw) return fallback;
      const n = Number(raw.replace("px", ""));
      return Number.isFinite(n) ? n : fallback;
    }

    const cols = numAttr("data-grid-cols", Number(getComputedStyle(root).getPropertyValue("--grid-cols").trim()) || null);
    const baseline = numAttr("data-grid-baseline", cssPx("--grid-baseline", null));
    const gutter = numAttr("data-grid-gutter", cssPx("--grid-gutter", null));
    const marginX = numAttr("data-grid-margin-x", cssPx("--grid-margin-x", null));
    const marginY = numAttr("data-grid-margin-y", cssPx("--grid-margin-y", null));
    const gridMode = active.getAttribute("data-grid-mode") || root.getAttribute("data-grid-mode") || requiredMode;

    if (requireGrid) {
      for (const [key, value] of Object.entries({ cols, baseline, gutter, marginX, marginY })) {
        if (!Number.isFinite(value) || value <= 0) {
          results.push({ slide: slideIndex + 1, kind: "missing-grid-token", selector: ".slide", detail: key });
        }
      }
    }

    if (!Number.isFinite(cols) || !Number.isFinite(gutter) || !Number.isFinite(marginX)) return results;

    const slideBox = active.getBoundingClientRect();
    const innerLeft = slideBox.left + marginX;
    const innerRight = slideBox.right - marginX;
    const innerWidth = innerRight - innerLeft;
    const colWidth = (innerWidth - gutter * (cols - 1)) / cols;
    if (colWidth <= 0) {
      results.push({ slide: slideIndex + 1, kind: "invalid-grid-geometry", selector: ".slide", detail: `colWidth=${colWidth}` });
      return results;
    }

    const starts = [];
    const ends = [];
    for (let i = 0; i < cols; i += 1) {
      const start = innerLeft + i * (colWidth + gutter);
      starts.push(start);
      ends.push(start + colWidth);
    }

    const bands = [...active.querySelectorAll("[data-grid-band]")];
    if (requireGrid && !bands.length) {
      results.push({ slide: slideIndex + 1, kind: "missing-grid-band", selector: ".slide", detail: "strict/measured profile needs auditable data-grid-band regions" });
    }

    for (const band of bands) {
      const box = band.getBoundingClientRect();
      const selector = band.className && typeof band.className === "string"
        ? `${band.tagName.toLowerCase()}.${band.className.trim().split(/\s+/).slice(0, 3).join(".")}`
        : band.tagName.toLowerCase();
      const leftErr = nearestDistanceInPage(box.left, starts);
      const rightErr = nearestDistanceInPage(box.right, ends);
      if (leftErr > tol || rightErr > tol) {
        results.push({
          slide: slideIndex + 1,
          kind: "grid-band-off-column",
          selector,
          detail: `leftErr=${leftErr.toFixed(2)} rightErr=${rightErr.toFixed(2)}`,
          box: {
            left: Number(box.left.toFixed(2)),
            right: Number(box.right.toFixed(2)),
            width: Number(box.width.toFixed(2)),
          },
        });
      }
    }

    if (Number.isFinite(baseline)) {
      const baselineNodes = [...active.querySelectorAll("[data-grid-baseline], h1, h2, h3, p, li, .kicker, .eyebrow, .caption, .folio")];
      const topBase = slideBox.top + (Number.isFinite(marginY) ? marginY : 0);
      for (const node of baselineNodes) {
        const style = getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const box = node.getBoundingClientRect();
        if (box.width <= 1 || box.height <= 1) continue;
        const offset = ((box.top - topBase) % baseline + baseline) % baseline;
        const err = Math.min(offset, baseline - offset);
        if (err > Math.max(tol, baseline / 2)) {
          const selector = node.className && typeof node.className === "string"
            ? `${node.tagName.toLowerCase()}.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}`
            : node.tagName.toLowerCase();
          results.push({
            slide: slideIndex + 1,
            kind: "baseline-off-grid",
            selector,
            detail: `err=${err.toFixed(2)} baseline=${baseline}`,
            box: { top: Number(box.top.toFixed(2)) },
          });
        }
      }
    }

    const overlay = active.querySelector("[data-grid-overlay], .grid-overlay, .guides");
    if (requireGrid && !overlay) {
      results.push({ slide: slideIndex + 1, kind: "missing-grid-overlay", selector: ".slide", detail: "strict/measured profile needs a debug overlay or same-box overlay hook" });
    }
    if (overlay) {
      const sameBox = overlay.getAttribute("data-grid-overlay") === "same-box" || overlay.closest(".slide") === active;
      if (!sameBox) {
        results.push({ slide: slideIndex + 1, kind: "grid-overlay-not-same-box", selector: ".grid-overlay" });
      }
    }

    if (requireGrid && gridMode === "optional") {
      results.push({ slide: slideIndex + 1, kind: "grid-mode-too-loose", selector: ".slide", detail: "profile requires strict/measured grid mode" });
    }

    return results;
  }, { slideIndex: index, requireGrid, requiredMode, tol: tolerance });

  issues.push(...slideIssues);
}

await browser.close();

if (issues.length) {
  console.error(`Grid QA failed: ${issues.length} issue(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}, mode ${requiredMode}.`);
  for (const issue of issues.slice(0, 100)) console.error(`- ${issueText(issue)}`);
  process.exit(1);
}

console.log(`Grid QA passed: ${slideCount} slide(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}, mode ${requiredMode}.`);
