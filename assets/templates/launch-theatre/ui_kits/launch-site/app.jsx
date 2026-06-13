/* Launch Theatre — Launch Site UI kit
 * A cinematic product-launch microsite assembled from the design system:
 * sticky nav, full-bleed optical hero, product reveal, feature trio, spec
 * benchmarks, and a watch-live takeover. Reuses the DS components off
 * window.<Namespace> and the motion system (data-anim + data-lt-field).
 *
 * Functional glyphs are Lucide paths (CDN set), inlined so they tint with
 * currentColor — see readme ICONOGRAPHY (flagged substitution).
 */
const DS = window.LaunchTheatreDesignSystem_6e18c8;
const { Button, Kicker, Badge, MonoMeta, ScreenFrame, FeatureCell, StageNumber } = DS;

/* ---- Lucide icons (inlined, 1.5px stroke, currentColor) ---- */
const Icon = ({ d, size = 18, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    {d}
  </svg>
);
const PlayIcon = (p) => <Icon {...p} fill="currentColor" d={<polygon points="6 3 20 12 6 21 6 3" />} />;
const ArrowRight = (p) => <Icon {...p} d={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} />;
const ArrowUpRight = (p) => <Icon {...p} d={<><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>} />;
const CloseIcon = (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />;

/* ---- Sticky nav ---- */
function LaunchNav({ onWatch }) {
  const [solid, setSolid] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector(".site-scroll");
    const on = () => setSolid(el.scrollTop > 40);
    el.addEventListener("scroll", on); return () => el.removeEventListener("scroll", on);
  }, []);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 48px",
      borderBottom: `1px solid ${solid ? "var(--hairline)" : "transparent"}`,
      background: solid ? "rgba(6,7,9,0.72)" : "transparent",
      backdropFilter: solid ? "blur(14px)" : "none",
      transition: "background 400ms var(--ease-out-soft), border-color 400ms var(--ease-out-soft)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 26, height: 2, background: "var(--accent)", boxShadow: "var(--glow-soft)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 19, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
          Launch <b style={{ fontWeight: 600 }}>Theatre</b>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {["Product", "Specs", "Story"].map((l) => (
          <a key={l} href={"#" + l.toLowerCase()} style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)",
            textDecoration: "none", padding: "8px 14px", letterSpacing: "0.01em",
          }}>{l}</a>
        ))}
        <Button variant="primary" size="sm" icon={<PlayIcon size={13} />} onClick={onWatch} style={{ marginLeft: 8 }}>
          Watch live
        </Button>
      </div>
    </nav>
  );
}

/* ---- Hero ---- */
function Hero({ onWatch }) {
  return (
    <header data-anim-root style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", overflow: "hidden" }}>
      <div data-lt-field data-bg="strong" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100 }}>
        <div data-anim="meta" style={{ marginBottom: 30 }}>
          <Badge dot variant="accent">Live · June 13</Badge>
        </div>
        <h1 data-anim="cover-title" style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: "clamp(4rem, 11vw, 12rem)", letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0, color: "var(--text-primary)" }}>
          Aurora<b style={{ fontWeight: 500 }}>.</b>
        </h1>
        <p data-anim="rise" style={{ "--i": 1, fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "clamp(1.1rem, 1.7vw, 1.6rem)", lineHeight: 1.4, color: "var(--text-secondary)", maxWidth: "30ch", marginTop: 30 }}>
          One model. On the device. Faster than the room can blink.
        </p>
        <div data-anim="rise" style={{ "--i": 2, display: "flex", gap: 14, marginTop: 40 }}>
          <Button variant="solid" size="lg" icon={<PlayIcon size={15} />} onClick={onWatch}>Watch the keynote</Button>
          <Button variant="secondary" size="lg" iconRight={<ArrowRight size={16} />} href="#product">Explore Aurora</Button>
        </div>
        <div data-anim="meta" style={{ "--i": 3, marginTop: 64 }}>
          <MonoMeta items={[
            { label: "Model", value: "LT-9 Aurora" },
            { label: "Version", value: "v2.0", accent: true },
            { label: "First token", value: "40 ms" },
            { label: "Footprint", value: "9B · on-device" },
          ]} />
        </div>
      </div>
    </header>
  );
}

