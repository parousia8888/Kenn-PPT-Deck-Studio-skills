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

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Static-first safety: only gate hidden states once we know motion will run.
  // If this script never executes (load failure), the flag is never set and all
  // [data-anim] content stays in its final visible state.
  if (!prefersReduced) {
    document.documentElement.classList.add("anim-ready");
  }

  var loops = [];           // active rAF background instances
  var STAGGER = 80;         // ms between sequenced items
  var SOURCE_DELAY = 360;   // source notes wait this long after their group

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
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var GRID = quiet ? 64 : 48;          // grid cell size (css px)
    var marks = [];                       // sparse measurement marks

    function resize() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedMarks();
    }
    function seedMarks() {
      marks = [];
      var cols = Math.ceil(W / GRID), rows = Math.ceil(H / GRID);
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
      grid(0);                 // no scan
      ctx.restore && null;
    }

    function grid(scanX) {
      ctx.clearRect(0, 0, W, H);
      var ink = "23,21,15";    // --ink rgb
      var base = quiet ? 0.045 : 0.07;

      // fine grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(" + ink + "," + base + ")";
      ctx.beginPath();
      for (var x = 0; x <= W; x += GRID) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
      for (var y = 0; y <= H; y += GRID) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
      ctx.stroke();

      // major grid (every 4th line, slightly stronger)
      ctx.strokeStyle = "rgba(" + ink + "," + (base * 1.8) + ")";
      ctx.beginPath();
      for (var x2 = 0; x2 <= W; x2 += GRID * 4) { ctx.moveTo(x2 + 0.5, 0); ctx.lineTo(x2 + 0.5, H); }
      for (var y2 = 0; y2 <= H; y2 += GRID * 4) { ctx.moveTo(0, y2 + 0.5); ctx.lineTo(W, y2 + 0.5); }
      ctx.stroke();

      // intersection ticks at major nodes
      ctx.strokeStyle = "rgba(" + ink + "," + (base * 2.6) + ")";
      ctx.beginPath();
      for (var gx = 0; gx <= W; gx += GRID * 4) {
        for (var gy = 0; gy <= H; gy += GRID * 4) {
          ctx.moveTo(gx - 3, gy + 0.5); ctx.lineTo(gx + 3, gy + 0.5);
          ctx.moveTo(gx + 0.5, gy - 3); ctx.lineTo(gx + 0.5, gy + 3);
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
          ctx.beginPath(); ctx.arc(mk.x, mk.y, 3.2, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(mk.x - 4, mk.y); ctx.lineTo(mk.x + 4, mk.y);
          ctx.moveTo(mk.x, mk.y - 4); ctx.lineTo(mk.x, mk.y + 4);
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
        ctx.beginPath(); ctx.moveTo(scanX + 0.5, 0); ctx.lineTo(scanX + 0.5, H); ctx.stroke();
      }
    }

    var raf = null, start = null;
    function frame(ts) {
      if (document.body.classList.contains("low-power")) return;
      if (!start) start = ts;
      var period = 14000;
      var p = ((ts - start) % period) / period;     // 0..1
      var scanX = -160 + p * (W + 320);
      grid(scanX);
      raf = requestAnimationFrame(frame);
    }

    var inst = {
      host: host,
      stop: function () { if (raf) cancelAnimationFrame(raf); raf = null; },
      startLoop: function () {
        this.stop();
        if (prefersReduced || document.body.classList.contains("low-power")) { drawStatic(); return; }
        drawStatic();            // paint one frame immediately (robust if rAF is throttled)
        start = null; raf = requestAnimationFrame(frame);
      },
      resize: function () { resize(); if (prefersReduced || document.body.classList.contains("low-power")) drawStatic(); }
    };

    resize();
    inst.startLoop();
    var rh = function () { inst.resize(); };
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
      stage.classList.add("is-in");   // CSS forces final state anyway
      return;
    }
    var items = Array.prototype.slice.call(stage.querySelectorAll("[data-anim]"));
    // group: sources last
    var primary = items.filter(function (el) { return el.getAttribute("data-anim") !== "source"; });
    var sources = items.filter(function (el) { return el.getAttribute("data-anim") === "source"; });

    primary.forEach(function (el) {
      var seq = el.hasAttribute("data-seq") ? parseInt(el.getAttribute("data-seq"), 10) : null;
      var idx = seq !== null ? seq : primary.indexOf(el);
      var delay = el.hasAttribute("data-delay") ? parseInt(el.getAttribute("data-delay"), 10) : idx * STAGGER;
      el.style.transitionDelay = delay + "ms";
    });
    var maxPrimary = primary.reduce(function (mx, el) {
      var d = parseInt(el.style.transitionDelay, 10) || 0; return Math.max(mx, d);
    }, 0);
    sources.forEach(function (el, i) {
      el.style.transitionDelay = (maxPrimary + SOURCE_DELAY + i * STAGGER) + "ms";
    });

    // commit the initial hidden state with a forced reflow, then reveal.
    // No rAF — setTimeout fires even when the tab is backgrounded, so content
    // can never get stuck hidden.
    void stage.offsetWidth;
    setTimeout(function () { stage.classList.add("is-in"); }, 30);
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
      loops.forEach(function (l) { l.stop(); l.resize(); }); // freeze + draw static frame
    } else {
      loops.forEach(function (l) { l.startLoop(); });
    }
  }
  function toggleLowPower() { setLowPower(!document.body.classList.contains("low-power")); }

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
  } else { init(); }

  window.AtlasMotion = {
    mountBackground: mountBackground,
    play: play,
    reset: reset,
    setLowPower: setLowPower,
    toggleLowPower: toggleLowPower,
    loops: loops
  };
})();
