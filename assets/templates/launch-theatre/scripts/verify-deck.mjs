#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

let sharp = null;
try {
  sharp = require("sharp");
} catch {
  sharp = null;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const input = path.resolve(root, args.get("input") || "decks/launch-theatre-full/index.html");
const outDir = path.resolve(root, args.get("out") || "_verify_screens");
const executablePath = args.get("chrome") || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshot = args.get("screenshots") !== "off";

fs.mkdirSync(outDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function closeBrowser(browser) {
  const proc = typeof browser.process === "function" ? browser.process() : null;
  let closed = false;
  await Promise.race([
    browser.close().then(() => { closed = true; }),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (!closed && proc && !proc.killed) proc.kill("SIGKILL");
}

async function buildContactSheet(slideCount) {
  if (!sharp || !screenshot) return null;
  const cols = 5;
  const tileW = 384;
  const tileH = 216;
  const gap = 18;
  const labelH = 34;
  const rows = Math.ceil(slideCount / cols);
  const width = cols * tileW + (cols + 1) * gap;
  const height = rows * (tileH + labelH) + (rows + 1) * gap;
  const composites = [];

  for (let i = 0; i < slideCount; i += 1) {
    const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    const x = gap + (i % cols) * (tileW + gap);
    const y = gap + Math.floor(i / cols) * (tileH + labelH + gap);
    const thumb = await sharp(file).resize(tileW, tileH, { fit: "cover" }).png().toBuffer();
    const label = Buffer.from(
      `<svg width="${tileW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#060709"/>
        <text x="0" y="23" font-family="Arial, sans-serif" font-size="17" fill="#AEB7C0" letter-spacing="2">SLIDE ${String(i + 1).padStart(2, "0")}</text>
      </svg>`
    );
    composites.push({ input: thumb, left: x, top: y });
    composites.push({ input: label, left: x, top: y + tileH });
  }

  const output = path.join(outDir, "contact-sheet.png");
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#060709",
    },
  }).composite(composites).png().toFile(output);
  return output;
}

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const events = [];

page.on("console", msg => {
  if (["error", "warning"].includes(msg.type())) {
    const text = msg.text();
    if (!/Failed to decode downloaded font|OTS parsing error/i.test(text)) {
      events.push({ type: "console", level: msg.type(), text });
    }
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
await page.waitForTimeout(2400);

const boot = await page.evaluate(() => {
  const stage = document.querySelector("deck-stage");
  const active = document.querySelector("deck-stage > [data-deck-active]");
  const activeFrame = active?.querySelector(".frame");
  const activeField = active?.querySelector("[data-lt-field]");
  const activeCanvas = activeField?.querySelector("canvas");
  const stageRect = stage?.getBoundingClientRect();
  const activeRect = active?.getBoundingClientRect();
  const frameRect = activeFrame?.getBoundingClientRect();
  return {
    title: document.title,
    hasStage: !!stage,
    width: stage?.getAttribute("width"),
    height: stage?.getAttribute("height"),
    noRail: stage?.hasAttribute("no-rail") ?? false,
    slides: document.querySelectorAll("deck-stage > section").length,
    activeLabel: active?.getAttribute("data-screen-label"),
    activeIndex: [...document.querySelectorAll("deck-stage > section")].indexOf(active),
    frameCount: document.querySelectorAll(".frame").length,
    fields: document.querySelectorAll("[data-lt-field]").length,
    fieldCanvases: document.querySelectorAll("[data-lt-field] canvas").length,
    lowPower: document.body.classList.contains("low-power"),
    stageRect: stageRect && { width: stageRect.width, height: stageRect.height },
    activeRect: activeRect && { width: activeRect.width, height: activeRect.height },
    frameRect: frameRect && { width: frameRect.width, height: frameRect.height },
    activeCanvas: activeCanvas && {
      width: activeCanvas.width,
      height: activeCanvas.height,
      display: getComputedStyle(activeCanvas).display,
    },
    recipes: [...new Set([...document.querySelectorAll("[data-anim]")].map((el) => el.getAttribute("data-anim")))],
    api: !!window.LaunchTheatre,
  };
});

assert(boot.hasStage, "Missing deck-stage");
assert(boot.width === "1920" && boot.height === "1080", `Unexpected deck-stage design size: ${boot.width}x${boot.height}`);
assert(boot.noRail === true, "Canonical deck should hide the edit thumbnail rail");
assert(boot.slides === 10, `Expected 10 slides, got ${boot.slides}`);
assert(boot.frameCount === 10, `Expected 10 .frame nodes, got ${boot.frameCount}`);
assert(boot.fields === 4, `Expected 4 optical fields, got ${boot.fields}`);
assert(boot.fieldCanvases === 4, `Expected 4 field canvases, got ${boot.fieldCanvases}`);
assert(boot.activeIndex === 0, `Expected slide 01 active at boot, got index ${boot.activeIndex}`);
assert(boot.api, "LaunchTheatre API missing");
assert(["cover-title", "meta", "tension", "product", "feature", "step", "before", "divider", "after", "layer", "bar", "num", "closing", "rise"].every((recipe) => boot.recipes.includes(recipe)), "Missing one or more expected animation recipes");
assert(Math.round(boot.stageRect.width) === 1600 && Math.round(boot.stageRect.height) === 900, "Stage does not fill viewport");
assert(Math.round(boot.activeRect.width) === 1600 && Math.round(boot.activeRect.height) === 900, "Active slide not fitted to viewport");
assert(Math.round(boot.frameRect.width) === 1600 && Math.round(boot.frameRect.height) === 900, "Active frame not fitted to viewport");

const visible = [];
for (let i = 0; i < boot.slides; i += 1) {
  if (i > 0) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1800);
  }
  const info = await page.evaluate(() => {
    const slides = [...document.querySelectorAll("deck-stage > section")];
    const active = document.querySelector("deck-stage > [data-deck-active]");
    const frame = active?.querySelector(".frame");
    const rect = active?.getBoundingClientRect();
    const frameRect = frame?.getBoundingClientRect();
    const fieldCanvas = active?.querySelector("[data-lt-field] canvas");
    const overflowNodes = active && frame ? [...frame.querySelectorAll("*")].map((el) => {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return null;
      if (style.position === "fixed") return null;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return null;
      const overflowX = Math.max(0, frameRect.left - r.left, r.right - frameRect.right);
      const overflowY = Math.max(0, frameRect.top - r.top, r.bottom - frameRect.bottom);
      if (overflowX <= 2 && overflowY <= 2) return null;
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === "string" ? el.className : "",
        overflowX,
        overflowY,
      };
    }).filter(Boolean).slice(0, 8) : [];
    const animVisible = active ? [...active.querySelectorAll("[data-anim]")].every((el) => {
      const cs = getComputedStyle(el);
      return Number(cs.opacity) > 0.96 && cs.visibility !== "hidden";
    }) : false;
    return {
      index: slides.indexOf(active),
      label: active?.getAttribute("data-screen-label"),
      textLength: (active?.innerText || "").trim().length,
      rect: rect && { width: rect.width, height: rect.height },
      frameRect: frameRect && { width: frameRect.width, height: frameRect.height },
      activeCount: document.querySelectorAll("deck-stage > [data-deck-active]").length,
      fieldCanvas: fieldCanvas && {
        width: fieldCanvas.width,
        height: fieldCanvas.height,
        clientWidth: fieldCanvas.clientWidth,
        clientHeight: fieldCanvas.clientHeight,
        display: getComputedStyle(fieldCanvas).display,
      },
      animVisible,
      overflowNodes,
    };
  });
  assert(info.index === i, `Navigation mismatch on slide ${i + 1}`);
  assert(info.label?.startsWith(String(i + 1).padStart(2, "0")), `Expected active label ${String(i + 1).padStart(2, "0")}, got ${info.label}`);
  assert(info.textLength > 35, `Slide ${i + 1} appears blank`);
  assert(Math.round(info.rect.width) === 1600 && Math.round(info.rect.height) === 900, `Slide ${i + 1} wrapper not fitted to viewport`);
  assert(Math.round(info.frameRect.width) === 1600 && Math.round(info.frameRect.height) === 900, `Slide ${i + 1} frame not fitted to viewport`);
  assert(info.activeCount === 1, `Expected one active slide on slide ${i + 1}, got ${info.activeCount}`);
  if (info.fieldCanvas) {
    assert(info.fieldCanvas.width > 0 && info.fieldCanvas.height > 0, `Slide ${i + 1} optical field canvas is zero-sized`);
    assert(info.fieldCanvas.display !== "none", `Slide ${i + 1} optical field canvas hidden before low-power mode`);
  }
  assert(info.animVisible === true, `Slide ${i + 1} animations did not reach visible state`);
  assert(info.overflowNodes.length === 0, `Slide ${i + 1} has content outside frame: ${JSON.stringify(info.overflowNodes)}`);
  visible.push(info);
  if (screenshot) {
    await page.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), fullPage: false });
  }
}

