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
  console.error("Usage: node scripts/type-qa-sample.mjs --file=<index.html> [--style=<style-id>] [--width=1280] [--height=720]");
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

function readProfile(style) {
  if (!style || !fs.existsSync(grammarPath)) return { profileId: null, profile: null };
  const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
  const profileId = grammar.styleProfileMap?.[style] || null;
  const defaults = grammar.globalDisciplineDefaults || {};
  const profile = profileId ? grammar.grammarProfiles?.[profileId] : null;
  if (!profile) return { profileId, profile: null };
  return {
    profileId,
    profile: {
      ...profile,
      typographyDiscipline: {
        ...(defaults.typographyDiscipline || {}),
        ...(profile.typographyDiscipline || {}),
        minFontPx: {
          ...(defaults.typographyDiscipline?.minFontPx || {}),
          ...(profile.typographyDiscipline?.minFontPx || {}),
        },
        maxFontPx: {
          ...(defaults.typographyDiscipline?.maxFontPx || {}),
          ...(profile.typographyDiscipline?.maxFontPx || {}),
        },
        maxLines: {
          ...(defaults.typographyDiscipline?.maxLines || {}),
          ...(profile.typographyDiscipline?.maxLines || {}),
        },
        minTailChars: {
          ...(defaults.typographyDiscipline?.minTailChars || {}),
          ...(profile.typographyDiscipline?.minTailChars || {}),
        },
      },
      tableDiscipline: {
        ...(defaults.tableDiscipline || {}),
        ...(profile.tableDiscipline || {}),
      },
      sourceDiscipline: {
        ...(defaults.sourceDiscipline || {}),
        ...(profile.sourceDiscipline || {}),
      },
    },
  };
}

function issueText(issue) {
  const box = issue.box ? ` box=${JSON.stringify(issue.box)}` : "";
  return `slide ${issue.slide}: ${issue.kind} ${issue.selector || ""}${issue.detail ? ` ${issue.detail}` : ""}${issue.text ? ` "${issue.text}"` : ""}${box}`;
}

const fallbackTypography = {
  minFontPx: { coverTitle: 48, title: 30, body: 16, denseBody: 14, tableBody: 12, source: 9.5, monoLabel: 10 },
  maxFontPx: { coverTitle: 96, title: 68, body: 30, tableBody: 19 },
  maxLines: { coverTitle: 3, title: 3, denseTitle: 2, body: 5, source: 2, tableCell: 3 },
  minTailChars: { cjk: 4, latin: 8 },
  requireConstrainedTitleWidth: true,
  requireBalancedTitleWrap: true,
  cjkLineBreak: "strict",
  forbidMacOnlyFontDependency: true,
};
const fallbackTable = { maxRows: 7, maxColumns: 6, minRowHeight: 28, minCellPaddingX: 8, maxCellLines: 3 };
const fallbackSource = { maxLines: 2, minFontPx: 9.5, maxChars: 150 };

