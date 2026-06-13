/* @ds-bundle: {"format":3,"namespace":"AcademyProspectusDesignSystem_9696cb","components":[{"name":"OutcomeStat","sourcePath":"components/cards/OutcomeStat.jsx"},{"name":"PlanCard","sourcePath":"components/cards/PlanCard.jsx"},{"name":"TeacherCard","sourcePath":"components/cards/TeacherCard.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"MetaChip","sourcePath":"components/core/MetaChip.jsx"}],"sourceHashes":{"components/cards/OutcomeStat.jsx":"909c21450f30","components/cards/PlanCard.jsx":"40b596d92e85","components/cards/TeacherCard.jsx":"1b5bc5a3efa4","components/cards/TestimonialCard.jsx":"7583a6c2ca0c","components/core/Button.jsx":"3e9323a100fd","components/core/Eyebrow.jsx":"dd97527c879d","components/core/MetaChip.jsx":"fa3541f9ace6","slides/prospectus-motion.js":"274b27aafe90"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AcademyProspectusDesignSystem_9696cb = window.AcademyProspectusDesignSystem_9696cb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/OutcomeStat.jsx
try { (() => {
/**
 * OutcomeStat — a credible KPI: large serif number with an optional unit, a
 * plain-language caption, and a small sourcing line. Honest, not hype.
 */
function OutcomeStat({
  value,
  unit,
  caption,
  source,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: 72,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "var(--accent-deep)"
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 32,
      color: "var(--accent)"
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14.5,
      lineHeight: 1.45,
      color: "var(--ink-muted)"
    }
  }, caption), source && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-meta)",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-faint)",
      marginTop: 4
    }
  }, source));
}
Object.assign(__ds_scope, { OutcomeStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/OutcomeStat.jsx", error: String((e && e.message) || e) }); }

// components/cards/PlanCard.jsx
try { (() => {
/**
 * PlanCard — an enrollment / pricing column. Tier label, serif price, a list
 * of inclusions with soft accent bullets. Set `feature` for the chosen tier.
 */
function PlanCard({
  tier,
  price,
  per = "/ term",
  items = [],
  feature = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: feature ? "1px solid var(--accent)" : "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      padding: "26px 24px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      background: feature ? "color-mix(in srgb, var(--accent-field) 55%, var(--paper))" : "var(--paper)",
      boxShadow: feature ? "var(--shadow-card)" : "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-meta)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--accent)"
    }
  }, tier), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: 40,
      lineHeight: 1,
      color: "var(--ink)"
    }
  }, price, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--ink-faint)"
    }
  }, " ", per)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "6px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--ink-muted)",
      lineHeight: 1.4,
      paddingLeft: 20,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 8,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--accent)",
      opacity: 0.55
    }
  }), it))));
}
Object.assign(__ds_scope, { PlanCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PlanCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TeacherCard.jsx
try { (() => {
/**
 * TeacherCard — an editorial faculty profile. Documentary portrait, name in
 * display serif, discipline in mono, a short scholarly bio under a hairline.
 * Deliberately not a generic centred avatar card.
 */
function TeacherCard({
  name,
  discipline,
  bio,
  image,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "3 / 4",
      borderRadius: "var(--r-image)",
      overflow: "hidden",
      background: "var(--parchment)",
      boxShadow: "var(--shadow-card)"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "saturate(0.9) contrast(1.02)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "grid",
      placeItems: "center",
      background: "radial-gradient(120% 90% at 30% 20%, var(--accent-field), var(--parchment))",
      color: "var(--ink-faint)",
      fontFamily: "var(--font-meta)",
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase"
    }
  }, "Portrait")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: 20,
      color: "var(--ink)",
      margin: "16px 0 2px"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-meta)",
      fontSize: 10.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--accent)"
    }
  }, discipline), bio && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13.5,
      lineHeight: 1.5,
      color: "var(--ink-muted)",
      margin: "10px 0 0",
      paddingTop: 10,
      borderTop: "1px solid var(--line)"
    }
  }, bio));
}
Object.assign(__ds_scope, { TeacherCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TeacherCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.jsx
try { (() => {
/**
 * TestimonialCard — a designed quote, not a copied review. Serif quote with a
 * raised quotation mark, attribution under a hairline. Optional accent rule.
 */
function TestimonialCard({
  quote,
  name,
  role,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      padding: "32px 34px",
      background: "var(--paper)",
      border: "1px solid var(--line)",
      borderRadius: "var(--r-md)",
      borderTop: "3px solid var(--accent)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      flexDirection: "column",
      gap: 22,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 56,
      lineHeight: 0.2,
      height: 26,
      color: "var(--accent)"
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: 24,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
      color: "var(--ink)"
    }
  }, quote), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      paddingTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--ink)"
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-meta)",
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-faint)",
      borderLeft: "1px solid var(--line)",
      paddingLeft: 14
    }
  }, role)));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the academy's restrained call to action.
 * Editorial, rectangular, gentle radius; warm hover, soft press. Never bubbly.
 */
