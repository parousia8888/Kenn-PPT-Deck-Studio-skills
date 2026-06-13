/* @ds-bundle: {"format":3,"namespace":"ProofAtlasDesignSystem_1be694","components":[{"name":"BarChart","sourcePath":"components/core/BarChart.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Coordinate","sourcePath":"components/core/Coordinate.jsx"},{"name":"DataTable","sourcePath":"components/core/DataTable.jsx"},{"name":"EvidenceCell","sourcePath":"components/core/EvidenceCell.jsx"},{"name":"Metric","sourcePath":"components/core/Metric.jsx"},{"name":"RiskMarker","sourcePath":"components/core/RiskMarker.jsx"},{"name":"SourceNote","sourcePath":"components/core/SourceNote.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"assets/atlas-motion.js":"94f15f9b58ed","components/core/BarChart.jsx":"cb88403ea7fa","components/core/Button.jsx":"8abce7d4573d","components/core/Coordinate.jsx":"9047a162cc90","components/core/DataTable.jsx":"072999c649fe","components/core/EvidenceCell.jsx":"af3a9bb3cfa0","components/core/Metric.jsx":"d057de2628b4","components/core/RiskMarker.jsx":"86fc6f2c0f37","components/core/SourceNote.jsx":"6e6546940d95","components/core/Tag.jsx":"1cbb9a8cf2ab"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ProofAtlasDesignSystem_1be694 = window.ProofAtlasDesignSystem_1be694 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/atlas-motion.js
try { (() => {
/* Proof Atlas — Motion engine (vanilla, standalone-safe).
   1. Animated atlas-grid canvas background (subtle, premium, readable).
   2. Semantic slide-enter reveal controller (reads data-anim recipes).
   3. Reduced-motion + low-power fallback.
   4. Keyboard toggle: press B → static low-power mode.

   Usage:
     <div class="atlas-stage" data-stage data-atlas-bg="cover"> … </div>
     <script src="assets/atlas-motion.js"></script>
   Auto-inits everything on load. API also exposed on window.AtlasMotion. */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Static-first safety: only gate hidden states once we know motion will run.
  // If this script never executes (load failure), the flag is never set and all
  // [data-anim] content stays in its final visible state.
  if (!prefersReduced) {
    document.documentElement.classList.add("anim-ready");
  }
  var loops = []; // active rAF background instances
  var STAGGER = 80; // ms between sequenced items
  var SOURCE_DELAY = 360; // source notes wait this long after their group

  /* ---------------------------------------------------------------
     1. ATLAS GRID BACKGROUND  (canvas 2D)
     A faint coordinate field: ruled grid, intersection ticks, sparse
     measurement marks, and a slow scanning band. Density set by mode:
       "cover"  — visible on covers / chapter pages
       "quiet"  — subdued for data-heavy pages
  ----------------------------------------------------------------*/
  function mountBackground(host, mode) {
    mode = mode || "cover";
    var quiet = mode === "quiet";
    var cv = document.createElement("canvas");
    cv.className = "atlas-bg-canvas";
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block;";
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.insertBefore(cv, host.firstChild);
    // lift real content above the canvas
    for (var i = 0; i < host.children.length; i++) {
      var ch = host.children[i];
      if (ch === cv) continue;
      var pos = getComputedStyle(ch).position;
      if (pos === "static") ch.style.position = "relative";
      if (!ch.style.zIndex) ch.style.zIndex = "1";
    }
    var ctx = cv.getContext("2d");
    var W = 0,
      H = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    var GRID = quiet ? 64 : 48; // grid cell size (css px)
    var marks = []; // sparse measurement marks

    function resize() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedMarks();
    }
    function seedMarks() {
      marks = [];
      var cols = Math.ceil(W / GRID),
        rows = Math.ceil(H / GRID);
      var n = Math.round(cols * rows * (quiet ? 0.04 : 0.07));
      for (var k = 0; k < n; k++) {
        marks.push({
          x: Math.floor(Math.random() * cols) * GRID,
          y: Math.floor(Math.random() * rows) * GRID,
          t: Math.random() * Math.PI * 2,
          kind: Math.random() < 0.5 ? "tick" : "ring"
        });
      }
    }
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      grid(0); // no scan
      ctx.restore && null;
    }
    function grid(scanX) {
      ctx.clearRect(0, 0, W, H);
      var ink = "23,21,15"; // --ink rgb
      var base = quiet ? 0.045 : 0.07;

      // fine grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(" + ink + "," + base + ")";
      ctx.beginPath();
      for (var x = 0; x <= W; x += GRID) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, H);
      }
      for (var y = 0; y <= H; y += GRID) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(W, y + 0.5);
      }
      ctx.stroke();

      // major grid (every 4th line, slightly stronger)
      ctx.strokeStyle = "rgba(" + ink + "," + base * 1.8 + ")";
      ctx.beginPath();
      for (var x2 = 0; x2 <= W; x2 += GRID * 4) {
        ctx.moveTo(x2 + 0.5, 0);
        ctx.lineTo(x2 + 0.5, H);
      }
      for (var y2 = 0; y2 <= H; y2 += GRID * 4) {
        ctx.moveTo(0, y2 + 0.5);
        ctx.lineTo(W, y2 + 0.5);
      }
      ctx.stroke();

      // intersection ticks at major nodes
      ctx.strokeStyle = "rgba(" + ink + "," + base * 2.6 + ")";
      ctx.beginPath();
      for (var gx = 0; gx <= W; gx += GRID * 4) {
        for (var gy = 0; gy <= H; gy += GRID * 4) {
          ctx.moveTo(gx - 3, gy + 0.5);
          ctx.lineTo(gx + 3, gy + 0.5);
          ctx.moveTo(gx + 0.5, gy - 3);
          ctx.lineTo(gx + 0.5, gy + 3);
        }
      }
      ctx.stroke();

      // sparse measurement marks (gently pulsing)
      var now = performance.now() / 1000;
      for (var m = 0; m < marks.length; m++) {
        var mk = marks[m];
        var pulse = 0.5 + 0.5 * Math.sin(now * 0.6 + mk.t);
        var a = base * (1.5 + pulse * 1.6);
        ctx.strokeStyle = "rgba(" + ink + "," + a + ")";
        ctx.lineWidth = 1;
        if (mk.kind === "ring") {
          ctx.beginPath();
          ctx.arc(mk.x, mk.y, 3.2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(mk.x - 4, mk.y);
          ctx.lineTo(mk.x + 4, mk.y);
          ctx.moveTo(mk.x, mk.y - 4);
          ctx.lineTo(mk.x, mk.y + 4);
          ctx.stroke();
        }
      }

      // slow scanning band — a faint vertical sweep (the "reading" line)
      if (scanX !== null) {
        var bandW = 140;
        var g = ctx.createLinearGradient(scanX - bandW, 0, scanX + bandW, 0);
        g.addColorStop(0, "rgba(26,54,196,0)");
        g.addColorStop(0.5, "rgba(26,54,196," + (quiet ? 0.022 : 0.04) + ")");
        g.addColorStop(1, "rgba(26,54,196,0)");
        ctx.fillStyle = g;
        ctx.fillRect(scanX - bandW, 0, bandW * 2, H);
        // crisp scan line
        ctx.strokeStyle = "rgba(26,54,196," + (quiet ? 0.05 : 0.09) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scanX + 0.5, 0);
        ctx.lineTo(scanX + 0.5, H);
        ctx.stroke();
      }
    }
    var raf = null,
      start = null;
    function frame(ts) {
      if (document.body.classList.contains("low-power")) return;
      if (!start) start = ts;
      var period = 14000;
      var p = (ts - start) % period / period; // 0..1
      var scanX = -160 + p * (W + 320);
      grid(scanX);
      raf = requestAnimationFrame(frame);
    }
    var inst = {
      host: host,
      stop: function () {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      },
      startLoop: function () {
        this.stop();
        if (prefersReduced || document.body.classList.contains("low-power")) {
          drawStatic();
          return;
        }
        drawStatic(); // paint one frame immediately (robust if rAF is throttled)
        start = null;
        raf = requestAnimationFrame(frame);
      },
      resize: function () {
        resize();
        if (prefersReduced || document.body.classList.contains("low-power")) drawStatic();
      }
    };
    resize();
    inst.startLoop();
    var rh = function () {
      inst.resize();
    };
    window.addEventListener("resize", rh);
    loops.push(inst);
    return inst;
  }

  /* ---------------------------------------------------------------
     2. REVEAL CONTROLLER
     Sequences [data-anim] blocks within a stage. Order = data-seq if set,
     else document order. Source notes always come last.
  ----------------------------------------------------------------*/
  function play(stage) {
    if (!stage) return;
    if (prefersReduced || document.body.classList.contains("low-power")) {
      stage.classList.add("is-in"); // CSS forces final state anyway
      return;
    }
    var items = Array.prototype.slice.call(stage.querySelectorAll("[data-anim]"));
    // group: sources last
    var primary = items.filter(function (el) {
      return el.getAttribute("data-anim") !== "source";
    });
    var sources = items.filter(function (el) {
      return el.getAttribute("data-anim") === "source";
    });
    primary.forEach(function (el) {
      var seq = el.hasAttribute("data-seq") ? parseInt(el.getAttribute("data-seq"), 10) : null;
      var idx = seq !== null ? seq : primary.indexOf(el);
      var delay = el.hasAttribute("data-delay") ? parseInt(el.getAttribute("data-delay"), 10) : idx * STAGGER;
      el.style.transitionDelay = delay + "ms";
    });
    var maxPrimary = primary.reduce(function (mx, el) {
      var d = parseInt(el.style.transitionDelay, 10) || 0;
      return Math.max(mx, d);
    }, 0);
    sources.forEach(function (el, i) {
      el.style.transitionDelay = maxPrimary + SOURCE_DELAY + i * STAGGER + "ms";
    });

    // commit the initial hidden state with a forced reflow, then reveal.
    // No rAF — setTimeout fires even when the tab is backgrounded, so content
    // can never get stuck hidden.
    void stage.offsetWidth;
    setTimeout(function () {
      stage.classList.add("is-in");
    }, 30);
  }
  function reset(stage) {
    if (!stage) return;
    stage.classList.remove("is-in");
    Array.prototype.slice.call(stage.querySelectorAll("[data-anim]")).forEach(function (el) {
      el.style.transitionDelay = "";
    });
  }

  /* ---------------------------------------------------------------
     3 + 4. LOW-POWER MODE (press B)
  ----------------------------------------------------------------*/
  function ensureHint() {
    if (document.querySelector(".atlas-lowpower-hint")) return;
    var h = document.createElement("div");
    h.className = "atlas-lowpower-hint";
    h.textContent = "STATIC MODE · PRESS B TO RESUME MOTION";
    document.body.appendChild(h);
  }
  function setLowPower(on) {
    document.body.classList.toggle("low-power", on);
    if (on) {
      loops.forEach(function (l) {
        l.stop();
        l.resize();
      }); // freeze + draw static frame
    } else {
      loops.forEach(function (l) {
        l.startLoop();
      });
    }
  }
  function toggleLowPower() {
    setLowPower(!document.body.classList.contains("low-power"));
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "b" || e.key === "B") {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      toggleLowPower();
    }
  });

  /* ---------------------------------------------------------------
     AUTO-INIT
  ----------------------------------------------------------------*/
  function init() {
    ensureHint();
    // backgrounds
    Array.prototype.slice.call(document.querySelectorAll("[data-atlas-bg]")).forEach(function (host) {
      mountBackground(host, host.getAttribute("data-atlas-bg") || "cover");
    });
    // standalone stages (single-page cards). Deck hosts call play() per slide.
    var stages = Array.prototype.slice.call(document.querySelectorAll("[data-stage]"));
    if (stages.length === 1 && !document.querySelector("[data-deck]")) {
      play(stages[0]);
    } else {
      stages.forEach(function (s) {
        if (s.hasAttribute("data-autoplay")) play(s);
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.AtlasMotion = {
    mountBackground: mountBackground,
    play: play,
    reset: reset,
    setLowPower: setLowPower,
    toggleLowPower: toggleLowPower
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/atlas-motion.js", error: String((e && e.message) || e) }); }

// components/core/BarChart.jsx
try { (() => {
/**
 * Proof Atlas — BarChart
 * Custom horizontal bar chart (no chart-library styling). Hairline baseline,
 * mono labels, light-weight values. Bars carry data-anim="draw-x" so they
 * grow when revealed inside an .atlas-stage.
 */
function BarChart({
  data = [],
  max,
  unit = "",
  source,
  ...rest
}) {
  const top = max != null ? max : Math.max(...data.map(d => d.value), 1);
  return /*#__PURE__*/React.createElement("div", rest, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }
  }, data.map((d, i) => {
    const pct = Math.max(0, Math.min(100, d.value / top * 100));
    const accent = d.accent !== false;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "grid",
        gridTemplateColumns: "140px 1fr auto",
        alignItems: "center",
        gap: "12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--gray-1)",
        textAlign: "right",
        lineHeight: 1.2
      }
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: "18px",
        background: "var(--paper-1)",
        borderBottom: "1px solid var(--rule)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-anim": "draw-x",
      "data-seq": i,
      style: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: pct + "%",
        background: accent ? "var(--blue)" : "var(--gray-3)",
        transformOrigin: "left center"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 300,
        fontSize: "20px",
        color: "var(--ink)",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        minWidth: "52px",
        textAlign: "right"
      }
    }, d.value, unit && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "0.55em",
        color: "var(--gray-1)",
        marginLeft: "1px"
      }
    }, unit)));
  })), source && /*#__PURE__*/React.createElement("div", {
    "data-anim": "source",
    style: {
      marginTop: "14px",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      fontFamily: "var(--font-mono)",
      fontSize: "9px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--gray-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "5px",
      height: "5px",
      background: "var(--blue)"
    }
  }), source));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — Button
 * Restrained institutional button. No shadow, near-zero radius.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  as = "button",
  ...rest
}) {
  const pad = size === "sm" ? "6px 12px" : "9px 18px";
  const fz = size === "sm" ? "11px" : "12px";
  const base = {
    fontFamily: "var(--font-mono)",
    fontSize: fz,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    lineHeight: 1,
    padding: pad,
    borderRadius: "var(--r-1)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--d-fast) var(--e-out), color var(--d-fast) var(--e-out), border-color var(--d-fast) var(--e-out)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    opacity: disabled ? 0.4 : 1,
    userSelect: "none"
  };
  const variants = {
    primary: {
      background: "var(--blue)",
      color: "var(--paper-pure)",
      border: "1px solid var(--blue)"
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--gray-1)",
      border: "1px solid var(--rule)"
    }
  };
  const Tag = as;
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? variant === "primary" ? {
    background: "var(--blue-deep)",
    borderColor: "var(--blue-deep)"
  } : variant === "secondary" ? {
    background: "var(--ink)",
    color: "var(--paper-pure)"
  } : {
    borderColor: "var(--ink)",
    color: "var(--ink)"
  } : null;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle
    },
    disabled: as === "button" ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Coordinate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — Coordinate
 * Mono coordinate / locator label, e.g. [ 42.361°N · 071.057°W ].
 */
