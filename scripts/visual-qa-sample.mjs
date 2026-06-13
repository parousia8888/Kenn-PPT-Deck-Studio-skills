#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const file = args.get("file") || process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const outDir = path.resolve(args.get("out") || path.join(root, "_visual_qa"));
const width = Number(args.get("width") || 1280);
const height = Number(args.get("height") || 720);
const tolerance = Number(args.get("tolerance") || 2);
const maxIssues = Number(args.get("max-issues") || 80);
const explicitBrowser = args.get("browser");

if (!file) {
  console.error("Usage: node scripts/visual-qa-sample.mjs --file=<index.html> [--out=<dir>] [--width=1280] [--height=720]");
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

function issueText(issue) {
  const box = issue.box ? ` box=${JSON.stringify(issue.box)}` : "";
  return `slide ${issue.slide}: ${issue.kind} ${issue.selector || ""}${issue.text ? ` "${issue.text}"` : ""}${box}`;
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

fs.mkdirSync(outDir, { recursive: true });

const { chromium } = loadPlaywright();
const executablePath = findBrowserExecutable();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const browserErrors = [];

page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(`console error: ${message.text()}`);
});

await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: "networkidle" });

const slideCount = await page.locator(".slide").count();
if (!slideCount) {
  await browser.close();
  console.error("Visual QA failed: no .slide elements found.");
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

  await page.waitForTimeout(100);
  await page.screenshot({
    path: path.join(outDir, `slide-${String(index + 1).padStart(2, "0")}.png`),
    fullPage: false,
  });

  const slideIssues = await page.evaluate(({ slideIndex, viewportWidth, viewportHeight, tol }) => {
    const active = document.querySelector(".slide[data-qa-active]");
    const results = [];
    if (!active) return [{ slide: slideIndex + 1, kind: "missing-active-slide" }];

    const slideBox = active.getBoundingClientRect();
    const slideBounds = {
      left: Number(slideBox.left.toFixed(2)),
      top: Number(slideBox.top.toFixed(2)),
      right: Number(slideBox.right.toFixed(2)),
      bottom: Number(slideBox.bottom.toFixed(2)),
      width: Number(slideBox.width.toFixed(2)),
      height: Number(slideBox.height.toFixed(2)),
    };

    if (Math.abs(slideBox.width - viewportWidth) > tol || Math.abs(slideBox.height - viewportHeight) > tol) {
      results.push({ slide: slideIndex + 1, kind: "slide-size-mismatch", selector: ".slide", box: slideBounds });
    }

    if (document.documentElement.scrollWidth > viewportWidth + tol || document.documentElement.scrollHeight > viewportHeight + tol) {
      results.push({
        slide: slideIndex + 1,
        kind: "document-scroll-overflow",
        selector: "html",
        box: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
      });
    }

    if (document.body.scrollWidth > viewportWidth + tol || document.body.scrollHeight > viewportHeight + tol) {
      results.push({
        slide: slideIndex + 1,
        kind: "body-scroll-overflow",
        selector: "body",
        box: {
          width: document.body.scrollWidth,
          height: document.body.scrollHeight,
        },
      });
    }

    if (active.scrollWidth > active.clientWidth + tol || active.scrollHeight > active.clientHeight + tol) {
      results.push({
        slide: slideIndex + 1,
        kind: "slide-scroll-overflow",
        selector: ".slide",
        box: {
          scrollWidth: active.scrollWidth,
          scrollHeight: active.scrollHeight,
          clientWidth: active.clientWidth,
          clientHeight: active.clientHeight,
        },
      });
    }

    const skipTags = new Set(["SCRIPT", "STYLE", "META", "LINK", "TITLE"]);
    const nodes = [...active.querySelectorAll("*")].filter((node) => {
      if (skipTags.has(node.tagName)) return false;
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      const box = node.getBoundingClientRect();
      return box.width > 1 && box.height > 1;
    });

    for (const node of nodes) {
      const box = node.getBoundingClientRect();
      const selector = node.id
        ? `#${node.id}`
        : node.className && typeof node.className === "string"
          ? `${node.tagName.toLowerCase()}.${node.className.trim().split(/\s+/).slice(0, 3).join(".")}`
          : node.tagName.toLowerCase();

      if (box.left < slideBox.left - tol || box.top < slideBox.top - tol || box.right > slideBox.right + tol || box.bottom > slideBox.bottom + tol) {
        results.push({
          slide: slideIndex + 1,
          kind: "element-outside-slide",
          selector,
          text: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          box: {
            left: Number(box.left.toFixed(2)),
            top: Number(box.top.toFixed(2)),
            right: Number(box.right.toFixed(2)),
            bottom: Number(box.bottom.toFixed(2)),
            width: Number(box.width.toFixed(2)),
            height: Number(box.height.toFixed(2)),
          },
        });
      }

      const style = window.getComputedStyle(node);
      if ((node.scrollWidth > node.clientWidth + tol || node.scrollHeight > node.clientHeight + tol) && style.overflow !== "visible") {
        results.push({
          slide: slideIndex + 1,
          kind: "element-scroll-overflow",
          selector,
          text: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          box: {
            scrollWidth: node.scrollWidth,
            scrollHeight: node.scrollHeight,
            clientWidth: node.clientWidth,
            clientHeight: node.clientHeight,
          },
        });
      }
    }

    return results;
  }, { slideIndex: index, viewportWidth: width, viewportHeight: height, tol: tolerance });

  issues.push(...slideIssues);
}

await browser.close();

const report = {
  file: path.resolve(file),
  outDir,
  viewport: { width, height },
  slideCount,
  issueCount: issues.length,
  issues: issues.slice(0, maxIssues),
  browserErrors,
};

fs.writeFileSync(path.join(outDir, "visual-qa-report.json"), JSON.stringify(report, null, 2));

if (issues.length || browserErrors.length) {
  console.error(`Visual QA failed: ${issues.length} layout issue(s), ${browserErrors.length} browser error(s).`);
  for (const issue of issues.slice(0, maxIssues)) console.error(`- ${issueText(issue)}`);
  for (const error of browserErrors) console.error(`- ${error}`);
  console.error(`Report: ${path.join(outDir, "visual-qa-report.json")}`);
  process.exit(1);
}

console.log(`Visual QA passed: ${slideCount} slide(s), ${width}x${height}, screenshots in ${outDir}.`);
