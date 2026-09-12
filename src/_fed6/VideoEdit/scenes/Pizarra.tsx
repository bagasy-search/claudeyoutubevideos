import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── Pizarra ───────────────────────────────────────────────────────────────────
// MARCO glassmórfico PERSISTENTE que se mantiene fijo toda una tanda de componentes
// seguidos. El recuadro NUNCA desaparece: adentro, cada ESTACIÓN entra/sale con
// cross-morph y sus elementos aparecen ESCALONADOS. Contenido RICO: tarjetas con
// fondo, imágenes grandes, riel de acento y textura — nada de vacío blanco.
const TEAL = "#12B3AE";
const TEALD = "#0c8f8b";
const INK = "#12222B";
const CARD = "linear-gradient(150deg, #ffffff, #eef7f8)";

export type PizSlide = {
  kind?: "imgtext" | "steps" | "checklist" | "bullets" | "phrase" | "stat";
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  items?: string[];
  steps?: { title: string; sub?: string; image?: string }[];
  value?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  dur?: number;
};

const cI = (f: number, a: number, b: number, x: number, y: number, e?: (n: number) => number) =>
  interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sf = (p?: string) => (p ? staticFile(p) : undefined);
const EASE = Easing.out(Easing.cubic);
const elAt = (i: number, count: number, span: number) => 14 + i * Math.min(26, (span * 0.6) / Math.max(1, count));

