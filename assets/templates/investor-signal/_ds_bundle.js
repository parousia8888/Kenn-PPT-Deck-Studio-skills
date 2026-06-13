/* @ds-bundle: {"format":3,"namespace":"InvestorSignalDesignSystem_258ec8","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"KpiStat","sourcePath":"components/core/KpiStat.jsx"},{"name":"ProductFrame","sourcePath":"components/core/ProductFrame.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"d4b6e98ebeeb","components/core/Button.jsx":"f0664e64de24","components/core/Eyebrow.jsx":"de6d3241d125","components/core/KpiStat.jsx":"4fc755c1dfbe","components/core/ProductFrame.jsx":"0ea5642955a6","components/core/Wordmark.jsx":"185aacb03a15","motion.js":"9609744b234a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.InvestorSignalDesignSystem_258ec8 = window.InvestorSignalDesignSystem_258ec8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Small status / stage chip. Sharp corners, hairline or accent fill.
   Variants: outline (default), accent (filled signal), solid (neutral). */
function Badge({
  children,
  variant = "outline",
  dot = false,
  style,
  ...rest
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--sp-2)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase",
    fontWeight: "var(--fw-medium)",
    padding: "5px 9px",
    borderRadius: "var(--radius-1)",
    lineHeight: 1,
    whiteSpace: "nowrap"
  };
  const variants = {
    outline: {
      border: "1px solid var(--hairline)",
      color: "var(--text-secondary)",
      background: "transparent"
    },
    accent: {
      background: "var(--accent)",
      color: "var(--accent-ink)",
      border: "1px solid var(--accent)"
    },
    solid: {
      background: "var(--surface-card)",
      color: "var(--text-primary)",
      border: "1px solid var(--hairline)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "999px",
      background: variant === "accent" ? "var(--accent-ink)" : "var(--accent)"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Decisive keynote CTA. Minimal, architectural — sharp radius, no gloss.
   primary = accent fill · ghost = hairline outline · link = underlined text. */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  style,
  ...rest
}) {
  const Tag = as;
  const sizes = {
    sm: {
      fontSize: "var(--fs-small)",
      padding: "9px 16px"
    },
    md: {
      fontSize: "var(--fs-body)",
      padding: "13px 22px"
    },
    lg: {
      fontSize: "var(--fs-lead)",
      padding: "17px 30px"
    }
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-ink)",
      border: "1px solid var(--accent)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--hairline)"
    },
    link: {
      background: "transparent",
      color: "var(--accent)",
      border: "none",
      padding: 0,
      textDecoration: "underline",
      textUnderlineOffset: "4px"
    }
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--sp-2)",
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-bold)",
      letterSpacing: "var(--tracking-tight)",
      borderRadius: "var(--radius-1)",
      cursor: "pointer",
      lineHeight: 1,
      transition: "transform var(--dur-instant) var(--ease-out), opacity var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (variant !== "link") e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "none";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Mono uppercase label that sits above a claim or section.
   Doubles as a source/footnote label via `tone="muted"`. */
