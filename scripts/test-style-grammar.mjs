#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "assets", "style-systems", "style-catalog.json");
const grammarPath = path.join(root, "assets", "style-systems", "execution-grammar.json");
const validatorPath = path.join(root, "scripts", "validate-style-sample.mjs");
const visualQaPath = path.join(root, "scripts", "visual-qa-sample.mjs");
const gridQaPath = path.join(root, "scripts", "grid-qa-sample.mjs");
const typeQaPath = path.join(root, "scripts", "type-qa-sample.mjs");
const contrastQaPath = path.join(root, "scripts", "contrast-qa-sample.mjs");
const motionQaPath = path.join(root, "scripts", "motion-qa-sample.mjs");
const passFixture = path.join(root, "tests", "fixtures", "braun-industrial-control.pass.html");
const failFixture = path.join(root, "tests", "fixtures", "braun-industrial-control.fail.html");
const visualPassFixture = path.join(root, "tests", "fixtures", "founder-memo-visual.pass.html");
const visualFailFixture = path.join(root, "tests", "fixtures", "founder-memo-visual.fail.html");
const gridPassFixture = path.join(root, "tests", "fixtures", "swiss-grid-discipline.pass.html");
const gridFailFixture = path.join(root, "tests", "fixtures", "swiss-grid-discipline.fail.html");
const qualityPassFixture = path.join(root, "tests", "fixtures", "quality-discipline.pass.html");
const qualityTypeFailFixture = path.join(root, "tests", "fixtures", "quality-type.fail.html");
const qualityContrastFailFixture = path.join(root, "tests", "fixtures", "quality-contrast.fail.html");
const qualityMotionFailFixture = path.join(root, "tests", "fixtures", "quality-motion.fail.html");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function run(args) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4,
  });
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const catalogIds = new Set(catalog.styles.map((style) => style.id));
const missing = [];
const bad = [];
for (const style of catalog.styles) {
  const profileId = grammar.styleProfileMap[style.id];
  if (!profileId) missing.push(style.id);
  else if (!grammar.grammarProfiles[profileId]) bad.push(`${style.id}->${profileId}`);
}
const extra = Object.keys(grammar.styleProfileMap).filter((id) => !catalogIds.has(id));
if (missing.length || bad.length || extra.length) {
  fail(`Style/profile map mismatch: ${JSON.stringify({ missing, bad, extra }, null, 2)}`);
}

const missingDiscipline = [];
for (const [profileId, profile] of Object.entries(grammar.grammarProfiles)) {
  for (const key of ["typographyDiscipline", "tableDiscipline", "sourceDiscipline", "contrastDiscipline", "motionSnapshotDiscipline"]) {
    if (!profile[key]) missingDiscipline.push(`${profileId}.${key}`);
  }
  if (!profile.typographyDiscipline?.minFontPx?.title) missingDiscipline.push(`${profileId}.typographyDiscipline.minFontPx.title`);
  if (!profile.typographyDiscipline?.maxLines?.title) missingDiscipline.push(`${profileId}.typographyDiscipline.maxLines.title`);
  if (!profile.contrastDiscipline?.normalText) missingDiscipline.push(`${profileId}.contrastDiscipline.normalText`);
  if (!Number.isFinite(profile.motionSnapshotDiscipline?.settledDelayMs)) missingDiscipline.push(`${profileId}.motionSnapshotDiscipline.settledDelayMs`);
}
if (!grammar.globalDisciplineDefaults) missingDiscipline.push("globalDisciplineDefaults");
if (missingDiscipline.length) fail(`Missing quality discipline fields: ${missingDiscipline.join(", ")}`);

const pass = run([
  validatorPath,
  `--file=${passFixture}`,
  "--style=braun-graphite-orange",
  "--template=course-canvas",
]);
if (pass.status !== 0) {
  fail(`Positive Braun fixture should pass.\nSTDOUT:\n${pass.stdout}\nSTDERR:\n${pass.stderr}`);
}

const negative = run([
  validatorPath,
  `--file=${failFixture}`,
  "--style=braun-graphite-orange",
  "--template=course-canvas",
]);
if (negative.status === 0) {
  fail("Negative Braun fixture should fail, but validator returned success.");
}

const combined = `${negative.stdout}\n${negative.stderr}`;
const expectedSignals = [
  "at least 2 slides",
  "layout whitelist",
  "forbids visible SVG <text>",
  "forbids radar/spider",
  "forbids circular badges/nodes",
  "requires dark content surfaces",
  "forbids serif display",
  "caps h1/h2 title weight",
];

const missed = expectedSignals.filter((signal) => !combined.includes(signal));
if (missed.length) {
  fail(`Negative fixture did not hit expected validator signal(s): ${missed.join(", ")}\n${combined}`);
}

const visualPass = run([
  visualQaPath,
  `--file=${visualPassFixture}`,
  "--out=.tmp/visual-pass",
  "--skip-grid-qa=true",
]);
if (visualPass.status !== 0) {
  fail(`Founder memo visual pass fixture should pass.\nSTDOUT:\n${visualPass.stdout}\nSTDERR:\n${visualPass.stderr}`);
}