const { profileId, profile } = readProfile(styleId);
const typography = { ...fallbackTypography, ...(profile?.typographyDiscipline || {}) };
typography.minFontPx = { ...fallbackTypography.minFontPx, ...(profile?.typographyDiscipline?.minFontPx || {}) };
typography.maxFontPx = { ...fallbackTypography.maxFontPx, ...(profile?.typographyDiscipline?.maxFontPx || {}) };
typography.maxLines = { ...fallbackTypography.maxLines, ...(profile?.typographyDiscipline?.maxLines || {}) };
typography.minTailChars = { ...fallbackTypography.minTailChars, ...(profile?.typographyDiscipline?.minTailChars || {}) };
const tableDiscipline = { ...fallbackTable, ...(profile?.tableDiscipline || {}) };
const sourceDiscipline = { ...fallbackSource, ...(profile?.sourceDiscipline || {}) };

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
  console.error("Type QA failed: no .slide elements found.");
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
  const slideIssues = await page.evaluate(({ slideIndex, typography, tableDiscipline, sourceDiscipline }) => {
    const active = document.querySelector(".slide[data-qa-active]");
    const results = [];
    if (!active) return [{ slide: slideIndex + 1, kind: "missing-active-slide" }];
    const role = active.getAttribute("data-slide-role") || "";
    const badLineStart = /^[，。、；：？！）】》」』”’%‰]/;
    const badLineEnd = /[（【《「『“‘]$/;
    const cjk = /[\u3400-\u9fff]/;
    const latin = /[A-Za-z0-9]/;
    const macOnlyFonts = ["PingFang", "SF Pro", "Hiragino", "Heiti SC", "Songti SC"];

    function selectorFor(node) {
      if (node.id) return `#${node.id}`;
      if (node.className && typeof node.className === "string") {
        const cls = node.className.trim().split(/\s+/).slice(0, 3).join(".");
        if (cls) return `${node.tagName.toLowerCase()}.${cls}`;
      }
      return node.tagName.toLowerCase();
    }

    function visible(node) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      const box = node.getBoundingClientRect();
      return box.width > 1 && box.height > 1;
    }

    function textOf(node) {
      return (node.textContent || "").replace(/\s+/g, " ").trim();
    }

    function fontPx(node) {
      return Number.parseFloat(getComputedStyle(node).fontSize) || 0;
    }

    function lineHeightPx(node) {
      const style = getComputedStyle(node);
      const raw = style.lineHeight;
      if (raw === "normal") return fontPx(node) * 1.2;
      return Number.parseFloat(raw) || fontPx(node) * 1.2;
    }

    function lineCount(node) {
      if (node.matches("td,th")) {
        const textRects = textLines(node).length;
        if (textRects) return textRects;
      }
      const box = node.getBoundingClientRect();
      const lh = lineHeightPx(node);
      if (!lh) return 1;
      return Math.max(1, Math.round(box.height / lh));
    }

    function textLines(node) {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
        acceptNode(textNode) {
          return textNode.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const lines = [];
      let current;
      while ((current = walker.nextNode())) {
        const range = document.createRange();
        range.selectNodeContents(current);
        const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
        const chars = [...current.nodeValue];
        if (!chars.length || !rects.length) continue;
        for (const rect of rects) {
          const charsInLine = [];
          for (let i = 0; i < chars.length; i += 1) {
            const charRange = document.createRange();
            charRange.setStart(current, i);
            charRange.setEnd(current, i + 1);
            const charRect = charRange.getBoundingClientRect();
            if (charRect.width > 0 && charRect.height > 0) {
              const cy = charRect.top + charRect.height / 2;
              if (cy >= rect.top - 1 && cy <= rect.bottom + 1) charsInLine.push(chars[i]);
            }
          }
          const value = charsInLine.join("").replace(/\s+/g, " ").trim();
          if (value) lines.push(value);
        }
      }
      if (!lines.length) return textOf(node).split(/\n+/).map((line) => line.trim()).filter(Boolean);
      return [...new Set(lines)];
    }

    function isHeading(node) {
      return /^(H1|H2)$/.test(node.tagName)
        || node.matches(".title,.cover-title,[data-type-role='title']");
    }

    function titleRole(node) {
      if (node.tagName === "H1" && role === "title") return "coverTitle";
      return "title";
    }

    const nodes = [...active.querySelectorAll("h1,h2,h3,p,li,td,th,.title,.cover-title,.lead,.body,.copy,.module-copy,.row-copy,.source-note,.caption,.eyebrow,.kicker,.folio,[data-type-role],[data-component-role='source-note']")]
      .filter(visible);

    for (const node of nodes) {
      const selector = selectorFor(node);
      const txt = textOf(node);
      if (!txt) continue;
      const size = fontPx(node);
      const lines = lineCount(node);
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const family = style.fontFamily || "";

      if (typography.forbidMacOnlyFontDependency) {
        const familyLower = family.toLowerCase();
        const usesMac = macOnlyFonts.some((font) => familyLower.includes(font.toLowerCase()));
        const hasWin = /segoe|aptos|microsoft yahei|simsun|arial|georgia|times new roman|cascadia|consolas|courier/i.test(family);
        if (usesMac && !hasWin) {
          results.push({ slide: slideIndex + 1, kind: "mac-only-font-stack", selector, detail: family, text: txt.slice(0, 80) });
        }
      }

      if (isHeading(node)) {
        const roleKey = titleRole(node);
        const min = typography.minFontPx?.[roleKey] ?? typography.minFontPx?.title ?? 30;
        const max = typography.maxFontPx?.[roleKey] ?? typography.maxFontPx?.title ?? 96;
        const maxLines = role === "dense"
          ? (typography.maxLines?.denseTitle ?? typography.maxLines?.title ?? 2)
          : (typography.maxLines?.[roleKey] ?? typography.maxLines?.title ?? 3);
        if (size < min) results.push({ slide: slideIndex + 1, kind: "heading-font-too-small", selector, detail: `${size.toFixed(1)}px < ${min}px`, text: txt.slice(0, 80) });
        if (size > max) results.push({ slide: slideIndex + 1, kind: "heading-font-too-large", selector, detail: `${size.toFixed(1)}px > ${max}px`, text: txt.slice(0, 80) });
        if (lines > maxLines) results.push({ slide: slideIndex + 1, kind: "heading-too-many-lines", selector, detail: `${lines} lines > ${maxLines}`, text: txt.slice(0, 80), box: { width: Number(box.width.toFixed(1)), height: Number(box.height.toFixed(1)) } });
        if (typography.requireConstrainedTitleWidth && box.width > active.getBoundingClientRect().width - 180 && txt.length > 14) {
          results.push({ slide: slideIndex + 1, kind: "heading-width-unconstrained", selector, detail: `width=${box.width.toFixed(1)}px`, text: txt.slice(0, 80) });
        }
        const wrap = style.textWrap || style.textWrapMode || "";
        if (typography.requireBalancedTitleWrap && lines > 1 && !/balance|pretty/i.test(wrap)) {
          results.push({ slide: slideIndex + 1, kind: "heading-wrap-not-balanced", selector, detail: `text-wrap=${wrap || "normal"}`, text: txt.slice(0, 80) });
        }
        const renderedLines = textLines(node);
        for (const line of renderedLines) {
          if (typography.cjkLineBreak === "strict" && cjk.test(line)) {
            if (badLineStart.test(line)) results.push({ slide: slideIndex + 1, kind: "cjk-bad-line-start", selector, text: line.slice(0, 40) });
            if (badLineEnd.test(line)) results.push({ slide: slideIndex + 1, kind: "cjk-bad-line-end", selector, text: line.slice(0, 40) });
          }
        }
        const tail = renderedLines[renderedLines.length - 1] || "";
        if (renderedLines.length > 1) {
          const compact = tail.replace(/[，。、；：？！）】》」』”’%‰\s]/g, "");
          const minTail = cjk.test(tail) ? (typography.minTailChars?.cjk || 4) : latin.test(tail) ? (typography.minTailChars?.latin || 8) : 0;
          if (minTail && compact.length < minTail) {
            results.push({ slide: slideIndex + 1, kind: "heading-tail-too-short", selector, detail: `${compact.length} chars < ${minTail}`, text: tail.slice(0, 40) });
          }
        }
      } else if (node.matches("td,th")) {
        const min = typography.minFontPx?.tableBody ?? 12;
        if (size < min) results.push({ slide: slideIndex + 1, kind: "table-font-too-small", selector, detail: `${size.toFixed(1)}px < ${min}px`, text: txt.slice(0, 80) });
        const maxCellLines = tableDiscipline.maxCellLines ?? typography.maxLines?.tableCell ?? 3;
        if (lines > maxCellLines) results.push({ slide: slideIndex + 1, kind: "table-cell-too-many-lines", selector, detail: `${lines} lines > ${maxCellLines}`, text: txt.slice(0, 80) });
      } else if (node.matches(".source-note,.caption,.folio,[data-component-role='source-note']")) {
        const min = sourceDiscipline.minFontPx ?? typography.minFontPx?.source ?? 9.5;
        if (size < min) results.push({ slide: slideIndex + 1, kind: "source-font-too-small", selector, detail: `${size.toFixed(1)}px < ${min}px`, text: txt.slice(0, 80) });
        const maxSourceLines = sourceDiscipline.maxLines ?? typography.maxLines?.source ?? 2;
        if (lines > maxSourceLines) results.push({ slide: slideIndex + 1, kind: "source-too-many-lines", selector, detail: `${lines} lines > ${maxSourceLines}`, text: txt.slice(0, 80) });
        if (sourceDiscipline.maxChars && txt.length > sourceDiscipline.maxChars) {
          results.push({ slide: slideIndex + 1, kind: "source-too-long", selector, detail: `${txt.length} chars > ${sourceDiscipline.maxChars}`, text: txt.slice(0, 80) });
        }
      } else {
        const inDenseComponent = Boolean(node.closest("td,th,table,[data-component-role='evidence-cell'],[data-component-role='terminal-pane'],[data-component-role='instrument-panel']"));
        const isCompactCopy = node.matches(".module-copy,.row-copy,.caption,.eyebrow,.kicker,.folio");
        const min = (role === "dense" || inDenseComponent || isCompactCopy)
          ? (typography.minFontPx?.denseBody ?? 14)
          : (typography.minFontPx?.body ?? 16);
        if (size < min && !node.matches(".eyebrow,.kicker,.folio")) {
          results.push({ slide: slideIndex + 1, kind: "body-font-too-small", selector, detail: `${size.toFixed(1)}px < ${min}px`, text: txt.slice(0, 80) });
        }
        const maxBodyLines = typography.maxLines?.body ?? 5;
        if (lines > maxBodyLines && node.matches("p,li,.lead,.body,.copy,.module-copy,.row-copy")) {
          results.push({ slide: slideIndex + 1, kind: "body-too-many-lines", selector, detail: `${lines} lines > ${maxBodyLines}`, text: txt.slice(0, 80) });
        }
      }
    }

    for (const table of [...active.querySelectorAll("table")]) {
      if (!visible(table)) continue;
      const rows = table.querySelectorAll("tbody tr").length || table.querySelectorAll("tr").length;
      const firstRow = table.querySelector("tr");
      const cols = firstRow ? firstRow.children.length : 0;
      if (rows > (tableDiscipline.maxRows || 7)) {
        results.push({ slide: slideIndex + 1, kind: "table-too-many-rows", selector: selectorFor(table), detail: `${rows} rows > ${tableDiscipline.maxRows}` });
      }
      if (cols > (tableDiscipline.maxColumns || 6)) {
        results.push({ slide: slideIndex + 1, kind: "table-too-many-columns", selector: selectorFor(table), detail: `${cols} columns > ${tableDiscipline.maxColumns}` });
      }
      for (const row of [...table.querySelectorAll("tr")]) {
        const box = row.getBoundingClientRect();
        if (box.height > 1 && box.height < (tableDiscipline.minRowHeight || 28)) {
          results.push({ slide: slideIndex + 1, kind: "table-row-too-short", selector: selectorFor(row), detail: `${box.height.toFixed(1)}px < ${tableDiscipline.minRowHeight}px` });
        }
      }
      for (const cell of [...table.querySelectorAll("td,th")]) {
        const cs = getComputedStyle(cell);
        const padX = Number.parseFloat(cs.paddingLeft) + Number.parseFloat(cs.paddingRight);
        if (padX < (tableDiscipline.minCellPaddingX || 8) * 2) {
          results.push({ slide: slideIndex + 1, kind: "table-cell-padding-too-tight", selector: selectorFor(cell), detail: `${padX.toFixed(1)}px total horizontal padding` });
        }
      }
    }

    return results;
  }, { slideIndex: index, typography, tableDiscipline, sourceDiscipline });

  issues.push(...slideIssues);
}

await browser.close();

if (issues.length) {
  console.error(`Type QA failed: ${issues.length} issue(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}.`);
  for (const issue of issues.slice(0, maxIssues)) console.error(`- ${issueText(issue)}`);
  process.exit(1);
}

console.log(`Type QA passed: ${slideCount} slide(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}.`);
