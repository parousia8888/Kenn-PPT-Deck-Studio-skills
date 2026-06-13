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

const input = path.resolve(root, args.get("input") || "decks/academy-prospectus-full/index.html");
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
  if (!closed && proc && !proc.killed) {
    proc.kill("SIGKILL");
  }
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
await page.waitForTimeout(1800);

const boot = await page.evaluate(() => {
  const active = document.querySelector(".slide[data-deck-active]");
  const canvas = document.querySelector(".paper-bg");
  const stageRect = document.querySelector(".deck-stage")?.getBoundingClientRect();
  const deckCanvasRect = document.querySelector(".deck-canvas")?.getBoundingClientRect();
  return {
    title: document.title,
    slides: document.querySelectorAll(".deck-canvas > .slide").length,
    activeLabel: active?.getAttribute("data-screen-label"),
    activeIndex: window.ProspectusDeck?.index ?? null,
    multi: window.ProspectusDeck?.multi ?? null,
    bodyMotion: document.body.classList.contains("motion"),
    lowPower: document.body.classList.contains("low-power"),
    paperBg: !!canvas,
    paperBgParent: canvas?.parentElement?.getAttribute("data-screen-label"),
    paperBgSize: canvas && { width: canvas.width, height: canvas.height },
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    animRecipes: [...document.querySelectorAll(".slide[data-anim]")].map((s) => s.getAttribute("data-anim")),
    accents: [...new Set([...document.querySelectorAll(".slide[data-accent]")].map((s) => s.getAttribute("data-accent")))],
    stageRect: stageRect && { width: stageRect.width, height: stageRect.height },
    deckCanvasRect: deckCanvasRect && { width: deckCanvasRect.width, height: deckCanvasRect.height },
  };
});

assert(boot.slides === 10, `Expected 10 slides, got ${boot.slides}`);
assert(boot.activeLabel === "Cover", `Expected Cover active at boot, got ${boot.activeLabel}`);
assert(boot.activeIndex === 0, `Expected deck index 0 at boot, got ${boot.activeIndex}`);
assert(boot.multi === true, "Expected multi-slide deck");
assert(boot.paperBg === true, "Expected paper background canvas");
assert(boot.paperBgParent === "Cover", `Expected paper background on active slide, got ${boot.paperBgParent}`);
assert(boot.paperBgSize?.width === 1280 * boot.dpr && boot.paperBgSize?.height === 720 * boot.dpr, "Expected DPR-sized 1280x720 paper canvas");
assert(boot.animRecipes.includes("prospectus-cover"), "Missing cover animation recipe");
assert(boot.animRecipes.includes("environment-gallery"), "Missing gallery animation recipe");
assert(boot.animRecipes.includes("enrollment"), "Missing enrollment animation recipe");
assert(["terracotta", "forest", "navy", "gold"].every((accent) => boot.accents.includes(accent)), "Missing one or more accent scopes");
assert(Math.round(boot.stageRect.width) === 1600 && Math.round(boot.stageRect.height) === 900, "Stage does not fill viewport");
assert(Math.round(boot.deckCanvasRect.width) === 1600 && Math.round(boot.deckCanvasRect.height) === 900, "Deck canvas is not fitted to viewport");

const visible = [];
for (let i = 0; i < boot.slides; i += 1) {
  if (i > 0) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1800);
  }
  const info = await page.evaluate(() => {
    const active = document.querySelector(".slide[data-deck-active]");
    const rect = active?.getBoundingClientRect();
    const canvas = document.querySelector(".paper-bg");
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
      index: window.ProspectusDeck?.index ?? null,
      label: active?.getAttribute("data-screen-label"),
      textLength: (active?.innerText || "").trim().length,
      rect: rect && { width: rect.width, height: rect.height },
      paperBgParent: canvas?.parentElement?.getAttribute("data-screen-label"),
      activeCount: document.querySelectorAll(".slide[data-deck-active]").length,
      visibleSlides: displays.filter((display) => display !== "none").length,
      overflowNodes,
    };
  });
  assert(info.index === i, `Navigation mismatch on slide ${i + 1}`);
  assert(info.textLength > 40, `Slide ${i + 1} appears blank`);
  assert(Math.round(info.rect.width) === 1600 && Math.round(info.rect.height) === 900, `Slide ${i + 1} not fitted to viewport`);
  assert(info.paperBgParent === info.label, `Paper background is not attached to active slide ${i + 1}`);
  assert(info.activeCount === 1, `Expected one active slide on slide ${i + 1}, got ${info.activeCount}`);
  assert(info.visibleSlides === 1, `Expected one visible slide on slide ${i + 1}, got ${info.visibleSlides}`);
  assert(info.overflowNodes.length === 0, `Slide ${i + 1} has content outside the slide bounds: ${JSON.stringify(info.overflowNodes)}`);
  visible.push(info);
  if (screenshot) {
    await page.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), fullPage: false });
  }
}

await page.evaluate(() => window.ProspectusDeck.go(0));
await page.waitForTimeout(450);
await page.keyboard.press("b");
await page.waitForTimeout(350);
const low = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  motion: document.body.classList.contains("motion"),
  paperDisplay: getComputedStyle(document.querySelector(".paper-bg")).display,
  hintDisplay: getComputedStyle(document.querySelector(".lowpower-hint")).display,
  activeCount: document.querySelectorAll(".slide[data-deck-active]").length,
}));
assert(low.lowPower === true, "B key did not enable low-power mode");
assert(low.motion === false, "Low-power mode did not disable motion class");
assert(low.paperDisplay === "none", "Low-power mode did not hide paper background");
assert(low.hintDisplay !== "none", "Low-power hint is not visible");
assert(low.activeCount === 10, "Low-power mode did not reveal all slides for static state");

if (screenshot) {
  await page.screenshot({ path: path.join(outDir, "low-power.png"), fullPage: false });
}

await page.keyboard.press("b");
await page.waitForTimeout(450);
const resumed = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  motion: document.body.classList.contains("motion"),
  paperDisplay: getComputedStyle(document.querySelector(".paper-bg")).display,
  activeCount: document.querySelectorAll(".slide[data-deck-active]").length,
}));
assert(resumed.lowPower === false, "B key did not disable low-power mode");
assert(resumed.paperDisplay !== "none", "Paper background did not resume after low-power mode");
assert(resumed.activeCount === 1, "Resume did not restore single active slide");

await page.keyboard.press("r");
await page.waitForTimeout(250);
const replay = await page.evaluate(() => ({
  activeLabel: document.querySelector(".slide[data-deck-active]")?.getAttribute("data-screen-label"),
  index: window.ProspectusDeck?.index ?? null,
}));
assert(replay.activeLabel === "Cover" && replay.index === 0, "R replay changed the active slide unexpectedly");

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
