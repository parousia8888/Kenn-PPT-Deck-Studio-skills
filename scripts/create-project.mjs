#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const template = args.get("template");
const out = args.get("out");

if (!template || !out) {
  console.error("Usage: node scripts/create-project.mjs --template=<template-id> --out=<project-dir>");
  process.exit(2);
}

const source = path.join(root, "assets", "templates", template);
if (!fs.existsSync(source)) {
  console.error(`Unknown template: ${template}`);
  process.exit(2);
}

const target = path.resolve(out);
if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
  console.error(`Output directory exists and is not empty: ${target}`);
  process.exit(2);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
const result = spawnSync("rsync", ["-a", `${source}/`, `${target}/`], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status || 1);

console.log(JSON.stringify({
  template,
  output: target,
}, null, 2));
