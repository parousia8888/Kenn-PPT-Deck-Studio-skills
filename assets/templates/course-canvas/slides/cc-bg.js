/* ============================================================
   Course Canvas — animated paper background (canvas 2D)
   A calm, teacherly surface: faint ruled notebook lines, a quiet
   annotation grid, slowly drifting margin marks, and occasional
   chalk-like micro strokes. Intensity is set per slide via
   data-bg="cover|divider|recap|teaching" (teaching = nearly
   invisible). Respects prefers-reduced-motion (draws one frame).

   Usage:  <section class="cc-slide" data-bg="cover"> … </section>
           <script src="./cc-bg.js"></script>
   It auto-mounts a <canvas class="cc-bg"> into every .cc-slide
   that has a data-bg attribute.
   ============================================================ */
(function () {
  "use strict";
  var INK = "44,39,32", OX = "138,45,34", SAGE = "94,114,87";
  var LEVELS = {
    teaching: { lines: 0.018, grid: 0.012, marks: 0.05, chalk: 0,    drift: 0.10 },
    concept:  { lines: 0.028, grid: 0.018, marks: 0.10, chalk: 0.04, drift: 0.14 },
    recap:    { lines: 0.045, grid: 0.022, marks: 0.16, chalk: 0.10, drift: 0.20 },
    divider:  { lines: 0.055, grid: 0.026, marks: 0.20, chalk: 0.14, drift: 0.24 },
    cover:    { lines: 0.060, grid: 0.030, marks: 0.22, chalk: 0.16, drift: 0.26 }
  };
  var instances = [];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var keyBound = false;

  function mount(slide) {
    if (slide.__ccBgInstance) return slide.__ccBgInstance;
    var cfg = LEVELS[slide.getAttribute("data-bg")] || LEVELS.teaching;
    var board = slide.classList.contains("cc-slide--board");
    var cv = slide.querySelector(":scope > canvas.cc-bg");
    if (!cv) {
      cv = document.createElement("canvas");
      cv.className = "cc-bg";
      slide.insertBefore(cv, slide.firstChild);
    }
    var ctx = cv.getContext("2d");
    var W = 1280, H = 720, DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * DPR; cv.height = H * DPR;
    cv.style.position = "absolute"; cv.style.inset = "0";
    cv.style.width = "100%"; cv.style.height = "100%";
    cv.style.zIndex = "0"; cv.style.pointerEvents = "none";
    ctx.scale(DPR, DPR);

    var ruleCol = board ? "237,231,214" : INK;
    var markCol = board ? "169,187,160" : OX;
    var gridCol = board ? "237,231,214" : INK;

    // drifting margin marks (small ticks down the left gutter)
    var marks = [];
    for (var i = 0; i < 16; i++) {
      marks.push({ x: 60 + Math.random() * 30, y: Math.random() * H,
                   len: 8 + Math.random() * 10, v: 2 + Math.random() * 4 });
    }
    // chalk micro-strokes that fade in and out
    var strokes = [];
    var startTime = 0, raf = 0, observer = null, visible = true;

    function spawnStroke() {
      strokes.push({
        x: 120 + Math.random() * (W - 240), y: 80 + Math.random() * (H - 160),
        len: 18 + Math.random() * 46, ang: (Math.random() - 0.5) * 0.5,
        life: 0, max: 220 + Math.random() * 160,
        col: Math.random() < 0.5 ? markCol : (board ? "223,198,132" : SAGE)
      });
    }

    function activeInDeck() {
      var node = slide.parentElement;
      while (node && node !== document.body) {
        if (node.parentElement && node.parentElement.localName === "deck-stage") {
          return node.hasAttribute("data-deck-active");
        }
        node = node.parentElement;
      }
      return true;
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // ---- ruled notebook lines (horizontal), very slow vertical drift
      var spacing = 38, off = (t * cfg.drift * 0.4) % spacing;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(" + ruleCol + "," + cfg.lines + ")";
      for (var y = -spacing + off; y < H; y += spacing) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke();
      }
      // ---- faint annotation grid (verticals)
      ctx.strokeStyle = "rgba(" + gridCol + "," + cfg.grid + ")";
      var gx = 64, offx = (t * cfg.drift * 0.25) % gx;
      for (var x = offx; x < W; x += gx) {
        ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, H - 40); ctx.stroke();
      }
      // ---- single oxblood margin rule (the notebook's red line)
      ctx.strokeStyle = "rgba(" + markCol + "," + Math.min(0.5, cfg.marks * 1.6) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(96, 28); ctx.lineTo(96, H - 28); ctx.stroke();

      // ---- drifting margin marks
      ctx.strokeStyle = "rgba(" + markCol + "," + cfg.marks + ")";
      ctx.lineWidth = 2;
      for (var m = 0; m < marks.length; m++) {
        var k = marks[m]; k.y += k.v * cfg.drift * 0.06;
        if (k.y > H + 12) { k.y = -12; k.x = 60 + Math.random() * 30; }
        ctx.beginPath(); ctx.moveTo(k.x, k.y); ctx.lineTo(k.x + k.len, k.y); ctx.stroke();
      }

      // ---- chalk micro strokes
      for (var s = strokes.length - 1; s >= 0; s--) {
        var st = strokes[s]; st.life++;
        var a = Math.sin((st.life / st.max) * Math.PI) * cfg.chalk;
        if (a > 0) {
          ctx.strokeStyle = "rgba(" + st.col + "," + a + ")";
          ctx.lineWidth = 1.4; ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(st.x + Math.cos(st.ang) * st.len, st.y + Math.sin(st.ang) * st.len);
          ctx.stroke();
        }
        if (st.life >= st.max) strokes.splice(s, 1);
      }
      if (!reduce && cfg.chalk > 0 && strokes.length < 4 && Math.random() < 0.012) spawnStroke();
    }

    function loop(now) {
      if (!startTime) startTime = now;
      draw((now - startTime) / 16.7);
      raf = requestAnimationFrame(loop);
    }

    function shouldRun() {
      return !reduce && !document.body.classList.contains("low-power") && visible && activeInDeck();
    }

    function start() {
      if (raf || !shouldRun()) return;
      startTime = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function sync() {
      if (shouldRun()) start();
      else stop();
    }

    var instance = {
      slide: slide,
      canvas: cv,
      draw: function () { draw(0); },
      start: start,
      stop: stop,
      sync: sync
    };
    slide.__ccBgInstance = instance;
    instances.push(instance);

    draw(0);
    if (!reduce) start();

    // pause when offscreen to save cycles
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          visible = e.isIntersecting;
          sync();
        });
      }, { threshold: 0.01 });
      observer.observe(slide);
    }

    return instance;
  }

  function ensureHint() {
    if (document.querySelector(".cc-lp-hint")) return;
    var hint = document.createElement("div");
    hint.className = "cc-lp-hint";
    hint.textContent = "Low-power mode: backgrounds paused. Press B to resume.";
    document.body.appendChild(hint);
  }

  function syncAll() {
    instances.forEach(function (inst) { inst.sync(); });
  }

  function setLowPower(on) {
    document.body.classList.toggle("low-power", !!on);
    if (on) instances.forEach(function (inst) { inst.stop(); });
    else syncAll();
    document.dispatchEvent(new CustomEvent("cc-low-power-change", { detail: { lowPower: !!on } }));
  }

  function toggleLowPower() {
    setLowPower(!document.body.classList.contains("low-power"));
  }

  function bindKeys() {
    if (keyBound) return;
    keyBound = true;
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.key || "").toLowerCase() === "b") toggleLowPower();
    });
    document.addEventListener("slidechange", syncAll);
  }

  function init() {
    var slides = document.querySelectorAll(".cc-slide[data-bg]");
    for (var i = 0; i < slides.length; i++) mount(slides[i]);
    ensureHint();
    bindKeys();
    syncAll();
  }

  window.CourseCanvasBackground = {
    instances: instances,
    init: init,
    start: syncAll,
    stop: function () { instances.forEach(function (inst) { inst.stop(); }); },
    toggleLowPower: toggleLowPower,
    setLowPower: setLowPower
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