await page.keyboard.press("Home");
await page.waitForTimeout(450);
await page.keyboard.press("b");
await page.waitForTimeout(450);
const low = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  hintDisplay: getComputedStyle(document.querySelector(".lt-lowpower-hint")).display,
  canvases: [...document.querySelectorAll("[data-lt-field] canvas")].map((canvas) => getComputedStyle(canvas).display),
  animVisible: [...document.querySelectorAll("deck-stage > [data-deck-active] [data-anim]")].every((el) => Number(getComputedStyle(el).opacity) > 0.96),
}));
assert(low.lowPower === true, "B key did not enable low-power mode");
assert(low.hintDisplay !== "none", "Low-power hint is not visible");
assert(low.canvases.every((display) => display !== "none"), "Low-power mode should freeze field canvases as static frames");
assert(low.animVisible === true, "Low-power mode did not force active reveals visible");

if (screenshot) {
  await page.screenshot({ path: path.join(outDir, "low-power.png"), fullPage: false });
}

await page.keyboard.press("b");
await page.waitForTimeout(450);
const resumed = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  canvasDisplay: getComputedStyle(document.querySelector("[data-lt-field] canvas")).display,
}));
assert(resumed.lowPower === false, "B key did not disable low-power mode");
assert(resumed.canvasDisplay !== "none", "Field canvas did not resume after low-power mode");

const contactSheet = await buildContactSheet(boot.slides);

await closeBrowser(browser);

if (events.length) {
  throw new Error(`Browser warnings/errors:\n${JSON.stringify(events, null, 2)}`);
}

console.log(JSON.stringify({
  input: path.relative(root, input),
  out: path.relative(root, outDir),
  contactSheet: contactSheet ? path.relative(root, contactSheet) : null,
  boot,
  low,
  resumed,
  slidesVerified: visible.length,
}, null, 2));

process.exit(0);
