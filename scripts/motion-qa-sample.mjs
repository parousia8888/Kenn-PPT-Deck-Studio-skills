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
const outDir = path.resolve(args.get("out") || path.join(root, "_motion_qa"));
const styleId = args.get("style");
const width = Number(args.get("width") || 1280);
const height = Number(args.get("height") || 720);
const maxIssues = Number(args.get("max-issues") || 120);
const explicitBrowser = args.get("browser");

if (!file) {
  console.error("Usage: node scripts/motion-qa-sample.mjs --file=<index.html> [--style=<style-id>] [--out=<dir>] [--width=1280] [--height=720]");
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

function readMotion(style) {
  const fallback = { enabled: true, initialDelayMs: 120, settledDelayMs: 900, requireBMode: true, minVisibleTextNodes: 3, minVisibleTextOpacity: 0.35, blankPixelVarianceMin: 8 };
  if (!style || !fs.existsSync(grammarPath)) return { profileId: null, motion: fallback };
  const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
  const profileId = grammar.styleProfileMap?.[style] || null;
  const profile = profileId ? grammar.grammarProfiles?.[profileId] : null;
  return {
    profileId,
    motion: {
      ...fallback,
      ...(grammar.globalDisciplineDefaults?.motionSnapshotDiscipline || {}),
      ...(profile?.motionSnapshotDiscipline || {}),
    },
  };
}

function issueText(issue) {
  return `slide ${issue.slide}: ${issue.kind} ${issue.selector || ""}${issue.detail ? ` ${issue.detail}` : ""}${issue.text ? ` "${issue.text}"` : ""}`;
}

fs.mkdirSync(outDir, { recursive: true });

const { profileId, motion } = readMotion(styleId);
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
  console.error("Motion QA failed: no .slide elements found.");
  process.exit(1);
}

const issues = [];
const report = [];

async function activateSlide(index, staticMode = false) {
  await page.evaluate(({ slideIndex, staticMode }) => {
    const slides = [...document.querySelectorAll(".slide")];
    slides.forEach((slide, current) => {
      slide.style.display = current === slideIndex ? "" : "none";
      slide.toggleAttribute("data-qa-active", current === slideIndex);
      if (current === slideIndex) slide.setAttribute("data-motion-snapshot", staticMode ? "b-static" : "active");
    });
    document.documentElement.style.width = "1280px";
    document.documentElement.style.height = "720px";
    document.body.style.width = "1280px";
    document.body.style.height = "720px";
    document.body.style.margin = "0";
    document.documentElement.classList.toggle("b-mode", staticMode);
    document.documentElement.classList.toggle("static-mode", staticMode);
    document.body.classList.toggle("b-mode", staticMode);
    document.body.classList.toggle("static-mode", staticMode);
    document.body.toggleAttribute("data-b-mode", staticMode);
    document.body.toggleAttribute("data-static-mode", staticMode);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: staticMode ? "b" : "Escape", bubbles: true }));
    window.scrollTo(0, 0);
  }, { slideIndex: index, staticMode });
}