function Coordinate({
  lat,
  lng,
  raw,
  brackets = true,
  color = "var(--blue)",
  ...rest
}) {
  const text = raw != null ? raw : `${lat} · ${lng}`;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10.5px",
      letterSpacing: "0.06em",
      color,
      whiteSpace: "nowrap"
    }
  }, rest), brackets ? `[ ${text} ]` : text);
}
Object.assign(__ds_scope, { Coordinate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Coordinate.jsx", error: String((e && e.message) || e) }); }

// components/core/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — DataTable
 * Ruled, mono-headed table. Columns may be aligned; an optional source row
 * sits below. Zebra is paper-tone, not color.
 */
function DataTable({
  columns = [],
  rows = [],
  source,
  zebra = true,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      border: "1px solid var(--rule)",
      background: "var(--paper-pure)"
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: c.align || "left",
      fontFamily: "var(--font-mono)",
      fontSize: "9.5px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--gray-2)",
      fontWeight: 500,
      padding: "8px 12px",
      borderBottom: "2px solid var(--ink)",
      whiteSpace: "nowrap"
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      background: zebra && ri % 2 ? "var(--paper-1)" : "transparent"
    }
  }, columns.map((c, ci) => {
    const val = Array.isArray(r) ? r[ci] : r[c.key];
    const emphasize = c.emphasize;
    return /*#__PURE__*/React.createElement("td", {
      key: ci,
      style: {
        textAlign: c.align || "left",
        padding: "9px 12px",
        borderBottom: "1px solid var(--rule-faint)",
        fontSize: emphasize ? "15px" : "13px",
        fontFamily: emphasize ? "var(--font-display)" : c.mono ? "var(--font-mono)" : "var(--font-body)",
        fontWeight: emphasize ? 300 : 400,
        color: ci === 0 ? "var(--ink)" : "var(--gray-1)",
        fontVariantNumeric: "tabular-nums"
      }
    }, val);
  }))))), source && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "7px 12px",
      borderTop: "1px solid var(--rule)",
      fontFamily: "var(--font-mono)",
      fontSize: "9px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--gray-3)"
    }
  }, source));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/core/RiskMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — RiskMarker
 * Restrained limitation / risk row. Oxide marker, never alarmist.
 */
