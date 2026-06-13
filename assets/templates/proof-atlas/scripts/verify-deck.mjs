#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const input = path.resolve(root, args.get("input") || "decks/proof-atlas-full/index.html");
const outDir = path.resolve(root, args.get("out") || "_verify_screens");
const executablePath = args.get("chrome") || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshot = args.get("screenshots") !== "off";

fs.mkdirSync(outDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const events = [];

async function closeBrowser() {
  const proc = typeof browser.process === "function" ? browser.process() : null;
  let closed = false;
  await Promise.race([
    browser.close().then(() => { closed = true; }),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (!closed && proc && !proc.killed) proc.kill("SIGKILL");
}

page.on("console", msg => {
  if (["error", "warning"].includes(msg.type())) {
    events.push({ type: "console", level: msg.type(), text: msg.text() });
  }
});
page.on("pageerror", err => events.push({ type: "pageerror", text: err.message }));
page.on("requestfailed", req => {
  const url = req.url();
  if (!url.includes("fonts.googleapis.com") && !url.includes("fonts.gstatic.com")) {
    events.push({ type: "requestfailed", url, failure: req.failure()?.errorText });
  }
});

await page.goto(pathToFileURL(input).href, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(1600);

const boot = await page.evaluate(() => {
  const active = document.querySelector(".deck-canvas > .slide[data-deck-active]");
  const activeCanvas = active?.querySelector("canvas.atlas-bg-canvas");
  const stageRect = document.querySelector(".deck-shell")?.getBoundingClientRect();
  const deckCanvasRect = document.querySelector(".deck-canvas")?.getBoundingClientRect();
  return {
    title: document.title,
    slides: document.querySelectorAll(".deck-canvas > .slide").length,
    activeLabel: active?.getAttribute("data-screen-label"),
    activeIndex: window.ProofAtlasDeck?.index ?? null,
    canvases: document.querySelectorAll("canvas.atlas-bg-canvas").length,
    loops: window.AtlasMotion?.loops?.length ?? null,
    lowPower: document.body.classList.contains("low-power"),
    activeRect: active && { width: active.getBoundingClientRect().width, height: active.getBoundingClientRect().height },
    activeCanvas: activeCanvas && { width: activeCanvas.width, height: activeCanvas.height, display: getComputedStyle(activeCanvas).display },
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    stageRect: stageRect && { width: stageRect.width, height: stageRect.height },
    deckCanvasRect: deckCanvasRect && { width: deckCanvasRect.width, height: deckCanvasRect.height },
    animRecipes: [...new Set([...document.querySelectorAll("[data-anim]")].map((el) => el.getAttribute("data-anim")))],
  };
});

assert(boot.slides === 10, `Expected 10 slides, got ${boot.slides}`);
assert(boot.activeLabel === "01", `Expected slide 01 active at boot, got ${boot.activeLabel}`);
assert(boot.activeIndex === 0, `Expected deck index 0 at boot, got ${boot.activeIndex}`);
assert(boot.canvases === 10, `Expected 10 atlas background canvases, got ${boot.canvases}`);
assert(boot.loops === 10, `Expected 10 atlas background loops, got ${boot.loops}`);
assert(boot.activeCanvas?.width === Math.round(boot.activeRect.width * boot.dpr) && boot.activeCanvas?.height === Math.round(boot.activeRect.height * boot.dpr), "Expected active atlas canvas to match the displayed slide size");
assert(Math.round(boot.stageRect.width) === 1600 && Math.round(boot.stageRect.height) === 900, "Stage does not fill viewport");
assert(Math.round(boot.deckCanvasRect.width) === 1600 && Math.round(boot.deckCanvasRect.height) === 900, "Deck canvas is not fitted to viewport");
assert(["mask", "stamp", "row", "cell", "source", "draw-x"].every((recipe) => boot.animRecipes.includes(recipe)), "Missing one or more expected animation recipes");

const visible = [];
for (let i = 0; i < boot.slides; i += 1) {
  if (i > 0) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1500);
  }
  const info = await page.evaluate(() => {
    const active = document.querySelector(".deck-canvas > .slide[data-deck-active]");
    const rect = active?.getBoundingClientRect();
    const canvas = active?.querySelector("canvas.atlas-bg-canvas");
    const displays = [...document.querySelectorAll(".deck-canvas > .slide")].map((s) => getComputedStyle(s).display);
    const overflowNodes = active ? [...active.querySelectorAll("*")].map((el) => {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return null;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return null;
      const overflowX = Math.max(0, rect.left - r.left, r.right - rect.right);
      const overflowY = Math.max(0, rect.top - r.top, r.bottom - rect.bottom);
      if (overflowX <= 2 && overflowY <= 2) return null;
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === "string" ? el.className : "",
        overflowX,
        overflowY,
      };
    }).filter(Boolean).slice(0, 8) : [];
    return {
      index: window.ProofAtlasDeck?.index ?? null,
      label: active?.getAttribute("data-screen-label"),
      title: active?.getAttribute("data-slide-title"),
      textLength: (active?.innerText || "").trim().length,
      rect: rect && { width: rect.width, height: rect.height },
      activeCount: document.querySelectorAll(".deck-canvas > .slide[data-deck-active]").length,
      visibleSlides: displays.filter((display) => display !== "none").length,
      canvas: canvas && { width: canvas.width, height: canvas.height, display: getComputedStyle(canvas).display },
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      inState: active?.classList.contains("is-in"),
      overflowNodes,
    };
  });
  assert(info.index === i, `Navigation mismatch on slide ${i + 1}`);
  assert(info.label === String(i + 1).padStart(2, "0"), `Expected active label ${String(i + 1).padStart(2, "0")}, got ${info.label}`);
  assert(info.textLength > 40, `Slide ${i + 1} appears blank`);
  assert(Math.round(info.rect.width) === 1600 && Math.round(info.rect.height) === 900, `Slide ${i + 1} not fitted to viewport`);
  assert(info.activeCount === 1, `Expected one active slide on slide ${i + 1}, got ${info.activeCount}`);
  assert(info.visibleSlides === 1, `Expected one visible slide on slide ${i + 1}, got ${info.visibleSlides}`);
  assert(info.canvas?.width === Math.round(info.rect.width * info.dpr) && info.canvas?.height === Math.round(info.rect.height * info.dpr), `Slide ${i + 1} canvas does not match displayed slide size`);
  assert(info.canvas?.display !== "none", `Slide ${i + 1} canvas hidden before low-power mode`);
  assert(info.inState === true, `Slide ${i + 1} did not enter animated final state`);
  assert(info.overflowNodes.length === 0, `Slide ${i + 1} has content outside the slide bounds: ${JSON.stringify(info.overflowNodes)}`);
  visible.push(info);
  if (screenshot) {
    await page.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), fullPage: false });
  }
}

