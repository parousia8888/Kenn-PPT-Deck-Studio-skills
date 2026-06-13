#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const templates = [
  {
    id: "course-canvas",
    use: "上课课件 / training / lesson",
    default: "dist/course-canvas-teaching-deck.single.html",
    system: "dist/course-canvas-teaching-deck.system-fonts.single.html",
  },
  {
    id: "investor-signal",
    use: "投资人 pitch deck / fundraising",
    default: "dist/investor-signal-pitch-deck.single.html",
    system: "dist/investor-signal-pitch-deck.system-fonts.single.html",
  },
  {
    id: "academy-prospectus",
    use: "教育机构宣传册 / prospectus",
    default: "dist/academy-prospectus-deck.single.html",
    system: "dist/academy-prospectus-deck.system-fonts.single.html",
  },
  {
    id: "proof-atlas",
    use: "数据证据 / research / strategy proof",
    default: "dist/proof-atlas-evidence-deck.single.html",
    system: "dist/proof-atlas-evidence-deck.system-fonts.single.html",
  },
  {
    id: "launch-theatre",
    use: "产品发布会 / high-end keynote",
    default: "dist/launch-theatre-keynote-deck.single.html",
    system: "dist/launch-theatre-keynote-deck.system-fonts.single.html",
  },
];

const rows = templates.map((template) => {
  const dir = path.join(root, "assets", "templates", template.id);
  const contact = path.join(root, "assets", "contact-sheets", template.id, "contact-sheet.png");
  return {
    ...template,
    available: fs.existsSync(dir),
    contactSheet: fs.existsSync(contact) ? path.relative(root, contact) : null,
  };
});

console.log(JSON.stringify(rows, null, 2));