const visualFail = run([
  visualQaPath,
  `--file=${visualFailFixture}`,
  "--out=.tmp/visual-fail",
  "--skip-grid-qa=true",
]);
if (visualFail.status === 0) {
  fail("Founder memo visual fail fixture should fail, but visual QA returned success.");
}

const visualCombined = `${visualFail.stdout}\n${visualFail.stderr}`;
const visualSignals = ["scroll-overflow", "element-outside-slide"];
const missedVisual = visualSignals.filter((signal) => !visualCombined.includes(signal));
if (missedVisual.length) {
  fail(`Visual fail fixture did not hit expected signal(s): ${missedVisual.join(", ")}\n${visualCombined}`);
}

const gridPass = run([
  gridQaPath,
  `--file=${gridPassFixture}`,
  "--style=swiss-signal-cobalt",
]);
if (gridPass.status !== 0) {
  fail(`Swiss grid discipline pass fixture should pass.\nSTDOUT:\n${gridPass.stdout}\nSTDERR:\n${gridPass.stderr}`);
}

const gridFail = run([
  gridQaPath,
  `--file=${gridFailFixture}`,
  "--style=swiss-signal-cobalt",
]);
if (gridFail.status === 0) {
  fail("Swiss grid discipline fail fixture should fail, but grid QA returned success.");
}

const gridCombined = `${gridFail.stdout}\n${gridFail.stderr}`;
const gridSignals = ["missing-grid-band", "missing-grid-overlay"];
const missedGrid = gridSignals.filter((signal) => !gridCombined.includes(signal));
if (missedGrid.length) {
  fail(`Grid fail fixture did not hit expected signal(s): ${missedGrid.join(", ")}\n${gridCombined}`);
}

const typePass = run([
  typeQaPath,
  `--file=${qualityPassFixture}`,
  "--style=founder-memo-minimal",
]);
if (typePass.status !== 0) {
  fail(`Quality pass fixture should pass type QA.\nSTDOUT:\n${typePass.stdout}\nSTDERR:\n${typePass.stderr}`);
}

const typeFail = run([
  typeQaPath,
  `--file=${qualityTypeFailFixture}`,
  "--style=founder-memo-minimal",
]);
if (typeFail.status === 0) {
  fail("Quality type fail fixture should fail, but type QA returned success.");
}
const typeCombined = `${typeFail.stdout}\n${typeFail.stderr}`;
const typeSignals = ["heading-font-too-small", "heading-too-many-lines", "heading-wrap-not-balanced", "body-font-too-small"];
const missedType = typeSignals.filter((signal) => !typeCombined.includes(signal));
if (missedType.length) {
  fail(`Type fail fixture did not hit expected signal(s): ${missedType.join(", ")}\n${typeCombined}`);
}

const contrastPass = run([
  contrastQaPath,
  `--file=${qualityPassFixture}`,
  "--style=founder-memo-minimal",
]);
if (contrastPass.status !== 0) {
  fail(`Quality pass fixture should pass contrast QA.\nSTDOUT:\n${contrastPass.stdout}\nSTDERR:\n${contrastPass.stderr}`);
}

const contrastFail = run([
  contrastQaPath,
  `--file=${qualityContrastFailFixture}`,
  "--style=founder-memo-minimal",
]);
if (contrastFail.status === 0) {
  fail("Quality contrast fail fixture should fail, but contrast QA returned success.");
}
const contrastCombined = `${contrastFail.stdout}\n${contrastFail.stderr}`;
if (!contrastCombined.includes("text-low-contrast") && !contrastCombined.includes("large-text-low-contrast")) {
  fail(`Contrast fail fixture did not hit expected low-contrast signal.\n${contrastCombined}`);
}

const motionPass = run([
  motionQaPath,
  `--file=${qualityPassFixture}`,
  "--style=founder-memo-minimal",
  "--out=.tmp/motion-pass",
]);
if (motionPass.status !== 0) {
  fail(`Quality pass fixture should pass motion QA.\nSTDOUT:\n${motionPass.stdout}\nSTDERR:\n${motionPass.stderr}`);
}

const motionFail = run([
  motionQaPath,
  `--file=${qualityMotionFailFixture}`,
  "--style=founder-memo-minimal",
  "--out=.tmp/motion-fail",
]);
if (motionFail.status === 0) {
  fail("Quality motion fail fixture should fail, but motion QA returned success.");
}
const motionCombined = `${motionFail.stdout}\n${motionFail.stderr}`;
const motionSignals = ["motion-visible-text-too-low", "missing-b-mode-evidence"];
const missedMotion = motionSignals.filter((signal) => !motionCombined.includes(signal));
if (missedMotion.length) {
  fail(`Motion fail fixture did not hit expected signal(s): ${missedMotion.join(", ")}\n${motionCombined}`);
}

console.log(`Style grammar tests passed: ${catalog.styles.length} styles, ${Object.keys(grammar.grammarProfiles).length} grammar profiles, grammar fixtures, visual/grid/type/contrast/motion QA fixtures verified.`);
