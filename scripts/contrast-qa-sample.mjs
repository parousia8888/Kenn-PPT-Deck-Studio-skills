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
const maxIssues = Number(args.get("max-issues") || 120);
const explicitBrowser = args.get("browser");

if (!file) {
  console.error("Usage: node scripts/contrast-qa-sample.mjs --file=<index.html> [--style=<style-id>] [--width=1280] [--height=720]");
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

function readContrast(style) {
  const fallback = { normalText: 4.5, largeText: 3, nonText: 3, ignoreOpacityBelow: 0.08 };
  if (!style || !fs.existsSync(grammarPath)) return { profileId: null, contrast: fallback };
  const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
  const profileId = grammar.styleProfileMap?.[style] || null;
  const profile = profileId ? grammar.grammarProfiles?.[profileId] : null;
  return {
    profileId,
    contrast: {
      ...fallback,
      ...(grammar.globalDisciplineDefaults?.contrastDiscipline || {}),
      ...(profile?.contrastDiscipline || {}),
    },
  };
}

function issueText(issue) {
  return `slide ${issue.slide}: ${issue.kind} ${issue.selector || ""}${issue.detail ? ` ${issue.detail}` : ""}${issue.text ? ` "${issue.text}"` : ""}`;
}

const { profileId, contrast } = readContrast(styleId);
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
  console.error("Contrast QA failed: no .slide elements found.");
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

  await page.waitForTimeout(160);
  const slideIssues = await page.evaluate(({ slideIndex, contrast }) => {
    const active = document.querySelector(".slide[data-qa-active]");
    const results = [];
    if (!active) return [{ slide: slideIndex + 1, kind: "missing-active-slide" }];

    function selectorFor(node) {
      if (node.id) return `#${node.id}`;
      if (node.className && typeof node.className === "string") {
        const cls = node.className.trim().split(/\s+/).slice(0, 3).join(".");
        if (cls) return `${node.tagName.toLowerCase()}.${cls}`;
      }
      return node.tagName.toLowerCase();
    }

    function parseColor(value) {
      if (!value || value === "transparent") return null;
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
      if (parts.length < 3) return null;
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length >= 4 ? parts[3] : 1 };
    }

    function blend(fg, bg) {
      const a = fg.a + bg.a * (1 - fg.a);
      if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
        a,
      };
    }

    function relLum(color) {
      function channel(v) {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      }
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    }

    function ratio(a, b) {
      const l1 = relLum(a);
      const l2 = relLum(b);
      const light = Math.max(l1, l2);
      const dark = Math.min(l1, l2);
      return (light + 0.05) / (dark + 0.05);
    }

    function effectiveBackground(node) {
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      const chain = [];
      let current = node;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        chain.push(current);
        current = current.parentElement;
      }
      chain.reverse();
      for (const el of chain) {
        const style = getComputedStyle(el);
        const color = parseColor(style.backgroundColor);
        if (color && color.a > 0) bg = blend(color, bg);
      }
      return bg;
    }

    function textOf(node) {
      return (node.textContent || "").replace(/\s+/g, " ").trim();
    }

    function isVisibleText(node) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (Number(style.opacity) < (contrast.ignoreOpacityBelow ?? 0.08)) return false;
      const box = node.getBoundingClientRect();
      return box.width > 1 && box.height > 1 && textOf(node).length > 0;
    }

    const candidates = [...active.querySelectorAll("h1,h2,h3,p,li,td,th,span,small,strong,em,div,a,button")]
      .filter(isVisibleText)
      .filter((node) => {
        const childrenWithText = [...node.children].filter((child) => textOf(child).length > 0);
        return childrenWithText.length === 0 || /^(H1|H2|H3|P|LI|TD|TH|BUTTON|A|SMALL|SPAN|STRONG|EM)$/.test(node.tagName);
      });

    for (const node of candidates) {
      const style = getComputedStyle(node);
      const fg = parseColor(style.color);
      if (!fg || fg.a < (contrast.ignoreOpacityBelow ?? 0.08)) continue;
      const bg = effectiveBackground(node);
      const effectiveFg = fg.a < 1 ? blend(fg, bg) : fg;
      const value = ratio(effectiveFg, bg);
      const fontSize = Number.parseFloat(style.fontSize) || 0;
      const weight = Number.parseFloat(style.fontWeight) || 400;
      const large = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
      const required = large ? (contrast.largeText ?? 3) : (contrast.normalText ?? 4.5);
      if (value + 0.01 < required) {
        results.push({
          slide: slideIndex + 1,
          kind: large ? "large-text-low-contrast" : "text-low-contrast",
          selector: selectorFor(node),
          detail: `${value.toFixed(2)} < ${required} fg=${style.color} bg=rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}) font=${fontSize.toFixed(1)}px/${weight}`,
          text: textOf(node).slice(0, 80),
        });
      }
    }

    return results;
  }, { slideIndex: index, contrast });
  issues.push(...slideIssues);
}

await browser.close();

if (issues.length) {
  console.error(`Contrast QA failed: ${issues.length} issue(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}.`);
  for (const issue of issues.slice(0, maxIssues)) console.error(`- ${issueText(issue)}`);
  process.exit(1);
}

console.log(`Contrast QA passed: ${slideCount} slide(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}.`);