/* ---- Product reveal ---- */
function ProductSection() {
  return (
    <section id="product" data-anim-root style={{ padding: "120px 48px", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.3fr)", gap: 80, alignItems: "center" }}>
      <div>
        <Kicker>The product</Kicker>
        <h2 data-anim="rise" style={{ "--i": 1, fontFamily: "var(--font-display)", fontWeight: 200, fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 1, margin: "28px 0 0", color: "var(--text-primary)" }}>
          The product<br />is the <b style={{ fontWeight: 500, color: "var(--accent)" }}>light</b>.
        </h2>
        <p data-anim="rise" style={{ "--i": 2, fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: "38ch", marginTop: 28 }}>
          Aurora runs entirely on the device you hold. No round-trip, no queue, no
          server waiting to answer. You ask, and it is already thinking.
        </p>
      </div>
      <div data-anim="product">
        <ScreenFrame label="LT-9 Console · Ready" ratio="16 / 10">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 36 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 72, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1 }}>40<span style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-muted)" }}>ms</span></div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginTop: 12 }}>First token · on-device</div>
          </div>
        </ScreenFrame>
      </div>
    </section>
  );
}

/* ---- Feature trio ---- */
function Features() {
  return (
    <section data-anim-root style={{ padding: "60px 48px 120px" }}>
      <Kicker>Capabilities</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, marginTop: 48 }}>
        <FeatureCell i={0} index={1} name="On-device">Runs fully local. No round-trip, no server, no wait.</FeatureCell>
        <FeatureCell i={1} index={2} name="Instant">First token in under forty milliseconds, every time.</FeatureCell>
        <FeatureCell i={2} index={3} name="Private">Nothing you say ever leaves the device you hold.</FeatureCell>
      </div>
    </section>
  );
}

/* ---- Specs / benchmark ---- */
function Specs() {
  return (
    <section id="specs" data-anim-root style={{ padding: "110px 48px", borderTop: "1px solid var(--hairline)" }}>
      <Kicker>Proof</Kicker>
      <h2 data-anim="rise" style={{ "--i": 1, fontFamily: "var(--font-display)", fontWeight: 200, fontSize: "clamp(2.2rem, 3.6vw, 3.6rem)", letterSpacing: "-0.03em", margin: "24px 0 64px", color: "var(--text-primary)" }}>
          Measured, not claimed.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 64 }}>
        <StageNumber animate countTo={2.4} value="2.4" unit="×" label="Faster inference" />
        <StageNumber animate countTo={98.7} value="98.7" unit="%" label="Task accuracy" />
        <StageNumber value="0" unit="leaks" label="Data off device" />
      </div>
    </section>
  );
}

/* ---- Closing CTA ---- */
function Closing({ onWatch }) {
  return (
    <section id="story" data-anim-root style={{ position: "relative", padding: "140px 48px 160px", textAlign: "center", overflow: "hidden", borderTop: "1px solid var(--hairline)" }}>
      <div data-lt-field data-bg="strong" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 data-anim="closing" style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em", lineHeight: 0.96, margin: 0, color: "var(--text-primary)" }}>
          See it on <b style={{ fontWeight: 500 }}>stage</b>.
        </h2>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 44 }}>
          <Button variant="solid" size="lg" icon={<PlayIcon size={15} />} onClick={onWatch}>Watch the keynote</Button>
        </div>
        <div className="lt-breathe" style={{ width: 110, height: 2, background: "var(--accent)", boxShadow: "var(--glow-soft)", margin: "56px auto 0" }} />
        <div style={{ marginTop: 30 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--text-muted)" }}>LT-9 Aurora · Available today</span>
        </div>
      </div>
    </section>
  );
}

/* ---- Watch-live takeover ---- */
function WatchLive({ open, onClose }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.86)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "min(1100px, 100%)" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: -44, right: 0, background: "transparent", border: 0, color: "var(--text-muted)", cursor: "pointer", display: "inline-flex", padding: 6 }}>
          <CloseIcon size={22} />
        </button>
        <ScreenFrame label="● Live · LT-9 Keynote" ratio="16 / 9" sweep={false}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <span style={{ display: "inline-flex", width: 84, height: 84, borderRadius: "50%", border: "1px solid var(--hairline-accent)", alignItems: "center", justifyContent: "center", color: "var(--accent)", boxShadow: "var(--glow-soft)" }}>
              <PlayIcon size={30} />
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-muted)" }}>Streaming begins 06 / 13 · 10:00 PT</span>
          </div>
        </ScreenFrame>
      </div>
    </div>
  );
}

function App() {
  const [watch, setWatch] = React.useState(false);
  const openWatch = () => setWatch(true);
  return (
    <div className="site-scroll" style={{ position: "fixed", inset: 0, overflowY: "auto", background: "var(--bg-stage)" }}>
      <LaunchNav onWatch={openWatch} />
      <Hero onWatch={openWatch} />
      <ProductSection />
      <Features />
      <Specs />
      <Closing onWatch={openWatch} />
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px 48px", borderTop: "1px solid var(--hairline)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--text-faint)" }}>LAUNCH THEATRE</span>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none" }}>
          Press kit <ArrowUpRight size={13} />
        </a>
      </footer>
      <WatchLive open={watch} onClose={() => setWatch(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