async function snapshotMetrics(index, phase, delayMs) {
  if (delayMs > 0) await page.waitForTimeout(delayMs);
  const shotPath = path.join(outDir, `slide-${String(index + 1).padStart(2, "0")}-${phase}.png`);
  const buffer = await page.screenshot({ path: shotPath, fullPage: false });
  const metrics = await page.evaluate(({ slideIndex, motion }) => {
    const active = document.querySelector(".slide[data-qa-active]");
    const results = { slide: slideIndex + 1, textNodes: 0, lowOpacityTextNodes: 0, totalTextLength: 0, hasMotionElements: false, hasBModeEvidence: false };
    if (!active) return results;
    results.hasMotionElements = Boolean(active.querySelector("[data-anim], [data-animation], [data-motion], canvas, video, svg"));
    results.hasBModeEvidence = /b\\s*mode|static|low[- ]power|静态|低功耗/i.test(active.textContent || "")
      || [...document.querySelectorAll("[data-b-mode],[data-static-mode],[data-low-power-mode]")]
        .some((node) => node !== document.body && node !== document.documentElement);

    const candidates = [...active.querySelectorAll("h1,h2,h3,p,li,td,th,span,small,strong,em,div")];
    for (const node of candidates) {
      const text = (node.textContent || "").replace(/\\s+/g, " ").trim();
      if (!text) continue;
      const childrenWithText = [...node.children].filter((child) => (child.textContent || "").trim());
      if (childrenWithText.length && !/^(H1|H2|H3|P|LI|TD|TH|SMALL|SPAN|STRONG|EM)$/.test(node.tagName)) continue;
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const box = node.getBoundingClientRect();
      if (box.width <= 1 || box.height <= 1) continue;
      const opacity = Number(style.opacity);
      if (opacity >= (motion.minVisibleTextOpacity ?? 0.35)) {
        results.textNodes += 1;
        results.totalTextLength += text.length;
      } else {
        results.lowOpacityTextNodes += 1;
      }
    }
    return results;
  }, { slideIndex: index, motion });

  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let i = 0; i < buffer.length; i += 97) {
    const v = buffer[i];
    if (typeof v !== "number") continue;
    sum += v;
    sumSq += v * v;
    count += 1;
  }
  const mean = count ? sum / count : 0;
  const variance = count ? sumSq / count - mean * mean : 0;
  return { ...metrics, phase, screenshot: shotPath, pixelVariance: Number(Math.max(0, variance).toFixed(2)) };
}

for (let index = 0; index < slideCount; index += 1) {
  await activateSlide(index, false);
  const initial = await snapshotMetrics(index, "initial", motion.initialDelayMs ?? 120);
  const settled = await snapshotMetrics(index, "settled", Math.max(0, (motion.settledDelayMs ?? 900) - (motion.initialDelayMs ?? 120)));
  let bmode = null;
  if (motion.requireBMode !== false) {
    await activateSlide(index, true);
    bmode = await snapshotMetrics(index, "bmode", 120);
  }

  for (const item of [initial, settled, bmode].filter(Boolean)) {
    report.push(item);
    if (item.textNodes < (motion.minVisibleTextNodes ?? 3)) {
      issues.push({ slide: index + 1, kind: "motion-visible-text-too-low", detail: `${item.phase}: ${item.textNodes} nodes < ${motion.minVisibleTextNodes}` });
    }
    if (item.pixelVariance < (motion.blankPixelVarianceMin ?? 8)) {
      issues.push({ slide: index + 1, kind: "motion-snapshot-near-blank", detail: `${item.phase}: variance ${item.pixelVariance} < ${motion.blankPixelVarianceMin}` });
    }
  }
  if (motion.requireBMode !== false && bmode && !bmode.hasBModeEvidence) {
    issues.push({ slide: index + 1, kind: "missing-b-mode-evidence", detail: "No B/static/low-power marker, attribute, or class detected." });
  }
}

await browser.close();

fs.writeFileSync(path.join(outDir, "motion-qa-report.json"), JSON.stringify({
  file: path.resolve(file),
  style: styleId || null,
  profile: profileId || null,
  viewport: { width, height },
  motion,
  issueCount: issues.length,
  issues: issues.slice(0, maxIssues),
  snapshots: report,
}, null, 2));

if (issues.length) {
  console.error(`Motion QA failed: ${issues.length} issue(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}.`);
  for (const issue of issues.slice(0, maxIssues)) console.error(`- ${issueText(issue)}`);
  console.error(`Report: ${path.join(outDir, "motion-qa-report.json")}`);
  process.exit(1);
}

console.log(`Motion QA passed: ${slideCount} slide(s), style ${styleId || "unknown"}, profile ${profileId || "unknown"}, screenshots in ${outDir}.`);
