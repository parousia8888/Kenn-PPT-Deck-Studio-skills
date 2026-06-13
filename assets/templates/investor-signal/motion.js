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

  var reduceMotion = global.matchMedia &&
    global.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      light: (this.canvas.closest('[data-mode="evidence"]') != null),
    };
  };
  Background.prototype.resize = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var r = this.canvas.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
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
        hot: Math.random() < 0.12,           // a few accent ticks
      });
    }
  };
  Background.prototype.frame = function () {
    if (!this.running) return;
    this.t += 0.0045;
    var ctx = this.ctx, w = this.w, h = this.h, th = this.theme();
    ctx.clearRect(0, 0, w, h);

    // faint baseline grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = th.light ? "rgba(15,18,22,0.05)" : "rgba(180,190,200,0.05)";
    var rows = 5;
    for (var r = 1; r < rows; r++) {
      var y = (r / rows) * h;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
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
      g.addColorStop(0.5, p.hot ? hexToRgba(th.accent, th.light ? 0.16 : 0.22)
                                : "rgba(" + base + "," + (th.light ? 0.07 : 0.085) + ")");
      g.addColorStop(1, "rgba(" + base + ",0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = p.hot ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(x, midY - len); ctx.lineTo(x, midY + len); ctx.stroke();

      if (p.hot) { // small accent node travelling the tick
        var ny = midY + Math.sin(this.t * 1.4 + p.phase) * len * 0.8;
        ctx.fillStyle = hexToRgba(th.accent, th.light ? 0.55 : 0.7);
        ctx.beginPath(); ctx.arc(x, ny, 1.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    this.raf = requestAnimationFrame(this.frame.bind(this));
  };
  Background.prototype.start = function () {
    if (this.running || reduceMotion) return;
    this.running = true; this.frame();
  };
  Background.prototype.stop = function () {
    this.running = false; cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.w, this.h);
  };

  function hexToRgba(hex, a) {
    hex = (hex || "#FB3B1E").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(hex, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ---------------------------------------------------------- REVEALS */
  function stagger(slide) {
    var items = slide.querySelectorAll("[data-anim]");
    items.forEach(function (el) {
      var ord = el.hasAttribute("data-anim-order")
        ? parseFloat(el.getAttribute("data-anim-order"))
        : indexAmong(items, el);
      var step = parseFloat(el.getAttribute("data-anim-step") || "90");
      var base = parseFloat(el.getAttribute("data-anim-delay-base") || "120");
      el.style.setProperty("--anim-delay", (base + ord * step) + "ms");
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
        if (k < 1) requestAnimationFrame(tick);
        else el.textContent = format(el, target);
      }
      requestAnimationFrame(tick);
    });
  }
  function format(el, v) {
    var dec = parseInt(el.getAttribute("data-count-dec") || "0", 10);
    var pre = el.getAttribute("data-count-pre") || "";
    var suf = el.getAttribute("data-count-suf") || "";
    var s = v.toFixed(dec);
    if (el.getAttribute("data-count-sep") !== "off")
      s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return pre + s + suf;
  }

  /* ---------------------------------------------------------- PUBLIC */
  var IS = {
    backgrounds: [],
    keyBound: false,
    init: function (opts) {
      opts = opts || {};
      document.querySelectorAll("canvas.is-bg-canvas").forEach(function (c) {
        if (!c.__investorSignalBackground) {
          c.__investorSignalBackground = new Background(c);
          IS.backgrounds.push(c.__investorSignalBackground);
        }
      });
      // For a standalone page (no slides) start all backgrounds now;
      // decks start the active slide's background via activate().
      var hasSlides = document.querySelector("[data-slide]");
      if (!hasSlides && !document.body.classList.contains("low-power")) IS.startBg();

      // B toggles low-power
      if (!IS.keyBound) {
        document.addEventListener("keydown", function (e) {
          if ((e.key === "b" || e.key === "B") && !e.metaKey && !e.ctrlKey) {
            IS.toggleLowPower();
          }
        });
        IS.keyBound = true;
      }
      // ensure a hint node exists
      if (!document.querySelector(".lp-hint")) {
        var h = document.createElement("div");
        h.className = "lp-hint";
        h.textContent = "Static mode — press B to resume";
        document.body.appendChild(h);
      }
      return IS;
    },
    startBg: function (onlySlide) {
      IS.backgrounds.forEach(function (b) {
        if (!onlySlide || b.slide === onlySlide) b.start(); else b.stop();
      });
    },
    stopBg: function () { IS.backgrounds.forEach(function (b) { b.stop(); }); },
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
      if (on) { IS.stopBg(); document.querySelectorAll("[data-count]").forEach(function (el) {
        if (el.getAttribute("data-count")) el.textContent = format(el, parseFloat(el.getAttribute("data-count")));
      }); }
      else if (!reduceMotion) {
        var act = document.querySelector('[data-slide][data-deck-active="true"]');
        IS.startBg(act || undefined);
      }
    },
  };

  global.InvestorSignal = IS;
})(window);