function Button({
  children,
  variant = "primary",
  // "primary" | "accent" | "secondary" | "ghost"
  size = "md",
  // "sm" | "md" | "lg"
  as = "button",
  href,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const pads = {
    sm: "8px 16px",
    md: "12px 24px",
    lg: "15px 32px"
  };
  const sizes = {
    sm: 13,
    md: 15,
    lg: 17
  };
  const base = {
    fontFamily: "var(--font-body)",
    fontSize: sizes[size],
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1,
    padding: pads[size],
    borderRadius: "var(--r-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid transparent",
    transition: "background var(--dur-fast) var(--ease-page), border-color var(--dur-fast) var(--ease-page), color var(--dur-fast) var(--ease-page), transform var(--dur-fast) var(--ease-page)",
    transform: press && !disabled ? "scale(0.975)" : "none",
    textDecoration: "none"
  };
  const variants = {
    primary: {
      background: hover ? "var(--charcoal)" : "var(--ink)",
      color: "var(--ink-on-dark)",
      borderColor: "var(--ink)"
    },
    accent: {
      background: hover ? "var(--accent-deep)" : "var(--accent)",
      color: "var(--paper)",
      borderColor: "transparent"
    },
    secondary: {
      background: hover ? "var(--porcelain)" : "transparent",
      color: "var(--ink)",
      borderColor: hover ? "var(--ink-faint)" : "var(--line-strong)"
    },
    ghost: {
      background: "transparent",
      color: hover ? "var(--accent-deep)" : "var(--accent)",
      borderColor: "transparent",
      padding: 0,
      borderBottom: `1.5px solid ${hover ? "var(--accent)" : "transparent"}`,
      borderRadius: 0
    }
  };
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    "aria-disabled": disabled || undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow — a small-caps chapter label with a short rule, used above titles.
 * Inherits the section `--accent`.
 */
function Eyebrow({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-meta)",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--accent)",
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 1.5,
      background: "var(--accent)",
      display: "inline-block"
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/MetaChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MetaChip — the signature mono metadata token: course codes, age groups,
 * lesson durations, module labels. Tinted (filled) or bare.
 */
function MetaChip({
  children,
  bare = false,
  style = {},
  ...rest
}) {
  const base = {
    fontFamily: "var(--font-meta)",
    fontSize: 11.5,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
    borderRadius: "var(--r-pill)"
  };
  const filled = {
    color: "var(--accent-deep)",
    background: "var(--accent-field)",
    border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
    padding: "6px 13px"
  };
  const bareStyle = {
    color: "var(--ink-faint)",
    background: "transparent",
    border: "none",
    padding: 0
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...(bare ? bareStyle : filled),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { MetaChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetaChip.jsx", error: String((e && e.message) || e) }); }

// slides/prospectus-motion.js
try { (() => {
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
    var W = 1280,
      H = 720; // the fixed slide canvas
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var canvas = document.createElement("canvas");
    canvas.className = "paper-bg";
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var fibreLayer = document.createElement("canvas");
    fibreLayer.width = W;
    fibreLayer.height = H;
    var fctx = fibreLayer.getContext("2d");

    // very faint, short, randomly oriented fibres — like laid paper (drawn once)
    (function buildFibres() {
      var count = Math.floor(W * H / 5200);
      for (var i = 0; i < count; i++) {
        var x = Math.random() * W,
          y = Math.random() * H;
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
      if (now - lastDraw < 40) {
        rafId = requestAnimationFrame(draw);
        return;
      } // ~25fps, barely perceptible
      lastDraw = now;
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(fibreLayer, 0, 0, W, H);

      // slow breathing vignette — light gently swells, recedes and wanders
      var breathe = 0.5 + 0.5 * Math.sin(t * 0.18); // ~35s period
      var drift = Math.sin(t * 0.07) * 0.05;
      var cx = W * (0.5 + drift),
        cy = H * (0.40 + drift * 0.6);
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
      start: function () {
        if (!rafId && !lowPower) {
          lastDraw = 0;
          rafId = requestAnimationFrame(draw);
        }
      },
      stop: function () {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        staticFrame();
      },
      hide: function () {
        canvas.style.display = "none";
      },
      show: function () {
        canvas.style.display = "";
      }
    };
  }

  /* ---------------------------------------------------------------------- */
  /*  Slide activation + navigation                                          */
  /* ---------------------------------------------------------------------- */
  function Deck(bg) {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
    var index = 0;
    var multi = slides.length > 1;
    var natural = []; // each slide's intended display (grid / flex / block)

    // No slides on the page (e.g. a foundations card just wants the paper bg):
    // keep the background running but skip all slide management.
    if (slides.length === 0) {
      return {
        slides: slides,
        go: function () {},
        next: function () {},
        prev: function () {},
        replay: function () {},
        revealAll: function () {},
        restore: function () {},
        get index() {
          return 0;
        },
        multi: false
      };
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
      cur.removeAttribute("data-deck-active"); // reset to from-state
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
    function replay(i) {
      activate(i);
    }
    var deckRef = {
      index: 0
    };
    var chrome = null;
    function buildChrome() {
      if (!multi) return;
      chrome = document.createElement("div");
      chrome.className = "deck-nav";
      chrome.innerHTML = '<button data-prev aria-label="Previous">&#8249;</button>' + '<span class="count"></span>' + '<button data-next aria-label="Next">&#8250;</button>';
      document.body.appendChild(chrome);
      chrome.querySelector("[data-prev]").addEventListener("click", prev);
      chrome.querySelector("[data-next]").addEventListener("click", next);
    }
    function updateChrome() {
      if (!chrome) return;
      chrome.querySelector(".count").textContent = String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    }
    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      deckRef.index = index;
      activate(index);
    }
    function next() {
      if (index < slides.length - 1) go(index + 1);
    }
    function prev() {
      if (index > 0) go(index - 1);
    }
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
    return {
      slides: slides,
      go: go,
      next: next,
      prev: prev,
      replay: replay,
      get index() {
        return index;
      },
      multi: multi,
      revealAll: function () {
        slides.forEach(function (s, n) {
          s.style.display = natural[n] || "";
          s.setAttribute("data-deck-active", "");
        });
      },
      restore: function () {
        activate(index);
      }
    };
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
    document.body.classList.remove("motion"); // reveal all content statically
    if (bg) bg.stop();
    // ensure every slide shows its final state
    document.querySelectorAll(".slide").forEach(function (s) {
      s.setAttribute("data-deck-active", "");
    });
  }
  function exitLowPower(bg, deck) {
    lowPower = false;
    document.body.classList.remove("low-power");
    if (!reduceMotion) document.body.classList.add("motion");
    if (bg) {
      bg.show();
      bg.start();
    }
    if (deck && deck.multi) {
      // restore single-active behaviour
      deck.slides.forEach(function (s, n) {
        if (n !== deck.index) s.removeAttribute("data-deck-active");
      });
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Boot                                                                   */
  /* ---------------------------------------------------------------------- */
  function boot() {
    // motion is opt-in via this class; without it the CSS shows finished content
    if (!reduceMotion) document.body.classList.add("motion");
    var bg = null;
    if (!reduceMotion) {
      bg = PaperBackground();
    }
    var deck = Deck(bg); // attaches bg to the first slide via activate(0)
    if (bg) bg.start();
    setupHint();
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        lowPower ? exitLowPower(bg, deck) : enterLowPower(bg);
        return;
      }
      if (lowPower) return;
      if (deck.multi) {
        if (k === "arrowright" || k === " " || k === "pagedown") {
          e.preventDefault();
          deck.next();
        } else if (k === "arrowleft" || k === "pageup") {
          e.preventDefault();
          deck.prev();
        } else if (k === "r") {
          deck.replay(deck.index);
        }
      } else if (k === "r") {
        deck.replay(0);
      }
    });

    // expose for the deck template / debugging
    window.ProspectusDeck = deck;
    window.addEventListener("beforeprint", function () {
      if (deck.revealAll) deck.revealAll();
    });
    window.addEventListener("afterprint", function () {
      if (deck.restore) deck.restore();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);else boot();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/prospectus-motion.js", error: String((e && e.message) || e) }); }

__ds_ns.OutcomeStat = __ds_scope.OutcomeStat;

__ds_ns.PlanCard = __ds_scope.PlanCard;

__ds_ns.TeacherCard = __ds_scope.TeacherCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.MetaChip = __ds_scope.MetaChip;

})();
