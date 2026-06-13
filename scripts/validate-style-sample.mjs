#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const grammarPath = path.join(root, "assets", "style-systems", "execution-grammar.json");
const catalogPath = path.join(root, "assets", "style-systems", "style-catalog.json");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)=(.*)$/);
  if (match) args.set(match[1], match[2]);
}

const file = args.get("file") || process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const styleArg = args.get("style");
const templateArg = args.get("template");

if (!file) {
  console.error("Usage: node scripts/validate-style-sample.mjs --file=<index.html> [--style=<style-id>] [--template=<template-id>]");
  process.exit(2);
}

const html = fs.readFileSync(path.resolve(file), "utf8");
const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, "");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function attr(tag, name) {
  const re = new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i");
  return tag.match(re)?.[2] || null;
}

function stripCssBlocks(input) {
  return input.replace(/<style\b[\s\S]*?<\/style>/gi, "");
}

function findDeckRootTag(input) {
  const candidates = [...input.matchAll(/<(?:main|body|html)\b[^>]*>/gi)].map((match) => match[0]);
  return candidates.find((tag) => /\bdata-(?:style-id|template-id|grammar-profile)=/i.test(tag))
    || candidates.find((tag) => /^<main\b/i.test(tag))
    || candidates.find((tag) => /^<body\b/i.test(tag))
    || candidates[0]
    || "";
}

