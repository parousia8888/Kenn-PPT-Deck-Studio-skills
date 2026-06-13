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

const input = path.resolve(root, args.get("input") || "ui_kits/pitch-deck/index.html");
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
await page.waitForTimeout(1200);

const boot = await page.evaluate(() => ({
  title: document.title,
  slides: document.querySelectorAll("[data-slide]").length,
  canvases: document.querySelectorAll("canvas.is-bg-canvas").length,
  backgrounds: window.InvestorSignal?.backgrounds?.length ?? null,
  lowPower: document.body.classList.contains("low-power"),
  active: document.querySelector("[data-deck-active=true]")?.getAttribute("data-screen-label"),
}));

assert(boot.slides === 10, `Expected 10 slides, got ${boot.slides}`);
assert(boot.canvases === 10, `Expected 10 canvases, got ${boot.canvases}`);
assert(boot.backgrounds === 10, `Expected 10 background instances, got ${boot.backgrounds}`);
assert(boot.active === "01", `Expected slide 01 active at boot, got ${boot.active}`);

const visible = [];
for (let i = 0; i < boot.slides; i++) {
  if (i > 0) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(900);
  }
  const info = await page.evaluate(() => {
    const slide = document.querySelector("[data-deck-active=true]");
    const rect = slide.getBoundingClientRect();
    const canvas = slide.querySelector("canvas.is-bg-canvas");
    return {
      active: slide.getAttribute("data-screen-label"),
      textLength: (slide.innerText || "").trim().length,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      canvas: canvas ? { width: canvas.width, height: canvas.height } : null,
    };
  });
  assert(info.active === String(i + 1).padStart(2, "0"), `Navigation mismatch on slide ${i + 1}`);
  assert(info.textLength > 40, `Slide ${i + 1} appears blank`);
  assert(Math.round(info.rect.width) === 1600 && Math.round(info.rect.height) === 900, `Slide ${i + 1} not fitted to viewport`);
  assert(info.canvas?.width === 1600 && info.canvas?.height === 900, `Slide ${i + 1} canvas not sized`);
  visible.push(info);
  if (screenshot) {
    await page.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`), fullPage: false });
  }
}

await page.keyboard.press("b");
await page.waitForTimeout(250);
const low = await page.evaluate(() => ({
  lowPower: document.body.classList.contains("low-power"),
  display: getComputedStyle(document.querySelector("canvas.is-bg-canvas")).display,
  hintDisplay: getComputedStyle(document.querySelector(".lp-hint")).display,
}));

assert(low.lowPower === true, "B key did not enable low-power mode");
assert(low.display === "none", "Low-power mode did not hide canvases");
assert(low.hintDisplay !== "none", "Low-power hint is not visible");

if (screenshot) {
  await page.screenshot({ path: path.join(outDir, "low-power.png"), fullPage: false });
}

await browser.close();

if (events.length) {
  throw new Error(`Browser warnings/errors:\n${JSON.stringify(events, null, 2)}`);
}

console.log(JSON.stringify({
  input: path.relative(root, input),
  out: path.relative(root, outDir),
  boot,
  low,
  slidesVerified: visible.length,
}, null, 2));