function Eyebrow({
  children,
  tone = "accent",
  as = "div",
  style,
  ...rest
}) {
  const Tag = as;
  const color = tone === "muted" ? "var(--text-muted)" : tone === "secondary" ? "var(--text-secondary)" : "var(--accent)";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      fontWeight: "var(--fw-medium)",
      color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/KpiStat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Dominant metric block: huge tabular figure + caption, optional delta.
   Supports count-up via the motion engine when `count` is set:
   the value renders with [data-count] and InvestorSignal.activate()
   animates it. Without the engine it falls back to the static value. */
function KpiStat({
  value,
  count,
  prefix = "",
  suffix = "",
  decimals = 0,
  caption,
  delta,
  deltaDir = "up",
  size = "lg",
  align = "left",
  style
}) {
  const sizes = {
    sm: "var(--fs-d3)",
    lg: "var(--fs-d1)",
    mega: "var(--fs-mega)"
  };
  const countAttrs = count != null ? {
    "data-count": count,
    "data-count-dec": decimals,
    "data-count-pre": prefix,
    "data-count-suf": suffix
  } : {};
  const display = count != null ? `${prefix}0${suffix}` : value != null ? value : `${prefix}0${suffix}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", _extends({}, countAttrs, {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-black)",
      fontSize: sizes[size] || sizes.lg,
      lineHeight: 1,
      letterSpacing: "var(--tracking-mega)",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-primary)"
    }
  }), display), (caption || delta) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-3)",
      marginTop: "var(--sp-3)",
      justifyContent: align === "center" ? "center" : "flex-start"
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-small)",
      fontWeight: "var(--fw-medium)",
      color: "var(--accent)",
      fontVariantNumeric: "tabular-nums"
    }
  }, deltaDir === "up" ? "▲" : "▼", " ", delta), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-mono)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, caption)));
}
Object.assign(__ds_scope, { KpiStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/KpiStat.jsx", error: String((e && e.message) || e) }); }

// components/core/ProductFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Premium product frame for screenshot / demo moments.
   Large controlled frame, one deep controlled shadow, optional
   terminal-style top bar. No browser chrome unless `chrome="window"`.
   Use [data-anim="screen"] on this for the masked reveal. */
function ProductFrame({
  children,
  chrome = "bar",
  label,
  ratio = "16 / 10",
  anim = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, anim ? {
    "data-anim": "screen"
  } : {}, {
    style: {
      background: "var(--obsidian-850)",
      border: "1px solid var(--obsidian-600)",
      borderRadius: "var(--radius-3)",
      boxShadow: "var(--shadow-frame)",
      overflow: "hidden",
      ...style
    }
  }, rest), chrome !== "none" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-3)",
      padding: "12px 16px",
      borderBottom: "1px solid var(--obsidian-600)",
      background: "var(--obsidian-800)"
    }
  }, chrome === "window" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7
    }
  }, ["#3A3F47", "#3A3F47", "#3A3F47"].map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 11,
      height: 11,
      borderRadius: 999,
      background: c
    }
  }))) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: "var(--accent)"
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: ratio,
      position: "relative",
      background: "var(--obsidian-900)"
    }
  }, children));
}
Object.assign(__ds_scope, { ProductFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProductFrame.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Investor Signal lockup. Inline SVG so it inherits currentColor + --accent.
   mark = square + ascending tick · full = mark + wordmark. */
function Wordmark({
  variant = "full",
  height = 36,
  color = "currentColor",
  style,
  ...rest
}) {
  if (variant === "mark") {
    const s = height;
    return /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 48 48",
      fill: "none",
      style: {
        color,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("rect", {
      x: "1.5",
      y: "1.5",
      width: "45",
      height: "45",
      stroke: "currentColor",
      strokeWidth: "1.8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11 34 L21 25 L28 30 L37 13",
      stroke: "var(--accent)",
      strokeWidth: "3",
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "37",
      cy: "13",
      r: "3.2",
      fill: "var(--accent)"
    }));
  }
  const w = height * (220 / 40);
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: w,
    height: height,
    viewBox: "0 0 220 40",
    fill: "none",
    style: {
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "38",
    height: "38",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 28 L17 21 L23 25 L31 11",
    stroke: "var(--accent)",
    strokeWidth: "2.4",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "31",
    cy: "11",
    r: "2.6",
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "54",
    y: "18",
    fontFamily: "var(--font-display)",
    fontSize: "15",
    fontWeight: "800",
    letterSpacing: "-0.2",
    fill: "currentColor"
  }, "INVESTOR"), /*#__PURE__*/React.createElement("text", {
    x: "54",
    y: "34",
    fontFamily: "var(--font-mono)",
    fontSize: "12.5",
    fontWeight: "500",
    letterSpacing: "3.6",
    fill: "currentColor",
    opacity: "0.62"
  }, "SIGNAL"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// motion.js
try { (() => {
/* Investor Signal — Motion & Dynamic Background Engine
   Plain HTML/CSS/JS. Works standalone in any browser file.

   Responsibilities
   1. Dynamic background layer (canvas 2D) — a subtle Bloomberg-grade
      market grid + drifting accent ticker. Theme-aware (reads --accent
      and surface from the active slide). Premium, never noisy.
   2. Semantic slide-enter system — sets [data-deck-active] and staggers
      each [data-anim] child via --anim-delay.
   3. KPI count-up for [data-count] when a slide activates.
   4. Reduced-motion + low-power fallbacks (content always visible).
   5. Keyboard B → toggle body.low-power (stops RAF, freezes static).

   Usage:
     <canvas class="is-bg-canvas"></canvas>   // one per stage (optional)
     InvestorSignal.init({ slideSelector: '[data-slide]' });
     InvestorSignal.activate(slideEl)          // mark a slide active
*/
(function (global) {
  "use strict";

  var reduceMotion = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- BACKGROUND */
  function Background(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.slide = canvas.closest("[data-slide]");
    this.raf = 0;
    this.t = 0;
    this.ticks = [];
    this.running = false;
    this.resize();
    global.addEventListener("resize", this.resize.bind(this));
  }
  Background.prototype.theme = function () {
    var cs = getComputedStyle(this.canvas.closest("[data-mode]") || document.body);
    return {
      accent: (cs.getPropertyValue("--accent") || "#FB3B1E").trim(),
      light: this.canvas.closest('[data-mode="evidence"]') != null
    };
  };
  Background.prototype.resize = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var r = this.canvas.getBoundingClientRect();
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.seed();
  };
  Background.prototype.seed = function () {
    this.ticks = [];
    var cols = Math.max(8, Math.round(this.w / 96));
    for (var i = 0; i < cols; i++) {
      this.ticks.push({
        x: (i + 0.5) / cols,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.35,
        amp: 0.04 + Math.random() * 0.10,
        hot: Math.random() < 0.12 // a few accent ticks
      });
    }
  };
  Background.prototype.frame = function () {
    if (!this.running) return;
    this.t += 0.0045;
    var ctx = this.ctx,
      w = this.w,
      h = this.h,
      th = this.theme();
    ctx.clearRect(0, 0, w, h);

    // faint baseline grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = th.light ? "rgba(15,18,22,0.05)" : "rgba(180,190,200,0.05)";
    var rows = 5;
    for (var r = 1; r < rows; r++) {
      var y = r / rows * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // drifting market ticks (vertical, slow vertical wander)
    for (var i = 0; i < this.ticks.length; i++) {
      var p = this.ticks[i];
      var x = p.x * w + Math.sin(this.t * p.speed + p.phase) * (w * 0.012);
      var midY = h * 0.5 + Math.sin(this.t * p.speed * 0.7 + p.phase) * (h * p.amp);
      var len = h * (0.10 + p.amp * 1.6);
      var g = ctx.createLinearGradient(0, midY - len, 0, midY + len);
      var base = th.light ? "15,18,22" : "200,210,220";
      g.addColorStop(0, "rgba(" + base + ",0)");
      g.addColorStop(0.5, p.hot ? hexToRgba(th.accent, th.light ? 0.16 : 0.22) : "rgba(" + base + "," + (th.light ? 0.07 : 0.085) + ")");
      g.addColorStop(1, "rgba(" + base + ",0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = p.hot ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(x, midY - len);
      ctx.lineTo(x, midY + len);
      ctx.stroke();
      if (p.hot) {
        // small accent node travelling the tick
        var ny = midY + Math.sin(this.t * 1.4 + p.phase) * len * 0.8;
        ctx.fillStyle = hexToRgba(th.accent, th.light ? 0.55 : 0.7);
        ctx.beginPath();
        ctx.arc(x, ny, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    this.raf = requestAnimationFrame(this.frame.bind(this));
  };
  Background.prototype.start = function () {
    if (this.running || reduceMotion) return;
    this.running = true;
    this.frame();
  };
  Background.prototype.stop = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.w, this.h);
  };
  function hexToRgba(hex, a) {
    hex = (hex || "#FB3B1E").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) {
      return c + c;
    }).join("");
    var n = parseInt(hex, 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ---------------------------------------------------------- REVEALS */
  function stagger(slide) {
    var items = slide.querySelectorAll("[data-anim]");
    items.forEach(function (el) {
      var ord = el.hasAttribute("data-anim-order") ? parseFloat(el.getAttribute("data-anim-order")) : indexAmong(items, el);
      var step = parseFloat(el.getAttribute("data-anim-step") || "90");
      var base = parseFloat(el.getAttribute("data-anim-delay-base") || "120");
      el.style.setProperty("--anim-delay", base + ord * step + "ms");
    });
  }
  function indexAmong(list, el) {
    for (var i = 0; i < list.length; i++) if (list[i] === el) return i;
    return 0;
  }
  function countUp(slide) {
    if (reduceMotion || document.body.classList.contains("low-power")) {
      slide.querySelectorAll("[data-count]").forEach(function (el) {
        el.textContent = format(el, parseFloat(el.getAttribute("data-count")));
      });
      return;
    }
    slide.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dur = parseFloat(el.getAttribute("data-count-dur") || "1400");
      var start = performance.now();
      function tick(now) {
        var k = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - k, 3); // easeOutCubic
        el.textContent = format(el, target * e);
        if (k < 1) requestAnimationFrame(tick);else el.textContent = format(el, target);
      }
      requestAnimationFrame(tick);
    });
  }
  function format(el, v) {
    var dec = parseInt(el.getAttribute("data-count-dec") || "0", 10);
    var pre = el.getAttribute("data-count-pre") || "";
    var suf = el.getAttribute("data-count-suf") || "";
    var s = v.toFixed(dec);
    if (el.getAttribute("data-count-sep") !== "off") s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return pre + s + suf;
  }

  /* ---------------------------------------------------------- PUBLIC */
  var IS = {
    backgrounds: [],
    init: function (opts) {
      opts = opts || {};
      document.querySelectorAll("canvas.is-bg-canvas").forEach(function (c) {
        IS.backgrounds.push(new Background(c));
      });
      // For a standalone page (no slides) start all backgrounds now;
      // decks start the active slide's background via activate().
      var hasSlides = document.querySelector("[data-slide]");
      if (!hasSlides && !document.body.classList.contains("low-power")) IS.startBg();

      // B toggles low-power
      document.addEventListener("keydown", function (e) {
        if ((e.key === "b" || e.key === "B") && !e.metaKey && !e.ctrlKey) {
          IS.toggleLowPower();
        }
      });
      // ensure a hint node exists
      if (!document.querySelector(".lp-hint")) {
        var h = document.createElement("div");
        h.className = "lp-hint";
        h.textContent = "Static mode — press B to resume";
        document.body.appendChild(h);
      }
    },
    startBg: function (onlySlide) {
      IS.backgrounds.forEach(function (b) {
        if (!onlySlide || b.slide === onlySlide) b.start();else b.stop();
      });
    },
    stopBg: function () {
      IS.backgrounds.forEach(function (b) {
        b.stop();
      });
    },
    activate: function (slide) {
      if (!slide) return;
      document.querySelectorAll('[data-slide][data-deck-active="true"]').forEach(function (s) {
        s.setAttribute("data-deck-active", "false");
      });
      stagger(slide);
      // force reflow so transition runs from hidden state
      void slide.offsetWidth;
      slide.setAttribute("data-deck-active", "true");
      countUp(slide);
      if (!document.body.classList.contains("low-power")) IS.startBg(slide);
    },
    toggleLowPower: function () {
      var on = document.body.classList.toggle("low-power");
      if (on) {
        IS.stopBg();
        document.querySelectorAll("[data-count]").forEach(function (el) {
          if (el.getAttribute("data-count")) el.textContent = format(el, parseFloat(el.getAttribute("data-count")));
        });
      } else if (!reduceMotion) {
        var act = document.querySelector('[data-slide][data-deck-active="true"]');
        IS.startBg(act || undefined);
      }
    }
  };
  global.InvestorSignal = IS;
})(window);
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.KpiStat = __ds_scope.KpiStat;

__ds_ns.ProductFrame = __ds_scope.ProductFrame;

__ds_ns.Wordmark = __ds_scope.Wordmark;

})();
