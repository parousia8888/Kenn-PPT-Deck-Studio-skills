#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "assets", "style-systems", "style-catalog.json");
const grammarPath = path.join(root, "assets", "style-systems", "execution-grammar.json");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const styleId = args.get("style");
const jsonOnly = args.get("json") === "true";

if (!styleId) {
  console.error("Usage: node scripts/list-style-grammar.mjs --style=<style-id> [--json=true]");
  process.exit(2);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const style = catalog.styles.find((item) => item.id === styleId);

if (!style) {
  console.error(`Unknown style id: ${styleId}`);
  process.exit(1);
}

const profileId = grammar.styleProfileMap[styleId];
const profile = grammar.grammarProfiles[profileId];

if (!profile) {
  console.error(`No execution grammar profile mapped for style id: ${styleId}`);
  process.exit(1);
}

const output = {
  style: {
    id: style.id,
    nameZh: style.nameZh,
    fitUse: style.fitUse,
    anchors: style.anchors,
    palette: style.palette,
    typography: style.typography,
    density: style.density,
    graphics: style.graphics,
    motion: style.motion,
  },
  profileId,
  profile,
};

if (jsonOnly) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log(`${style.id} / ${style.nameZh}`);
  console.log(`Profile: ${profileId} / ${profile.nameZh}`);
  console.log(`Anchors: ${style.anchors.join("; ")}`);
  console.log(`Colors: ${style.palette.ratio}; bg ${style.palette.tokens.bg}; text ${style.palette.tokens.text}; accent ${style.palette.tokens.accent}; accent2 ${style.palette.tokens.accent2}`);
  console.log(`Type: ${style.typography.temperament}; title ${style.typography.title}`);
  console.log("\nComponent grammar:");
  for (const [key, value] of Object.entries(profile.componentGrammar)) console.log(`  ${key}: ${value}`);
  console.log("\nShape grammar:");
  console.log(`  allowed: ${profile.shapeGrammar.allowed.join(", ")}`);
  console.log(`  forbidden: ${profile.shapeGrammar.forbidden.join(", ")}`);
  console.log(`  radius: ${profile.shapeGrammar.radius}`);
  console.log(`  shadow: ${profile.shapeGrammar.shadow}`);
  console.log("\nLayout families:");
  console.log(`  ${profile.layoutGrammar.allowedFamilies.join(", ")}`);
  if (profile.gridDiscipline) {
    console.log("\nGrid discipline:");
    console.log(`  mode: ${profile.gridDiscipline.mode}; frame: ${profile.gridDiscipline.frame}`);
    console.log(`  columns: ${profile.gridDiscipline.columns}; baseline: ${profile.gridDiscipline.baseline}px; gutter: ${profile.gridDiscipline.gutter}px`);
    console.log(`  margins: x ${profile.gridDiscipline.marginX}px, y ${profile.gridDiscipline.marginY}px`);
    console.log(`  trace: ${profile.gridDiscipline.requiredTrace.join(", ")}`);
    console.log(`  overlay: ${profile.gridDiscipline.overlay}`);
  }
  console.log("\nChart rules:");
  console.log(`  allowed: ${profile.graphicGrammar.chartsAllowed.join(", ")}`);
  console.log(`  forbidden: ${profile.graphicGrammar.chartsForbidden.join(", ")}`);
  console.log("\nType lock:");
  for (const [key, value] of Object.entries(profile.typeLock)) {
    console.log(`  ${key}: ${Array.isArray(value) ? value.join("; ") : value}`);
  }
  if (profile.typographyDiscipline) {
    console.log("\nTypography discipline:");
    console.log(`  min font px: ${JSON.stringify(profile.typographyDiscipline.minFontPx)}`);
    console.log(`  max lines: ${JSON.stringify(profile.typographyDiscipline.maxLines)}`);
    console.log(`  CJK line break: ${profile.typographyDiscipline.cjkLineBreak}; balanced title wrap: ${profile.typographyDiscipline.requireBalancedTitleWrap}`);
  }
  if (profile.tableDiscipline) {
    console.log("\nTable/source discipline:");
    console.log(`  table: max ${profile.tableDiscipline.maxRows} rows x ${profile.tableDiscipline.maxColumns} columns; min row ${profile.tableDiscipline.minRowHeight}px`);
    console.log(`  source: max ${profile.sourceDiscipline?.maxLines} lines; min ${profile.sourceDiscipline?.minFontPx}px; max ${profile.sourceDiscipline?.maxChars} chars`);
  }
  if (profile.contrastDiscipline) {
    console.log("\nContrast discipline:");
    console.log(`  normal text ${profile.contrastDiscipline.normalText}:1; large text ${profile.contrastDiscipline.largeText}:1; non-text ${profile.contrastDiscipline.nonText}:1`);
  }
  console.log("\nMotion:");
  console.log(`  ${profile.motionGrammar}`);
  if (profile.motionSnapshotDiscipline) {
    console.log(`  snapshots: initial ${profile.motionSnapshotDiscipline.initialDelayMs}ms; settled ${profile.motionSnapshotDiscipline.settledDelayMs}ms; B mode ${profile.motionSnapshotDiscipline.requireBMode ? "required" : "optional"}`);
  }
}
