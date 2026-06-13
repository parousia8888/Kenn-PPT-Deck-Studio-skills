/* ============================================================
 * Launch Theatre — motion controller  (plain JS, standalone-safe)
 *
 *   • Dynamic background: a dark optical field (WebGL fragment shader) with
 *     slow light falloff, fine volumetric haze, a faint lens ring and contour
 *     light. Falls back to a Canvas-2D drifting-light field, then to the CSS
 *     stage color if neither is available. Reacts lightly to the pointer.
 *   • Orchestration: drives [data-anim] reveal end-states for both deck-stage
 *     ([data-deck-active]) and standalone slides ([data-anim-root] via
 *     IntersectionObserver), plus number count-ups ([data-anim="num"]).
 *   • Intensity: per-slide data-bg="strong|base|dim" lerps the field strength
 *     (strongest on cover / product reveal / closing).
 *   • Low-power: press  B  to toggle body.low-power — RAF loops stop, all
 *     content snaps to its final static state, a small hint appears.
 *   • Respects prefers-reduced-motion (no background loop; content visible).
 *
 * Enable the background by putting  data-lt-bg  on <body>.
 * ============================================================ */
(function () {
  "use strict";
  if (window.LaunchTheatre) return;

  var LS_KEY = "lt-low-power";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = {
    lowPower: false,
    intensity: 0.55,
    targetIntensity: 0.55,
    mouse: { x: 0.5, y: 0.5 },
    mouseT: { x: 0.5, y: 0.5 },
    raf: 0,
    bg: null,        // background renderer instance
  };

  /* ---------- helpers ---------- */
  function accentRGB() {
    try {
      var v = getComputedStyle(document.body).getPropertyValue("--accent-rgb").trim()
           || getComputedStyle(document.documentElement).getPropertyValue("--signal-rgb").trim();
      var p = v.split(",").map(function (n) { return parseFloat(n) / 255; });
      if (p.length === 3 && p.every(function (n) { return n === n; })) return p;
    } catch (e) {}
    return [0.231, 0.878, 0.902];
  }
  var INTENSITY = { strong: 1.0, base: 0.55, dim: 0.22, off: 0 };

  /* =========================================================
   * Background — WebGL field with Canvas-2D fallback
   * ======================================================= */
  var FRAG = [
    "precision highp float;",
    "uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;",
    "uniform float u_intensity; uniform vec3 u_accent;",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);",
    " float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));",
    " return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}",
    "float fbm(vec2 p){float v=0.0,a=0.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);",
    " for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=0.5;}return v;}",
    "void main(){",
    " vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;",
    " float t=u_time*0.035;",
    " vec2 lc=vec2(0.16*sin(t*0.7),0.10*cos(t*0.9))+(u_mouse-0.5)*0.30;",
    " float d=length(p-lc);",
    " float light=exp(-d*d*2.1);",
    " float h=fbm(p*1.6+vec2(t*0.6,-t*0.4));",
    " h=fbm(p*2.1+h*0.8+vec2(-t*0.3,t*0.5));",
    " float base=0.011;",
    " float glow=light*(0.17+0.09*h)*u_intensity;",
    " float haze=h*0.045*u_intensity;",
    " float ring=exp(-pow(d-0.52-0.04*sin(t*1.7),2.0)*42.0)*0.05*u_intensity;",
    " vec3 col=vec3(base);",
    " col+=u_accent*glow;",
    " col+=vec3(haze)*0.55;",
    " col+=u_accent*ring;",
    " float vig=smoothstep(1.25,0.15,length(p));",
    " col*=vig;",
    " gl_FragColor=vec4(col,1.0);",
    "}"
  ].join("\n");
  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";

  function WebGLField(canvas) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
          || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; } return s; }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      intensity: gl.getUniformLocation(prog, "u_intensity"),
      accent: gl.getUniformLocation(prog, "u_accent"),
    };
    var ac = accentRGB();
    return {
      gl: gl,
      resize: function (w, h) { gl.viewport(0, 0, w, h); gl.uniform2f(U.res, w, h); },
      frame: function (time) {
        gl.uniform1f(U.time, time);
        gl.uniform2f(U.mouse, state.mouseT.x, 1.0 - state.mouseT.y);
        gl.uniform1f(U.intensity, state.intensity);
        gl.uniform3f(U.accent, ac[0], ac[1], ac[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  }

  function Canvas2DField(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;
    var ac = accentRGB().map(function (n) { return Math.round(n * 255); });
    return {
      resize: function () {},
      frame: function (time) {
        var w = canvas.width, h = canvas.height, t = time * 0.035;
        ctx.fillStyle = "#060709"; ctx.fillRect(0, 0, w, h);
        var cx = w * (0.5 + 0.16 * Math.sin(t * 0.7) + (state.mouseT.x - 0.5) * 0.3);
        var cy = h * (0.5 + 0.12 * Math.cos(t * 0.9) + (state.mouseT.y - 0.5) * 0.3);
        var r = Math.max(w, h) * 0.75;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        var a = 0.20 * state.intensity;
        g.addColorStop(0, "rgba(" + ac[0] + "," + ac[1] + "," + ac[2] + "," + a + ")");
        g.addColorStop(0.4, "rgba(" + ac[0] + "," + ac[1] + "," + ac[2] + "," + (a * 0.25) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        // vignette
        var vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
        vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.65)");
        ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
      }
    };
  }

  function buildBackground() {
    if (!document.body.hasAttribute("data-lt-bg")) return;
    if (document.querySelector(".lt-bg")) return;
    var canvas = document.createElement("canvas");
    canvas.className = "lt-bg";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;display:block;pointer-events:none;background:var(--bg-stage);";
    document.body.insertBefore(canvas, document.body.firstChild);

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var renderer = WebGLField(canvas) || Canvas2DField(canvas);
    state.bg = renderer;
    if (!renderer) { canvas.remove(); return; }   // pure CSS fallback

    function resize() {
      var w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w; canvas.height = h; renderer.resize(w, h);
    }
    window.addEventListener("resize", resize); resize();

    var start = performance.now();
    function loop(now) {
      if (state.lowPower) return;
      // ease mouse + intensity toward targets
      state.mouseT.x += (state.mouse.x - state.mouseT.x) * 0.04;
      state.mouseT.y += (state.mouse.y - state.mouseT.y) * 0.04;
      state.intensity += (state.targetIntensity - state.intensity) * 0.03;
      renderer.frame((now - start) / 1000);
      state.raf = requestAnimationFrame(loop);
    }
    function renderOnce() { renderer.frame((performance.now() - start) / 1000); }

    LaunchTheatre._startBg = function () {
      if (state.lowPower || reduceMotion) { resize(); renderOnce(); return; }
      cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(loop);
    };
    LaunchTheatre._stopBg = function () { cancelAnimationFrame(state.raf); state.raf = 0; renderOnce(); };
    LaunchTheatre._startBg();

    window.addEventListener("pointermove", function (e) {
      state.mouse.x = e.clientX / window.innerWidth;
      state.mouse.y = e.clientY / window.innerHeight;
    }, { passive: true });
  }

  /* =========================================================
   * Orchestration — reveals, intensity, count-ups
   * ======================================================= */
  function runCountUps(root) {
    var nums = root.querySelectorAll('[data-anim="num"][data-count-to]');
    nums.forEach(function (el) {
      if (el.__ltCounted) return; el.__ltCounted = true;
      var to = parseFloat(el.getAttribute("data-count-to"));
      var dec = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      var pre = el.getAttribute("data-count-prefix") || "";
      var suf = el.getAttribute("data-count-suffix") || "";
      function fmt(v) { return pre + v.toFixed(dec) + suf; }
      if (state.lowPower || reduceMotion) { el.textContent = fmt(to); return; }
      var dur = 1200, t0 = performance.now();
      (function tick(now) {
        var k = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(to * e);
        if (k < 1 && !state.lowPower) requestAnimationFrame(tick); else el.textContent = fmt(to);
      })(t0);
    });
  }

  function applyIntensityFrom(el) {
    var key = (el && el.getAttribute("data-bg")) || "base";
    state.targetIntensity = INTENSITY[key] != null ? INTENSITY[key] : INTENSITY.base;
    if (state.lowPower || reduceMotion) state.intensity = state.targetIntensity;
  }

  function play(root) {
    if (!root) return;
    root.classList.add("lt-on");
    runCountUps(root);
    applyIntensityFrom(root.matches("[data-bg]") ? root : (root.querySelector("[data-bg]") || root));
  }
  function reset(root) {
    if (!root) return;
    root.classList.remove("lt-on");
    root.querySelectorAll('[data-anim="num"][data-count-to]').forEach(function (el) { el.__ltCounted = false; });
  }

  function wireDeck() {
    // deck-stage sets [data-deck-active]; CSS handles reveals. We drive
    // intensity + count-ups when the active slide changes.
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === "data-deck-active" && m.target.hasAttribute("data-deck-active")) {
          applyIntensityFrom(m.target.matches("[data-bg]") ? m.target : (m.target.querySelector("[data-bg]") || m.target));
          runCountUps(m.target);
        }
      });
    });
    mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-deck-active"] });
    var active = document.querySelector("[data-deck-active]");
    if (active) { applyIntensityFrom(active); runCountUps(active); }
  }

  function wireStandalone() {
    var roots = document.querySelectorAll("[data-anim-root]");
    if (!roots.length) return;
    // Reveal-once: a scroll page should never re-hide content once shown.
    if (!("IntersectionObserver" in window)) { roots.forEach(play); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.25) { play(e.target); io.unobserve(e.target); }
      });
    }, { threshold: [0, 0.25, 0.5] });
    roots.forEach(function (r) {
      // Anything already on screen at boot reveals immediately (covers
      // above-the-fold heroes and short pages with no scroll).
      var rect = r.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) { play(r); }
      else io.observe(r);
    });
  }

  /* =========================================================
   * Contained optical fields — <... data-lt-field> inside slides.
   * Each gets its own canvas + renderer; only the field under the active
   * deck slide animates (others would be hidden anyway). For non-deck pages
   * every field animates. Driven by the same intensity + mouse easing.
   * ======================================================= */
  function wireFields() {
    var els = [].slice.call(document.querySelectorAll("[data-lt-field]"));
    if (!els.length) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var fields = els.map(function (host) {
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      var c = document.createElement("canvas");
      c.setAttribute("aria-hidden", "true");
      c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
      host.insertBefore(c, host.firstChild);
      var r = WebGLField(c) || Canvas2DField(c);
      return r ? { host: host, c: c, r: r, w: 0, h: 0 } : null;
    }).filter(Boolean);
    if (!fields.length) return;
    function resize(f) {
      var w = Math.floor(f.c.clientWidth * dpr), h = Math.floor(f.c.clientHeight * dpr);
      if (w === f.w && h === f.h) return; f.w = w; f.h = h; f.c.width = w; f.c.height = h; f.r.resize(w, h);
    }
    function activeFields() {
      var anyActive = document.querySelector("[data-deck-active]");
      return fields.filter(function (f) { return !anyActive || f.host.closest("[data-deck-active]"); });
    }
    var start = performance.now();
    function loop(now) {
      if (state.lowPower) return;
      state.mouseT.x += (state.mouse.x - state.mouseT.x) * 0.04;
      state.mouseT.y += (state.mouse.y - state.mouseT.y) * 0.04;
      state.intensity += (state.targetIntensity - state.intensity) * 0.03;
      activeFields().forEach(function (f) { resize(f); f.r.frame((now - start) / 1000); });
      state._fieldRaf = requestAnimationFrame(loop);
    }
    function once() { activeFields().forEach(function (f) { resize(f); f.r.frame((performance.now() - start) / 1000); }); }
    LaunchTheatre._startFields = function () {
      if (state.lowPower || reduceMotion) { once(); return; }
      cancelAnimationFrame(state._fieldRaf); state._fieldRaf = requestAnimationFrame(loop);
    };
    LaunchTheatre._stopFields = function () { cancelAnimationFrame(state._fieldRaf); state._fieldRaf = 0; once(); };
    window.addEventListener("resize", function () { fields.forEach(function (f) { f.w = 0; }); });
    LaunchTheatre._startFields();
  }

  /* =========================================================
   * Low-power toggle  (press B)
   * ======================================================= */
  function ensureHint() {
    if (document.querySelector(".lt-lowpower-hint")) return;
    var h = document.createElement("div");
    h.className = "lt-lowpower-hint";
    h.innerHTML = 'Static mode \u00b7 press <b>B</b> to resume';
    document.body.appendChild(h);
  }
  function setLowPower(on) {
    state.lowPower = on;
    document.body.classList.toggle("low-power", on);
    try { localStorage.setItem(LS_KEY, on ? "1" : "0"); } catch (e) {}
    if (on) { LaunchTheatre._stopBg(); LaunchTheatre._stopFields(); }
    else { LaunchTheatre._startBg(); LaunchTheatre._startFields(); }
  }

  /* =========================================================
   * Public API + boot
   * ======================================================= */
  var LaunchTheatre = window.LaunchTheatre = {
    play: play,
    reset: reset,
    setIntensity: function (v) { state.targetIntensity = v; },
    lowPower: setLowPower,
    isLowPower: function () { return state.lowPower; },
    _startBg: function () {}, _stopBg: function () {},
    _startFields: function () {}, _stopFields: function () {}
  };

  function boot() {
    ensureHint();
    try { if (localStorage.getItem(LS_KEY) === "1") state.lowPower = true; } catch (e) {}
    if (state.lowPower) document.body.classList.add("low-power");
    window.addEventListener("pointermove", function (e) {
      state.mouse.x = e.clientX / window.innerWidth;
      state.mouse.y = e.clientY / window.innerHeight;
    }, { passive: true });
    buildBackground();
    wireFields();
    wireDeck();
    wireStandalone();
    document.addEventListener("keydown", function (e) {
      if ((e.key === "b" || e.key === "B") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        var tag = (e.target && e.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
        setLowPower(!state.lowPower);
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
