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

const useFilter = args.get("use")?.toLowerCase();
const jsonOnly = args.get("json") === "true";

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
let styles = catalog.styles;

if (useFilter) {
  styles = styles.filter((style) =>
    style.fitUse.some((item) => item.toLowerCase().includes(useFilter)) ||
    style.id.toLowerCase().includes(useFilter) ||
    style.nameZh.toLowerCase().includes(useFilter)
  );
}

const rows = styles.map((style) => ({
  id: style.id,
  nameZh: style.nameZh,
  fitUse: style.fitUse,
  anchors: style.anchors,
  ratio: style.palette.ratio,
  colors: {
    bg: style.palette.tokens.bg,
    surface: style.palette.tokens.surface,
    text: style.palette.tokens.text,
    accent: style.palette.tokens.accent,
    accent2: style.palette.tokens.accent2,
  },
  typography: style.typography.temperament,
  density: style.density.slideDensity,
  motion: style.motion.background,
  avoid: style.palette.avoid,
  grammarProfile: grammar.styleProfileMap[style.id],
  forbiddenShapes: grammar.grammarProfiles[grammar.styleProfileMap[style.id]]?.shapeGrammar?.forbidden?.slice(0, 6) || [],
}));

if (jsonOnly) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`Style systems: ${rows.length}${useFilter ? ` (filtered by ${useFilter})` : ""}`);
  for (const row of rows) {
    console.log(`\n${row.id} / ${row.nameZh}`);
    console.log(`  use: ${row.fitUse.join(", ")}`);
    console.log(`  ratio: ${row.ratio}`);
    console.log(`  colors: bg ${row.colors.bg}, text ${row.colors.text}, accent ${row.colors.accent}, accent2 ${row.colors.accent2}`);
    console.log(`  type: ${row.typography}`);
    console.log(`  density: ${row.density}`);
    console.log(`  motion: ${row.motion}`);
    console.log(`  grammar: ${row.grammarProfile}${row.forbiddenShapes.length ? `; forbids ${row.forbiddenShapes.join(", ")}` : ""}`);
    console.log(`  avoid: ${row.avoid.join("; ")}`);
  }
}
