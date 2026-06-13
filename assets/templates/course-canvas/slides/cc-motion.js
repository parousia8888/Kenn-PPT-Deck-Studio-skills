/* ============================================================
   Course Canvas — motion recipes
   Drives the per-slide-type reveal grammar. The basic staggered
   fade is pure CSS (deck.css, gated on [data-deck-active]); this
   layer adds the teacherly extras: underline draws, connector
   line-draws, sequential step highlight, and the exercise
   answer reveal. Recipe is read from data-recipe on each slide.

   Works with <deck-stage> (listens for its `slidechange` event)
   and on standalone slides (runs once on load).
   Respects prefers-reduced-motion (everything resolves instantly).
   ============================================================ */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = new WeakMap();

  function isLowPower() {
    return document.body.classList.contains("low-power");
  }

  function stateRoot(slide) {
    return slide.matches && slide.matches(".cc-slide") ? slide : (slide.querySelector && slide.querySelector(".cc-slide")) || slide;
  }

  function setFinalState(slide) {
    slide.querySelectorAll("[data-underline]").forEach(function (el) { el.classList.add("is-drawn"); });
    slide.querySelectorAll("[data-draw]").forEach(function (p) {
      p.style.transition = "none";
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "0";
    });
    slide.querySelectorAll("[data-step]").forEach(function (s) { s.classList.remove("is-current"); });
    var root = stateRoot(slide);
    if (root.hasAttribute("data-state")) root.setAttribute("data-state", "answer");
  }

  function later(slide, fn, delay) {
    if (isLowPower()) {
      fn();
      return;
    }
    var id = setTimeout(fn, RM ? 0 : delay);
    var list = timers.get(slide) || [];
    list.push(id);
    timers.set(slide, list);
  }

  function clearTimers(slide) {
    var list = timers.get(slide) || [];
    list.forEach(function (id) { clearTimeout(id); });
    timers.set(slide, []);
  }

  // --- underline draw: animate width of a ::after via .is-drawn ---
  function drawUnderlines(slide) {
    var els = slide.querySelectorAll("[data-underline]");
    els.forEach(function (el, i) {
      el.classList.remove("is-drawn");
      var base = parseInt(el.getAttribute("data-underline-delay") || "0", 10);
      var delay = RM ? 0 : base + i * 320 + 500;
      later(slide, function () { el.classList.add("is-drawn"); }, delay);
    });
  }

  // --- connector line draw (SVG paths in knowledge map etc.) ---
  function drawConnectors(slide) {
    var paths = slide.querySelectorAll("[data-draw]");
    paths.forEach(function (p, i) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { return; }
      p.style.transition = "none";
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      // force reflow so the reset takes before we animate
      void p.getBoundingClientRect();
      var delay = RM ? 0 : (parseInt(p.getAttribute("data-draw") || "1", 10) * 180 + 700);
      later(slide, function () {
        p.style.transition = "stroke-dashoffset 620ms cubic-bezier(0.16,1,0.3,1)";
        p.style.strokeDashoffset = "0";
      }, delay);
    });
  }

  // --- sequential step highlight (step-explanation) ---
  function highlightSteps(slide) {
    var steps = slide.querySelectorAll("[data-step]");
    if (!steps.length) return;
    steps.forEach(function (s) { s.classList.remove("is-current"); });
    if (RM || isLowPower()) { return; }
    var idx = 0;
    function tick() {
      steps.forEach(function (s) { s.classList.remove("is-current"); });
      if (idx < steps.length) {
        steps[idx].classList.add("is-current");
        idx++;
        var id = setTimeout(tick, 1100);
        timers.set(slide, (timers.get(slide) || []).concat(id));
      }
    }
    clearTimers(slide);
    later(slide, tick, 900);
  }

  // --- exercise: answer area hidden until data-state="answer" ---
  function bindExercise(slide) {
    if (slide.__exerciseBound) return;
    slide.__exerciseBound = true;
    var btn = slide.querySelector("[data-reveal-answer]");
    var root = stateRoot(slide);
    if (btn) {
      btn.addEventListener("click", function () {
        var on = root.getAttribute("data-state") === "answer";
        root.setAttribute("data-state", on ? "prompt" : "answer");
        btn.setAttribute("aria-pressed", String(!on));
        var lab = btn.querySelector("[data-label]");
        if (lab) lab.textContent = on ? "Reveal answer" : "Hide answer";
      });
    }
  }

  function play(slide) {
    if (!slide) return;
    clearTimers(slide);
    if (isLowPower()) {
      bindExercise(slide);
      setFinalState(slide);
      return;
    }
    drawUnderlines(slide);
    drawConnectors(slide);
    if ((slide.getAttribute("data-recipe") || "") === "step-explanation") highlightSteps(slide);
    bindExercise(slide);
  }

  function reset(slide) {
    if (!slide) return;
    clearTimers(slide);
    slide.querySelectorAll("[data-underline]").forEach(function (el) { el.classList.remove("is-drawn"); });
    slide.querySelectorAll("[data-step]").forEach(function (s) { s.classList.remove("is-current"); });
    var root = stateRoot(slide);
    if (root.hasAttribute("data-state")) root.setAttribute("data-state", "prompt");
  }

  // ---- deck integration ----
  document.addEventListener("slidechange", function (e) {
    if (e.detail.previousSlide) reset(e.detail.previousSlide);
    // wait a tick so [data-deck-active] CSS reveals start together
    setTimeout(function () { play(e.detail.slide); }, 40);
  });

  document.addEventListener("cc-low-power-change", function (e) {
    var active = document.querySelector("deck-stage > [data-deck-active]") ||
      document.querySelector("[data-deck-active]") ||
      document.querySelector(".cc-slide[data-recipe]");
    if (active) {
      if (e.detail.lowPower) setFinalState(active);
      else play(active);
    }
  });

  // ---- standalone slides (no deck): play each once ----
  function initStandalone() {
    if (document.querySelector("deck-stage")) return; // deck handles it
    document.querySelectorAll(".cc-slide[data-recipe]").forEach(function (s) {
      s.setAttribute("data-deck-active", "");
      play(s);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initStandalone);
  else initStandalone();

  window.CCMotion = { play: play, reset: reset };
})();
