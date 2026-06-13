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

const input = path.resolve(root, args.get("input") || "decks/course-canvas-full/index.html");
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
await page.waitForTimeout(1400);

const boot = await page.evaluate(() => {
  const stage = document.querySelector("deck-stage");
  const active = document.querySelector("deck-stage > [data-deck-active]");
  return {
    title: document.title,
    hasStage: !!stage,
    wrappers: document.querySelectorAll("deck-stage > section").length,
    slides: document.querySelectorAll(".cc-slide").length,
    canvases: document.querySelectorAll("canvas.cc-bg").length,
    backgrounds: window.CourseCanvasBackground?.instances?.length ?? null,
    lowPower: document.body.classList.contains("low-power"),
    activeLabel: active?.getAttribute("data-screen-label"),
    activeDataLabel: active?.getAttribute("data-label"),
    hasDraw: document.querySelectorAll("[data-draw]").length,
    hasStep: document.querySelectorAll("[data-step]").length,
  };
});

assert(boot.hasStage, "Missing deck-stage");
assert(boot.wrappers === 10, `Expected 10 deck sections, got ${boot.wrappers}`);
assert(boot.slides === 10, `Expected 10 .cc-slide nodes, got ${boot.slides}`);
assert(boot.canvases === 10, `Expected 10 .cc-bg canvases, got ${boot.canvases}`);
assert(boot.backgrounds === 10, `Expected 10 background instances, got ${boot.backgrounds}`);
assert(boot.activeLabel === "01 Course Cover" || boot.activeDataLabel === "Course Cover", `Unexpected active slide at boot: ${boot.activeLabel || boot.activeDataLabel}`);
assert(boot.hasDraw >= 3, "Knowledge-map connector draw attributes are missing");
assert(boot.hasStep >= 4, "Step highlight attributes are missing");

const visible = [];
for (let i = 0; i < boot.wrappers; i += 1) {
  if (i > 0) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1800);
  }
  const info = await page.evaluate(() => {
    const wrapper = document.querySelector("deck-stage > [data-deck-active]");
    const slide = wrapper?.querySelector(".cc-slide");
    const canvas = slide?.querySelector("canvas.cc-bg");
    const wrapperRect = wrapper?.getBoundingClientRect();
    const slideRect = slide?.getBoundingClientRect();
    return {
      index: [...document.querySelectorAll("deck-stage > section")].indexOf(wrapper),
      label: wrapper?.getAttribute("data-screen-label") || wrapper?.getAttribute("data-label"),
      recipe: wrapper?.getAttribute("data-recipe"),
      textLength: (wrapper?.innerText || "").trim().length,
      wrapperRect: wrapperRect && { x: wrapperRect.x, y: wrapperRect.y, width: wrapperRect.width, height: wrapperRect.height },
      slideRect: slideRect && { x: slideRect.x, y: slideRect.y, width: slideRect.width, height: slideRect.height },
      canvas: canvas && { width: canvas.width, height: canvas.height, display: getComputedStyle(canvas).display },
      dpr: window.devicePixelRatio || 1,
      bg: slide?.getAttribute("data-bg"),
    };
  });
  assert(info.index === i, `Navigation mismatch on slide ${i + 1}`);
  assert(info.textLength > 40, `Slide ${i + 1} appears blank`);
  assert(Math.round(info.wrapperRect.width) === 1600 && Math.round(info.wrapperRect.height) === 900, `Slide ${i + 1} wrapper not fitted to viewport`);
  assert(Math.round(info.slideRect.width) === 1600 && Math.round(info.slideRect.height) === 900, `Slide ${i + 1} visual slide not fitted to viewport`);
  assert(info.canvas?.width === Math.round(1280 * info.dpr) && info.canvas?.height === Math.round(720 * info.dpr), `Slide ${i + 1} canvas not design-size DPR canvas`);
  assert(info.canvas?.display !== "none", `Slide ${i + 1} canvas hidden before low-power mode`);
  visible.push(info);
  if (screenshot) {
    await page.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), fullPage: false });
  }
}

await page.keyboard.press("Home");
await page.waitForTimeout(300);
await page.keyboard.press("b");
await page.waitForTimeout(300);
const low = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  canvasDisplay: getComputedStyle(document.querySelector("canvas.cc-bg")).display,
  hintDisplay: getComputedStyle(document.querySelector(".cc-lp-hint")).display,
  revealVisible: [...document.querySelectorAll("deck-stage > [data-deck-active] [data-reveal]")]
    .every((el) => getComputedStyle(el).opacity === "1"),
}));

assert(low.lowPower === true, "B key did not enable low-power mode");
assert(low.canvasDisplay === "none", "Low-power mode did not hide canvases");
assert(low.hintDisplay !== "none", "Low-power hint is not visible");
assert(low.revealVisible === true, "Low-power mode did not force reveals visible");

if (screenshot) {
  await page.screenshot({ path: path.join(outDir, "low-power.png"), fullPage: false });
}

await page.keyboard.press("b");
await page.waitForTimeout(300);
const resumed = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  canvasDisplay: getComputedStyle(document.querySelector("canvas.cc-bg")).display,
}));
assert(resumed.lowPower === false, "B key did not disable low-power mode");
assert(resumed.canvasDisplay !== "none", "Canvas did not resume after low-power mode");

const exercise = await page.evaluate(() => {
  const wrapper = [...document.querySelectorAll("deck-stage > section")]
    .find((slide) => slide.getAttribute("data-recipe") === "exercise");
  return [...document.querySelectorAll("deck-stage > section")].indexOf(wrapper) + 1;
});
assert(exercise > 0, "Exercise slide not found");
await page.keyboard.press("Home");
await page.waitForTimeout(150);
for (let i = 1; i < exercise; i += 1) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(120);
}
await page.locator("[data-reveal-answer]").first().click();
await page.waitForTimeout(1000);
const exerciseAfter = await page.evaluate(() => ({
  textLength: (document.querySelector("deck-stage > [data-deck-active]")?.innerText || "").trim().length,
  state: document.querySelector("deck-stage > [data-deck-active] .cc-slide")?.getAttribute("data-state"),
  answerOpacity: getComputedStyle(document.querySelector("deck-stage > [data-deck-active] [data-answer]")).opacity,
}));
assert(exerciseAfter.state === "answer", "Exercise reveal did not set inner .cc-slide data-state=answer");
assert(Number(exerciseAfter.answerOpacity) > 0.9, "Exercise answer did not become visible");

await browser.close();

if (events.length) {
  throw new Error(`Browser warnings/errors:\n${JSON.stringify(events, null, 2)}`);
}

console.log(JSON.stringify({
  input: path.relative(root, input),
  out: path.relative(root, outDir),
  boot,
  low,
  exercise: { slide: exercise, state: exerciseAfter.state },
  slidesVerified: visible.length,
}, null, 2));