function RiskMarker({
  level = "limitation",
  title,
  children,
  id,
  style,
  ...rest
}) {
  const labels = {
    limitation: "Limitation",
    risk: "Risk",
    caveat: "Caveat"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: "12px",
      padding: "12px 14px",
      background: "var(--paper-pure)",
      borderTop: "1px solid var(--rule)",
      borderBottom: "1px solid var(--rule)",
      borderLeft: "2px solid var(--oxide)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "8px",
      height: "8px",
      marginTop: "4px",
      background: "var(--oxide)",
      flex: "none",
      transform: "rotate(45deg)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "9.5px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--oxide)"
    }
  }, labels[level] || level), id && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "9px",
      color: "var(--gray-3)",
      letterSpacing: "0.08em"
    }
  }, id)), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      fontWeight: 500,
      color: "var(--ink)",
      marginBottom: children ? "3px" : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--gray-1)",
      lineHeight: 1.45
    }
  }, children)));
}
Object.assign(__ds_scope, { RiskMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/RiskMarker.jsx", error: String((e && e.message) || e) }); }

// components/core/SourceNote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — SourceNote
 * Provenance line that accompanies every data point.
 * Renders:  ▪ SOURCE · <method> · <id>
 */
function SourceNote({
  method,
  id,
  label = "Source",
  align = "left",
  style,
  ...rest
}) {
  const parts = [label, method, id].filter(Boolean).join(" · ");
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      fontFamily: "var(--font-mono)",
      fontSize: "9px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--gray-3)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "5px",
      height: "5px",
      background: "var(--blue)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", null, parts));
}
Object.assign(__ds_scope, { SourceNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SourceNote.jsx", error: String((e && e.message) || e) }); }

// components/core/EvidenceCell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — EvidenceCell
 * The system's modular card: hairline border, mono header (id + coordinate),
 * body, and a mono source-note footer. Squared, no shadow.
 */
function EvidenceCell({
  cellId,
  coord,
  method,
  id,
  children,
  muted = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      background: muted ? "var(--paper-1)" : "var(--paper-pure)",
      border: "1px solid var(--rule)",
      borderRadius: "var(--r-0)",
      ...style
    }
  }, rest), (cellId || coord) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      padding: "7px 10px",
      borderBottom: "1px solid var(--rule)",
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "9.5px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--gray-2)"
    }
  }, cellId), coord && /*#__PURE__*/React.createElement(__ds_scope.Coordinate, {
    raw: coord,
    brackets: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px",
      flex: 1
    }
  }, children), (method || id) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "7px 10px",
      borderTop: "1px solid var(--rule-faint)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SourceNote, {
    method: method,
    id: id
  })));
}
Object.assign(__ds_scope, { EvidenceCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/EvidenceCell.jsx", error: String((e && e.message) || e) }); }

// components/core/Metric.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — Metric
 * Large, light-weight number with unit, label, optional delta and source.
 */
function Metric({
  value,
  unit,
  label,
  delta,
  deltaDir,
  method,
  id,
  size = "l",
  ...rest
}) {
  const sizes = {
    xl: "92px",
    l: "64px",
    m: "44px",
    s: "32px"
  };
  const fz = sizes[size] || sizes.l;
  const dir = deltaDir || (delta && String(delta).trim().startsWith("-") ? "down" : "up");
  const deltaColor = dir === "down" ? "var(--marker-down)" : "var(--marker-up)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 200,
      fontSize: fz,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "var(--ink)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.4em",
      fontWeight: 300,
      color: "var(--gray-1)",
      marginLeft: "2px"
    }
  }, unit)), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      letterSpacing: "0.04em",
      color: deltaColor,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", null, dir === "down" ? "▾" : "▴"), delta)), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--gray-1)",
      lineHeight: 1.4,
      maxWidth: "32ch"
    }
  }, label), (method || id) && /*#__PURE__*/React.createElement(__ds_scope.SourceNote, {
    method: method,
    id: id
  }));
}
Object.assign(__ds_scope, { Metric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Metric.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Proof Atlas — Tag
 * Mono uppercase structural label. Optional leading index/glyph.
 */
function Tag({
  children,
  variant = "default",
  index,
  ...rest
}) {
  const variants = {
    default: {
      color: "var(--gray-1)",
      borderColor: "var(--rule)",
      background: "var(--paper-pure)"
    },
    accent: {
      color: "var(--blue)",
      borderColor: "var(--blue)",
      background: "transparent"
    },
    solid: {
      color: "var(--paper-pure)",
      borderColor: "var(--ink)",
      background: "var(--ink)"
    },
    risk: {
      color: "var(--oxide)",
      borderColor: "var(--oxide)",
      background: "transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "4px 8px",
      border: "1px solid",
      borderRadius: "var(--r-1)",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
      ...variants[variant]
    }
  }, rest), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.55,
      fontVariantNumeric: "tabular-nums"
    }
  }, String(index).padStart(2, "0")), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Coordinate = __ds_scope.Coordinate;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.EvidenceCell = __ds_scope.EvidenceCell;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.RiskMarker = __ds_scope.RiskMarker;

__ds_ns.SourceNote = __ds_scope.SourceNote;

__ds_ns.Tag = __ds_scope.Tag;

})();