await page.keyboard.press("Home");
await page.waitForTimeout(350);
await page.keyboard.press("b");
await page.waitForTimeout(400);
const low = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  canvasDisplay: getComputedStyle(document.querySelector(".deck-canvas > .slide[data-deck-active] canvas.atlas-bg-canvas")).display,
  hintDisplay: getComputedStyle(document.querySelector(".atlas-lowpower-hint")).display,
  visibleActive: document.querySelectorAll(".deck-canvas > .slide[data-deck-active]").length,
}));
assert(low.lowPower === true, "B key did not enable low-power mode");
assert(low.canvasDisplay !== "none", "Low-power mode should freeze atlas canvas as a static frame, not remove it");
assert(low.hintDisplay !== "none", "Low-power hint is not visible");
assert(low.visibleActive === 1, "Low-power mode should keep the current deck slide active");

if (screenshot) {
  await page.screenshot({ path: path.join(outDir, "low-power.png"), fullPage: false });
}

await page.keyboard.press("b");
await page.waitForTimeout(400);
const resumed = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  canvasDisplay: getComputedStyle(document.querySelector(".deck-canvas > .slide[data-deck-active] canvas.atlas-bg-canvas")).display,
}));
assert(resumed.lowPower === false, "B key did not disable low-power mode");
assert(resumed.canvasDisplay !== "none", "Atlas canvas did not resume after low-power mode");

await page.keyboard.press("r");
await page.waitForTimeout(350);
const replay = await page.evaluate(() => ({
  activeLabel: document.querySelector(".deck-canvas > .slide[data-deck-active]")?.getAttribute("data-screen-label"),
  index: window.ProofAtlasDeck?.index ?? null,
  inState: document.querySelector(".deck-canvas > .slide[data-deck-active]")?.classList.contains("is-in"),
}));
assert(replay.activeLabel === "01" && replay.index === 0 && replay.inState === true, "R replay changed the active slide unexpectedly");

await closeBrowser();

if (events.length) {
  throw new Error(`Browser warnings/errors:\n${JSON.stringify(events, null, 2)}`);
}

console.log(JSON.stringify({
  input: path.relative(root, input),
  out: path.relative(root, outDir),
  boot,
  low,
  resumed,
  slidesVerified: visible.length,
}, null, 2));