function findSlides(input) {
  const sectionSlides = [...input.matchAll(/<section\b[^>]*class=(["'])[^"']*\bslide\b[^"']*\1[^>]*>[\s\S]*?<\/section>/gi)]
    .map((match, index) => ({ index: index + 1, html: match[0], tag: match[0].match(/<section\b[^>]*>/i)?.[0] || "" }));
  if (sectionSlides.length) return sectionSlides;
  return [...input.matchAll(/<div\b[^>]*class=(["'])[^"']*\bslide\b[^"']*\1[^>]*>[\s\S]*?<\/div>/gi)]
    .map((match, index) => ({ index: index + 1, html: match[0], tag: match[0].match(/<div\b[^>]*>/i)?.[0] || "" }));
}

function parseStyleBlocks(input) {
  return [...input.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join("\n");
}

function isDarkColor(value) {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return false;
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 64;
}

function extractCssRules(css) {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of css.matchAll(re)) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }
  return rules;
}

function selectorClassNames(selector) {
  return [...selector.matchAll(/\.([_a-zA-Z][-_a-zA-Z0-9]*)/g)].map((match) => match[1]);
}

function classAttrHasRole(input, className, role) {
  const tagRe = new RegExp(`<[^>]+class=(["'])[^"']*\\b${className}\\b[^"']*\\1[^>]*>`, "gi");
  for (const match of input.matchAll(tagRe)) {
    if (new RegExp(`\\bdata-component-role=(["'])${role}\\1`, "i").test(match[0])) return true;
  }
  return false;
}

function countClass(input, className) {
  const tagRe = new RegExp(`class=(["'])[^"']*\\b${className}\\b[^"']*\\1`, "gi");
  return [...input.matchAll(tagRe)].length;
}

function extractClassNames(input) {
  const names = new Set();
  for (const match of input.matchAll(/\bclass=(["'])(.*?)\1/gi)) {
    for (const name of match[2].split(/\s+/).filter(Boolean)) names.add(name);
  }
  return [...names];
}

const rootTag = findDeckRootTag(htmlNoComments);
const rootStyleId = attr(rootTag, "data-style-id") || htmlNoComments.match(/\bdata-style-id=(["'])(.*?)\1/i)?.[2] || null;
const rootTemplateId = attr(rootTag, "data-template-id") || htmlNoComments.match(/\bdata-template-id=(["'])(.*?)\1/i)?.[2] || null;
const declaredStyleId = styleArg || rootStyleId;
const declaredTemplateId = templateArg || rootTemplateId;

if (!rootStyleId) addError("Missing data-style-id on root deck element. Gate 1B samples must declare the selected style id.");
if (!rootTemplateId) addError("Missing data-template-id on root deck element. Gate 1B samples must declare the chosen template id.");
if (styleArg && rootStyleId && rootStyleId !== styleArg) addError(`Root data-style-id="${rootStyleId}" does not match expected style "${styleArg}".`);
if (templateArg && rootTemplateId && rootTemplateId !== templateArg) addError(`Root data-template-id="${rootTemplateId}" does not match expected template "${templateArg}".`);

const style = catalog.styles.find((item) => item.id === declaredStyleId);
if (declaredStyleId && !style) addError(`Unknown style id: ${declaredStyleId}`);

const profileId = declaredStyleId ? grammar.styleProfileMap[declaredStyleId] : null;
const profile = profileId ? grammar.grammarProfiles[profileId] : null;
if (declaredStyleId && !profile) addError(`No execution grammar profile mapped for style id: ${declaredStyleId}`);

const templateContract = declaredTemplateId ? grammar.templateComponentContracts[declaredTemplateId] : null;
if (declaredTemplateId && !templateContract) addError(`Unknown template id: ${declaredTemplateId}. Add it to templateComponentContracts before validating samples.`);

if (rootTag && profileId) {
  const declaredProfile = attr(rootTag, "data-grammar-profile") || htmlNoComments.match(/\bdata-grammar-profile=(["'])(.*?)\1/i)?.[2];
  if (!declaredProfile) {
    addError("Missing data-grammar-profile on root deck element. Gate 1B samples must declare the mapped execution grammar.");
  } else if (declaredProfile !== profileId) {
    addError(`data-grammar-profile="${declaredProfile}" does not match mapped profile "${profileId}" for ${declaredStyleId}.`);
  }
}

const slides = findSlides(htmlNoComments);
if (!slides.length) {
  addError("No slide elements found. Expected <section class=\"slide\" ...> pages.");
}

if (slides.length && slides.length < grammar.requiredSampleContract.minSampleSlides) {
  addError(`Sample has ${slides.length} slide(s). Gate 1B samples require at least ${grammar.requiredSampleContract.minSampleSlides} slides.`);
}

if (slides.length > grammar.requiredSampleContract.maxSampleSlides) {
  addWarning(`Sample has ${slides.length} slides. Gate 1B should stay at ${grammar.requiredSampleContract.maxSampleSlides} slides max unless this is a full production deck.`);
}

const rolesFound = new Set();
slides.forEach((slide) => {
  const layoutId = attr(slide.tag, "data-layout-id") || attr(slide.tag, "data-layout");
  const role = attr(slide.tag, "data-slide-role");
  if (!layoutId) addError(`Slide ${slide.index}: missing data-layout-id. Anonymous layouts are not allowed.`);
  if (!role) addError(`Slide ${slide.index}: missing data-slide-role. Use title/dense/diagram/etc.`);
  if (role) rolesFound.add(role);
});

if (slides.length <= grammar.requiredSampleContract.maxSampleSlides) {
  for (const requiredRole of grammar.requiredSampleContract.sampleRoles) {
    if (!rolesFound.has(requiredRole)) addWarning(`Gate 1B sample does not include a "${requiredRole}" slide role.`);
  }
}

const css = parseStyleBlocks(htmlNoComments);
const cssRules = extractCssRules(css);
const nonCssHtml = stripCssBlocks(htmlNoComments);

if (templateContract?.classPrefixes?.length) {
  const classNames = extractClassNames(nonCssHtml);
  const hasTemplateClass = classNames.some((name) => templateContract.classPrefixes.some((prefix) => name.startsWith(prefix)));
  const roleCount = [...nonCssHtml.matchAll(/\bdata-component-role=(["']).*?\1/gi)].length;
  if (!hasTemplateClass && roleCount < 2) {
    addError(`Template "${declaredTemplateId}" expects component-library usage. Found no class prefix from ${templateContract.classPrefixes.join(", ")} and fewer than 2 role-tagged derived components.`);
  }
}

const hardcodedHexes = [...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((match) => match[0].toLowerCase());
const uniqueHexes = [...new Set(hardcodedHexes)];
if (uniqueHexes.length > 16) {
  addWarning(`CSS uses ${uniqueHexes.length} hardcoded hex colors. Prefer root tokens and var(...) after style selection.`);
}

if (profile) {
  const validator = profile.validator || {};
  const allText = htmlNoComments.toLowerCase();

  if (validator.requireLayoutIds) {
    slides.forEach((slide) => {
      const layoutId = attr(slide.tag, "data-layout-id") || attr(slide.tag, "data-layout");
      if (!layoutId) {
        addError(`Slide ${slide.index}: profile "${profileId}" requires registered layout ids.`);
      } else if (profile.layoutGrammar?.allowedFamilies?.length && !profile.layoutGrammar.allowedFamilies.includes(layoutId)) {
        addError(`Slide ${slide.index}: data-layout-id="${layoutId}" is not in profile "${profileId}" layout whitelist: ${profile.layoutGrammar.allowedFamilies.join(", ")}.`);
      }
    });
  }

  if (validator.forbidSvgText && /<svg\b[\s\S]*?<text\b/i.test(htmlNoComments)) {
    addError(`Profile "${profileId}" forbids visible SVG <text>. Put labels in HTML so type rules remain consistent.`);
  }

  if (validator.forbidRadar && /\b(radar|spider)[-_a-z0-9]*\b/i.test(htmlNoComments)) {
    addError(`Profile "${profileId}" forbids radar/spider chart language unless the style grammar explicitly approves it.`);
  }

  if (validator.forbidCircleBadges) {
    const circleSignals = [
      /border-radius\s*:\s*50%/i,
      /<circle\b/i,
      /\b(circle|round|dot-badge|process-num)\b/i,
      /border-radius\s*:\s*999px/i
    ];
    const matched = circleSignals.filter((re) => re.test(htmlNoComments));
    if (matched.length) {
      addError(`Profile "${profileId}" forbids circular badges/nodes. Use rectangular tabs, rails, ticks, or square marks.`);
    }
  }

  if (validator.forbidPills && /border-radius\s*:\s*(?:999px|[2-9]\dpx)/i.test(css)) {
    addError(`Profile "${profileId}" forbids pill-like rounded elements.`);
  }

  if (validator.forbidBorderRadius) {
    const radiusMatches = [...css.matchAll(/border-radius\s*:\s*([^;]+)/gi)].filter((match) => {
      const value = match[1].trim();
      return !/^(?:0|0px|var\(--r-0\))$/i.test(value);
    });
    if (radiusMatches.length) addError(`Profile "${profileId}" forbids border-radius; found ${radiusMatches.length} nonzero radius declaration(s).`);
  }

  if (validator.forbidBoxShadow && /box-shadow\s*:\s*(?!none\b)/i.test(css)) {
    addError(`Profile "${profileId}" forbids box-shadow.`);
  }

  if (validator.forbidGradientOrbs && /radial-gradient\s*\(\s*circle|orb|blob|bokeh/i.test(css)) {
    addError(`Profile "${profileId}" forbids gradient orbs/blobs/bokeh. Use the profile's approved background motion instead.`);
  }

  if (validator.forbidRandomDarkPanel || validator.requireDarkSurfaceRole) {
    const varMap = new Map();
    for (const match of css.matchAll(/--([_a-zA-Z0-9-]+)\s*:\s*(#[0-9a-f]{3,6})\b/gi)) {
      varMap.set(match[1], match[2]);
    }

    const darkSurfaceClasses = new Set();
    cssRules.forEach((rule) => {
      const bgMatch = rule.body.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      if (!bgMatch) return;
      let value = bgMatch[1].trim();
      const varMatch = value.match(/var\(--([_a-zA-Z0-9-]+)\)/);
      if (varMatch && varMap.has(varMatch[1])) value = varMap.get(varMatch[1]);
      const namedGraphite = /\b(graphite|ink|black|dark|terminal|obsidian)\b/i.test(value);
      if (isDarkColor(value) || namedGraphite) {
        selectorClassNames(rule.selector).forEach((className) => darkSurfaceClasses.add(className));
      }
    });

    const navLike = /^(?:nav|slide-count|deck-shell|slide|bar|brand-dot|tab|badge|button|btn|process-num)$/i;
    const darkContentClasses = [...darkSurfaceClasses].filter((className) => countClass(nonCssHtml, className) > 0 && !navLike.test(className));
    const role = validator.darkSurfaceRole;

    if (validator.requireDarkSurfaceRole && role) {
      const unroled = darkContentClasses.filter((className) => !classAttrHasRole(nonCssHtml, className, role));
      if (unroled.length) {
        addError(`Profile "${profileId}" requires dark content surfaces to declare data-component-role="${role}". Missing on class(es): ${unroled.join(", ")}.`);
      }
      const darkSurfaceCount = darkContentClasses.reduce((sum, className) => sum + countClass(nonCssHtml, className), 0);
      if (validator.maxDarkSurfaceRules && darkSurfaceCount > validator.maxDarkSurfaceRules) {
        addError(`Profile "${profileId}" allows max ${validator.maxDarkSurfaceRules} dark content surface(s) per slide/sample context; found ${darkSurfaceCount}.`);
      }
    } else if (validator.forbidRandomDarkPanel && darkContentClasses.length) {
      addError(`Profile "${profileId}" forbids unmotivated dark panels. Add explicit component roles or use approved surface tokens. Found: ${darkContentClasses.join(", ")}.`);
    }
  }

  if (validator.forbidSerifDisplay) {
    const hSerif = /h[12][^{]*\{[^}]*font-family\s*:\s*var\(--font-serif\)|h[12][^{]*\{[^}]*font-family\s*:[^;}]*serif/i.test(css);
    if (hSerif) addError(`Profile "${profileId}" forbids serif display headings for this style. Use the profile sans title lock.`);
  }

  if (validator.titleWeightMax) {
    for (const match of css.matchAll(/h[12][^{]*\{[^}]*font-weight\s*:\s*(\d+)/gi)) {
      const weight = Number(match[1]);
      if (weight > validator.titleWeightMax) {
        addError(`Profile "${profileId}" caps h1/h2 title weight at ${validator.titleWeightMax}; found ${weight}.`);
      }
    }
    for (const match of css.matchAll(/font\s*:\s*(\d{3,4})\s+[^;{}]*(?:h1|h2|cover-title|title)/gi)) {
      const weight = Number(match[1]);
      if (weight > validator.titleWeightMax) {
        addWarning(`Possible over-heavy title shorthand weight ${weight}; profile cap is ${validator.titleWeightMax}.`);
      }
    }
  }

  if (validator.maxCardsPerSlide) {
    slides.forEach((slide) => {
      const cardCount = [...slide.html.matchAll(/\b(card|panel|tile)\b/gi)].length;
      if (cardCount > validator.maxCardsPerSlide * 3) {
        addWarning(`Slide ${slide.index}: many card/panel/tile signals (${cardCount}). Check against profile maxCardsPerSlide=${validator.maxCardsPerSlide}.`);
      }
    });
  }

  for (const forbidden of profile.shapeGrammar.forbidden || []) {
    const loose = forbidden.replace(/[A-Z]/g, (c) => `[-_ ]?${c.toLowerCase()}`).toLowerCase();
    if (new RegExp(loose, "i").test(allText)) {
      addWarning(`Profile "${profileId}" lists "${forbidden}" as forbidden shape language; found a matching token in the sample.`);
    }
  }
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Style sample validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Style sample validation passed: ${slides.length} slide(s), style ${declaredStyleId || "unknown"}, profile ${profileId || "unknown"}.`);
