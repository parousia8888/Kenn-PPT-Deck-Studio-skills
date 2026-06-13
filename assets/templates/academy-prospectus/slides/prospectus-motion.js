/* ============================================================================
   Academy Prospectus — Motion engine
   - Paper-light dynamic background (canvas 2D): barely-visible page fibres,
     slow vignette breathing, occasional gentle light drift. Photographic,
     never techy.
   - Semantic slide-enter system: activates [data-deck-active] per slide so the
     CSS recipes play; multi-slide decks get keyboard / click navigation.
   - Low-power mode: press B to stop rAF, cancel motion, reveal all content
     statically, and show a hint.
   - Respects prefers-reduced-motion and gracefully degrades with no JS.
   ============================================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lowPower = false;
  var rafId = null;

  /* ---------------------------------------------------------------------- */
  /*  Paper-light background                                                 */
  /*  One canvas, parked inside the ACTIVE slide (above its opaque paper      */
  /*  fill, below the content) so the breathing light reads on the page.     */
  /* ---------------------------------------------------------------------- */
  function PaperBackground() {
    var W = 1280, H = 720;                       // the fixed slide canvas
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var canvas = document.createElement("canvas");
    canvas.className = "paper-bg";
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var fibreLayer = document.createElement("canvas");
    fibreLayer.width = W; fibreLayer.height = H;
    var fctx = fibreLayer.getContext("2d");

    // very faint, short, randomly oriented fibres — like laid paper (drawn once)
    (function buildFibres() {
      var count = Math.floor((W * H) / 5200);
      for (var i = 0; i < count; i++) {
        var x = Math.random() * W, y = Math.random() * H;
        var a = Math.random() * Math.PI;
        var len = 6 + Math.random() * 16;
        var dark = Math.random() > 0.5;
        fctx.strokeStyle = dark ? "rgba(70,55,35,0.020)" : "rgba(255,250,240,0.05)";
        fctx.lineWidth = 1;
        fctx.beginPath();
        fctx.moveTo(x, y);
        fctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        fctx.stroke();
      }
    })();

    var t0 = performance.now();
    var lastDraw = 0;

    function draw(now) {
      if (lowPower) return;
      if (now - lastDraw < 40) { rafId = requestAnimationFrame(draw); return; }  // ~25fps, barely perceptible
      lastDraw = now;
      var t = (now - t0) / 1000;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(fibreLayer, 0, 0, W, H);

      // slow breathing vignette — light gently swells, recedes and wanders
      var breathe = 0.5 + 0.5 * Math.sin(t * 0.18);            // ~35s period
      var drift = Math.sin(t * 0.07) * 0.05;
      var cx = W * (0.5 + drift), cy = H * (0.40 + drift * 0.6);
      var rad = Math.max(W, H) * (0.66 + 0.05 * breathe);
      var g = ctx.createRadialGradient(cx, cy, rad * 0.18, cx, cy, rad);
      g.addColorStop(0, "rgba(255,252,245," + (0.04 + 0.05 * breathe).toFixed(3) + ")");
      g.addColorStop(1, "rgba(74,58,36," + (0.05 + 0.04 * breathe).toFixed(3) + ")");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(fibreLayer, 0, 0, W, H);
    }

    return {
      attachTo: function (slideEl) {
        if (!slideEl) return;
        if (canvas.parentNode !== slideEl) slideEl.insertBefore(canvas, slideEl.firstChild);
      },
      start: function () { if (!rafId && !lowPower) { lastDraw = 0; rafId = requestAnimationFrame(draw); } },
      stop: function () { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } staticFrame(); },
      hide: function () { canvas.style.display = "none"; },
      show: function () { canvas.style.display = ""; }
    };
  }

  /* ---------------------------------------------------------------------- */
  /*  Slide activation + navigation                                          */
  /* ---------------------------------------------------------------------- */
  function Deck(bg) {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
    var index = 0;
    var multi = slides.length > 1;
    var natural = [];   // each slide's intended display (grid / flex / block)

    // No slides on the page (e.g. a foundations card just wants the paper bg):
    // keep the background running but skip all slide management.
    if (slides.length === 0) {
      return { slides: slides, go: function () {}, next: function () {}, prev: function () {},
        replay: function () {}, revealAll: function () {}, restore: function () {},
        get index() { return 0; }, multi: false };
    }

    function activate(i) {
      // hide every other slide (display-based = robust for capture / print / PDF)
      slides.forEach(function (s, n) {
        if (n !== i) {
          s.removeAttribute("data-deck-active");
          if (multi) s.style.display = "none";
        }
      });
      var cur = slides[i];
      cur.removeAttribute("data-deck-active");   // reset to from-state
      if (multi) cur.style.display = natural[i] || "block";
      if (bg) bg.attachTo(cur);
      // Force the from-state to be painted as the transition baseline BEFORE
      // revealing — otherwise a slide coming from display:none jumps instead of
      // transitioning. Reading layout flushes styles; rAF then triggers the
      // semantic entrance recipe.
      void cur.offsetWidth;
      requestAnimationFrame(function () {
        if (deckRef.index === i) cur.setAttribute("data-deck-active", "");
      });
      updateChrome();
    }

    // replay a slide's entrance
    function replay(i) { activate(i); }

    var deckRef = { index: 0 };
    var chrome = null;
    function buildChrome() {
      if (!multi) return;
      chrome = document.createElement("div");
      chrome.className = "deck-nav";
      chrome.innerHTML =
        '<button data-prev aria-label="Previous">&#8249;</button>' +
        '<span class="count"></span>' +
        '<button data-next aria-label="Next">&#8250;</button>';
      document.body.appendChild(chrome);
      chrome.querySelector("[data-prev]").addEventListener("click", prev);
      chrome.querySelector("[data-next]").addEventListener("click", next);
    }
    function updateChrome() {
      if (!chrome) return;
      chrome.querySelector(".count").textContent =
        String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    }

    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      deckRef.index = index;
      activate(index);
    }
    function next() { if (index < slides.length - 1) go(index + 1); }
    function prev() { if (index > 0) go(index - 1); }

    buildChrome();
    if (multi) {
      // Neutralise the pre-JS CSS guard so inline display fully controls visibility,
      // then capture each slide's intended display (grid / flex / block) while all
      // are visible, and overlay them.
      var canvas = slides[0].parentNode;
      if (canvas && canvas.classList) canvas.classList.add("deck-ready");
      slides.forEach(function (s, n) {
        s.style.display = "";
        natural[n] = getComputedStyle(s).display;
        if (natural[n] === "none") natural[n] = "block";
        s.style.position = "absolute";
        s.style.inset = "0";
      });
    }
    activate(0);

    return { slides: slides, go: go, next: next, prev: prev, replay: replay,
      get index() { return index; }, multi: multi,
      revealAll: function () {
        slides.forEach(function (s, n) { s.style.display = natural[n] || ""; s.setAttribute("data-deck-active", ""); });
      },
      restore: function () { activate(index); } };
  }

  /* ---------------------------------------------------------------------- */
  /*  Low-power toggle (B)                                                   */
  /* ---------------------------------------------------------------------- */
  function setupHint() {
    if (document.querySelector(".lowpower-hint")) return;
    var hint = document.createElement("div");
    hint.className = "lowpower-hint";
    hint.textContent = "Static mode — press B to resume";
    document.body.appendChild(hint);
  }

  function enterLowPower(bg) {
    lowPower = true;
    document.body.classList.add("low-power");
    document.body.classList.remove("motion");      // reveal all content statically
    if (bg) bg.stop();
    // ensure every slide shows its final state
    document.querySelectorAll(".slide").forEach(function (s) { s.setAttribute("data-deck-active", ""); });
  }
  function exitLowPower(bg, deck) {
    lowPower = false;
    document.body.classList.remove("low-power");
    if (!reduceMotion) document.body.classList.add("motion");
    if (bg) { bg.show(); bg.start(); }
    if (deck && deck.multi) {
      // restore single-active behaviour
      deck.slides.forEach(function (s, n) { if (n !== deck.index) s.removeAttribute("data-deck-active"); });
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Boot                                                                   */
  /* ---------------------------------------------------------------------- */
  function boot() {
    // motion is opt-in via this class; without it the CSS shows finished content
    if (!reduceMotion) document.body.classList.add("motion");

    var bg = null;
    if (!reduceMotion) { bg = PaperBackground(); }

    var deck = Deck(bg);    // attaches bg to the first slide via activate(0)
    if (bg) bg.start();
    setupHint();

    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); lowPower ? exitLowPower(bg, deck) : enterLowPower(bg); return; }
      if (lowPower) return;
      if (deck.multi) {
        if (k === "arrowright" || k === " " || k === "pagedown") { e.preventDefault(); deck.next(); }
        else if (k === "arrowleft" || k === "pageup") { e.preventDefault(); deck.prev(); }
        else if (k === "r") { deck.replay(deck.index); }
      } else if (k === "r") {
        deck.replay(0);
      }
    });

    // expose for the deck template / debugging
    window.ProspectusDeck = deck;
    window.addEventListener("beforeprint", function () { if (deck.revealAll) deck.revealAll(); });
    window.addEventListener("afterprint", function () { if (deck.restore) deck.restore(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