export const Pizarra: React.FC<{
  durationInFrames: number;
  title?: string;
  slides?: PizSlide[];
}> = ({ durationInFrames: D, slides = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(1, slides.length);

  const boardIn = spring({ frame, fps, config: { damping: 20, mass: 1, stiffness: 90 } });
  const boardOut = cI(frame, D - 12, D, 1, 0);
  const boardOp = Math.min(boardIn, boardOut);
  const boardScale = interpolate(boardIn, [0, 1], [0.96, 1]);

  const head = D * 0.04;
  const totalW = slides.reduce((a, s) => a + (s.dur || 1), 0) || 1;
  let acc = head;
  const win = slides.map((s) => {
    const w = ((D * 0.96 - head) * (s.dur || 1)) / totalW;
    const r = { start: acc, end: acc + w };
    acc += w;
    return r;
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#0a171c,#122a31)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(18,179,174,0.12), transparent 70%)" }} />

      {/* PIZARRA persistente */}
      <div
        style={{
          position: "absolute",
          inset: "58px 80px",
          borderRadius: 34,
          opacity: boardOp,
          transform: `scale(${boardScale})`,
          background: "linear-gradient(150deg, #ffffff, #eef6f7)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.95)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}
      >
        {/* decoración persistente: riel de acento + blob + textura de puntos */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 8, background: `linear-gradient(180deg, ${TEAL}, ${TEALD})` }} />
        <div style={{ position: "absolute", top: -160, right: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(18,179,174,0.16), transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: -180, left: 40, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,125,176,0.10), transparent 68%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(rgba(18,40,43,0.05) 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }} />

        {/* pips de progreso (persisten) */}
        <div style={{ position: "absolute", top: 44, right: 54, display: "flex", gap: 9, zIndex: 3 }}>
          {slides.map((_, i) => {
            const on = frame >= win[i].start;
            return <div key={i} style={{ width: on ? 30 : 12, height: 9, borderRadius: 5, background: on ? TEAL : "rgba(20,34,43,0.15)" }} />;
          })}
        </div>

        {/* ESTACIONES */}
        {slides.map((s, i) => {
          const { start, end } = win[i];
          const span = end - start;
          const lf = frame - start;
          const inF = cI(frame, start, start + 14, 0, 1, EASE);
          const outF = i < n - 1 ? cI(frame, end - 9, end + 5, 1, 0) : 1;
          const o = Math.min(inF, outF);
          if (o <= 0.001) return null;
          const tx = interpolate(inF, [0, 1], [40, 0]);
          const sc = interpolate(Math.min(inF, outF), [0, 1], [0.97, 1]);
          return (
            <div key={i} style={{ position: "absolute", inset: "44px 62px 52px 74px", opacity: o, transform: `translateX(${tx}px) scale(${sc})`, display: "flex", flexDirection: "column" }}>
              {(s.eyebrow || s.heading) && s.kind !== "phrase" && (
                <div style={{ flex: "0 0 auto", marginBottom: 22, display: "flex", flexDirection: "column" }}>
                  {s.eyebrow && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, alignSelf: "flex-start", opacity: cI(lf, 2, 14, 0, 1) }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: `linear-gradient(150deg,${TEAL},${TEALD})` }} />
                      <span style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: TEALD, textTransform: "uppercase" }}>{s.eyebrow}</span>
                    </div>
                  )}
                  {s.heading && <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 50, color: INK, marginTop: 10, letterSpacing: -0.5, opacity: cI(lf, 6, 18, 0, 1) }}>{s.heading}</div>}
                </div>
              )}
              <div style={{ flex: 1, minHeight: 0 }}>{renderContent(s, lf, span)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function renderContent(s: PizSlide, lf: number, span: number): React.ReactNode {
  const kind = s.kind || (s.image ? "imgtext" : s.steps ? "steps" : s.items ? "checklist" : s.value != null ? "stat" : "phrase");

  if (kind === "imgtext") {
    const chars = Math.max(0, Math.min((s.body || "").length, Math.floor((lf - 16) * 1.3)));
    return (
      <div style={{ display: "flex", gap: 46, alignItems: "stretch", height: "100%" }}>
        {s.image && (
          <div style={{ flex: "0 0 52%", borderRadius: 26, overflow: "hidden", boxShadow: "0 28px 56px rgba(20,34,43,0.32)", border: "4px solid #fff", position: "relative" }}>
            <Img src={sf(s.image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(cI(lf, 0, 24, 0, 1), [0, 1], [1.14, 1.05])})` }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 60%, rgba(18,179,174,0.16))" }} />
          </div>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 90, lineHeight: 0.5, color: TEAL, fontFamily: "Georgia,serif", opacity: cI(lf, 8, 22, 0, 1) }}>&ldquo;</div>
          <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: 40, lineHeight: 1.35, color: INK, marginTop: 14 }}>
            {(s.body || "").slice(0, chars)}
            {chars < (s.body || "").length && <span style={{ opacity: Math.floor(lf / 8) % 2 ? 1 : 0, color: TEAL }}>|</span>}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "steps") {
    const steps = s.steps || [];
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%", gap: 20 }}>
        {steps.map((st, i) => {
          const at = elAt(i, steps.length, span);
          const e = cI(lf, at, at + 16, 0, 1, EASE);
          if (e <= 0.001) return null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-30, 0])}px)`, background: CARD, borderRadius: 26, padding: "28px 32px", boxShadow: "0 16px 34px rgba(20,34,43,0.11)", border: "1px solid rgba(18,179,174,0.16)" }}>
              <div style={{ flex: "0 0 84px", width: 84, height: 84, borderRadius: 22, background: `linear-gradient(150deg,${TEAL},${TEALD})`, color: "#fff", fontFamily: F_INTER, fontWeight: 800, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 28px ${TEAL}66` }}>{i + 1}</div>
              {st.image && <div style={{ flex: "0 0 200px", height: 148, borderRadius: 18, overflow: "hidden", border: "3px solid #fff", boxShadow: "0 12px 26px rgba(20,34,43,0.24)" }}><Img src={sf(st.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 40, color: INK }}>{st.title}</div>
                {st.sub && <div style={{ fontFamily: F_INTER, fontWeight: 500, fontSize: 29, color: "rgba(20,34,43,0.62)", marginTop: 3 }}>{st.sub}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "checklist" || kind === "bullets") {
    const items = s.items || [];
    const check = kind === "checklist";
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%", gap: 20 }}>
        {items.map((it, i) => {
          const at = elAt(i, items.length, span);
          const e = cI(lf, at, at + 16, 0, 1, EASE);
          if (e <= 0.001) return null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: e, transform: `translateX(${interpolate(e, [0, 1], [-30, 0])}px)`, background: CARD, borderRadius: 22, padding: "20px 30px", boxShadow: "0 12px 26px rgba(20,34,43,0.09)", border: "1px solid rgba(18,179,174,0.14)" }}>
              <div style={{ flex: "0 0 54px", width: 54, height: 54, borderRadius: check ? 16 : 999, background: check ? `linear-gradient(150deg,${TEAL},${TEALD})` : "transparent", border: check ? "none" : `4px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {check ? (
                  <svg width="30" height="30" viewBox="0 0 26 26"><path d="M5 13 L11 19 L21 7" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset={interpolate(cI(lf, at + 4, at + 20, 0, 1), [0, 1], [40, 0])} /></svg>
                ) : (
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: TEAL }} />
                )}
              </div>
              <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 42, color: INK }}>{it}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "stat") {
    const e = cI(lf, 6, 30, 0, 1, EASE);
    const p = cI(lf, 8, 44, 0, 1, EASE);
    const val = Math.round((s.value || 0) * p);
    return (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center" }}>
        {/* número fantasma de fondo */}
        <div style={{ position: "absolute", fontFamily: F_INTER, fontWeight: 900, fontSize: 420, color: "rgba(18,179,174,0.07)", lineHeight: 1, userSelect: "none" }}>{s.suffix?.includes("año") || s.prefix ? val : `${s.prefix || ""}${val}`}</div>
        <div style={{ position: "relative", fontFamily: F_INTER, fontWeight: 900, fontSize: 210, lineHeight: 1, background: `linear-gradient(150deg,${INK},${TEALD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: e, letterSpacing: -6 }}>{s.prefix || ""}{val}{s.suffix || ""}</div>
        {s.label && <div style={{ position: "relative", fontFamily: F_INTER, fontWeight: 600, fontSize: 38, color: "rgba(20,34,43,0.7)", marginTop: 22, opacity: cI(lf, 22, 42, 0, 1), maxWidth: "78%" }}>{s.label}</div>}
      </div>
    );
  }

  // phrase
  const words = (s.heading || s.body || "").split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 18px", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 20px" }}>
      {words.map((w, i) => {
        const at = elAt(i, words.length, span);
        const e = cI(lf, at, at + 12, 0, 1, EASE);
        const key = i === words.length - 1;
        return <span key={i} style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 70, color: key ? TEALD : INK, opacity: e, transform: `translateY(${interpolate(e, [0, 1], [16, 0])}px)`, display: "inline-block" }}>{w}</span>;
      })}
    </div>
  );
}
