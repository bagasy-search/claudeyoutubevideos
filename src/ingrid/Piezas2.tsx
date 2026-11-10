// ingrid01 (Estocolmo) — basado en fumiko01 v2 / seisho01; lista de 12 prendas (carrusel, progreso, aperturas, barrido de tejido, encuadres, mapa, álbum, recap, CTA) + paleta, etiqueta de cuidado, conjunto del día
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, hash, useKB } from "./Piezas";

const { SERIF, SERIF_I, SANS, HAND } = FONTS;
const KANJI = ["", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const PINK = "#E9DCC4"; // avena clara (sobre oscuro)
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], CL); };

// grano de película (SVG, sin imágenes)
export const Grain: React.FC<{ op?: number }> = ({ op = 0.18 }) => {
  const f = useCurrentFrame(); const id = "gr" + (f % 4);
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: op, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 4} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

export type HabCard = { title: string; src: string };
export const LIST = { n: 12, head: "pieces. That's all.", tag: "KEPT", short: "PIECE" };

// tarjeta de hábito con foto (carrusel / recap)
const HabitPhotoCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: C.paper, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.45)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
      <div style={{ position: "absolute", left: w * 0.04, top: 0, width: w * 0.17, height: w * 0.15, background: C.ink, color: C.paper, fontFamily: SERIF, fontWeight: 600, fontSize: w * 0.075,
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }}><div style={{ position: "absolute", inset: Math.max(2, w * 0.012), border: "1px dashed rgba(245,242,234,0.6)" }} />{KANJI[n]}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.03, marginTop: w * 0.035, height: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.05, color: C.ver, letterSpacing: 2 }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.08, color: C.ink, lineHeight: 1.05, opacity: 1 - dim * 0.5 }}>{title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.22, height: w * 0.22, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(${interpolate(check, [0, 1], [-30, -8])}deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.12, color: C.white, lineHeight: 1 }}>✓</span>
      </div>
    )}
  </div>
);

// fondo: material real desenfocado
export const BlurBg: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.5 }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `blur(22px) brightness(${1 - dark})`, transform: "scale(1.15)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      {src.endsWith(".mp4") ? <OffthreadVideo src={staticFile(src)} muted playbackRate={0.5} style={st} /> : <Img src={staticFile(src)} style={st} />}
    </AbsoluteFill>
  );
};

// (1) carrusel 3D de los N ítems sobre video real desenfocado → termina en abanico
export const Carousel: React.FC<{ cards: HabCard[]; bg: string; subAt: number; sub?: string; ats?: number[]; dur: number }> = ({ cards, bg, subAt, sub = "", ats = [], dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 12); const pIn = useIn(0, 22);
  const fanT = ease((f - dur * 0.8) / 34);
  const rot = -f * 0.42;
  const R = 760, PR = 1700;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <BlurBg src={bg} dark={0.45} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(20,12,6,0) 30%, rgba(20,12,6,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 100, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: PINK }}>{cards.length}</span> {LIST.head}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: C.paper, textShadow: shadow, marginTop: 10, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>{sub}</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        {cards.map((c, i) => {
          const appear = spring({ frame: f - 4 - (ats[i] ?? i * 5), fps: 30, config: { damping: 16, mass: 0.6 } });
          const N = cards.length; const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180;
          const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
          const phi = -33 + i * (66 / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const fx = PR * Math.sin(pr), fy = PR * (1 - Math.cos(pr));
          const x = lerp(rx, fx, fanT), y = lerp(40, fy, fanT), z = lerp(rz, i * 2, fanT);
          const ry = lerp(th, 0, fanT), rzz = lerp(0, phi, fanT);
          const sc = lerp(1, 0.86, fanT) * appear;
          const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fanT);
          return (
            <div key={i} style={{ position: "absolute", left: 960 - 190, top: 360, zIndex: Math.round(2000 + z), opacity: vis * appear,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rzz}deg) scale(${sc})` }}>
              <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={380} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (2) barra de progreso n / 10 en la esquina
export const Progress: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", right: 56, top: 48, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: C.white, textShadow: shadow }}>
        <span style={{ color: PINK }}>{String(n).padStart(2, "0")}</span> / {String(LIST.n).padStart(2, "0")} · {title.toUpperCase()}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: LIST.n }, (_, i) => (
          <div key={i} style={{ width: 26, height: 5, borderRadius: 3, background: i < n ? C.ver : "rgba(255,253,248,0.45)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
        ))}
      </div>
    </div>
  );
};

// (5) barrido de tejido: un paño de punto navy (jersey en V) cruza la pantalla con el borde ribeteado (dir 0 →, 1 ←, 2 ↓, 3 ↘)
const KNIT_BG = "repeating-linear-gradient(60deg, rgba(255,255,255,0.07) 0 7px, rgba(0,0,0,0) 7px 14px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.07) 0 7px, rgba(0,0,0,0) 7px 14px), repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, rgba(0,0,0,0) 2px 16px), #1E2B3D";
export const InkWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame();
  const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-1.25, 1.25, Easing.inOut(Easing.quad)(t));
  const sign = dir === 1 ? -1 : 1;
  const vertical = dir === 2;
  const rib = (side: "a" | "b"): React.CSSProperties => vertical
    ? { position: "absolute", left: 0, right: 0, height: 34, [side === "a" ? "top" : "bottom"]: -34, background: "repeating-linear-gradient(90deg, #2A3A52 0 10px, #18222F 10px 20px)" }
    : { position: "absolute", top: 0, bottom: 0, width: 34, [side === "a" ? "left" : "right"]: -34, background: "repeating-linear-gradient(0deg, #2A3A52 0 10px, #18222F 10px 20px)" };
  const panel: React.CSSProperties = vertical
    ? { position: "absolute", left: -100, width: 2120, height: 1500, top: 540 + pos * 1300 - 750 }
    : { position: "absolute", top: -400, height: 1880, width: 2300, left: 960 + sign * pos * 2200 - 1150 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${dir === 3 ? 16 : 0}deg)` }}>
        <div style={{ ...panel, background: KNIT_BG, boxShadow: "0 0 60px rgba(0,0,0,0.55)" }}>
          <div style={rib("a")} /><div style={rib("b")} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
export const KnitWipe = InkWipe;

// cambio de capítulo: el paño de punto entra, muestra "RULE 02 · Colour" con la etiqueta tejida, y sale por el otro lado
export const ChapterWipe: React.FC<{ label: string; title: string; sv?: string; dur: number }> = ({ label, title, sv, dur }) => {
  const f = useCurrentFrame();
  const inX = interpolate(f, [0, 14], [100, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const outX = interpolate(f, [dur - 14, dur], [0, -100], { ...CL, easing: Easing.in(Easing.cubic) });
  const x = f < dur / 2 ? inX : outX;
  const p = spring({ frame: f - 10, fps: 30, config: { damping: 16, mass: 0.7 } });
  const line = interpolate(f, [16, 34], [0, 1], CL);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${x}%)`, background: KNIT_BG }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: -34, width: 34, background: "repeating-linear-gradient(0deg, #2A3A52 0 10px, #18222F 10px 20px)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: -34, width: 34, background: "repeating-linear-gradient(0deg, #2A3A52 0 10px, #18222F 10px 20px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
          <div style={{ position: "relative", padding: "12px 34px", background: C.paper, color: C.ink, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 9 }}>
            <div style={{ position: "absolute", inset: 5, border: `1px dashed ${C.ink}`, opacity: 0.5 }} />{label}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 120, color: C.white, marginTop: 26, lineHeight: 1 }}>{title}</div>
          {sv && <div style={{ fontFamily: SERIF_I, fontWeight: 400, fontSize: 54, color: PINK, marginTop: 14 }}>{sv}</div>}
          <div style={{ height: 3, background: C.ver, marginTop: 26, width: 300 * line }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (3) apertura de cada hábito: pincelada → foto a pantalla completa, número trazado, título palabra por palabra
export const HabitScene: React.FC<{ n: number; title: string; src: string; dur: number }> = ({ n, title, src, dur }) => {
  const f = useCurrentFrame();
  const v = n - 1, dir = v % 4, right = v % 2 === 1, mode = [0, 2, 1, 3, 2, 0, 3, 1, 0, 3, 2, 1][v % 12];
  const o = useOut(dur, 10);
  const k = cl((f - 10) / (dur - 10), 0, 1);
  // 0 = se asienta desde cerca · 1 = empuje lento · 2 = llega por el riel como una percha (con vaivén) · 3 = se abre como una cortina desde el centro
  const z = mode === 0 ? lerp(1.28, 1.08, Easing.out(Easing.cubic)(k)) : mode === 1 ? lerp(1.05, 1.2, k) : mode === 2 ? 1.12 : lerp(1.18, 1.1, k);
  const slide = mode === 2 ? spring({ frame: f - 10, fps: 30, config: { damping: 13, mass: 0.9 } }) : 1;
  const px = mode === 2 ? (1 - slide) * (right ? -105 : 105) : 0;
  const swing = mode === 2 ? Math.sin((f - 10) / 5) * 2.2 * Math.max(0, 1 - (f - 10) / 40) : 0;
  const curtain = mode === 3 ? interpolate(f, [10, 26], [50, 0], { ...CL, easing: Easing.out(Easing.cubic) }) : 0;
  const draw = interpolate(f, [14, 40], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const fill = interpolate(f, [36, 48], [0, 1], CL);
  const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 120, alignItems: "flex-end" } : { left: 120, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      {f >= 10 && (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill style={{ overflow: "hidden", background: C.ink, clipPath: `inset(0 ${curtain}% 0 ${curtain}%)` }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}%) rotate(${swing}deg) scale(${z})`, transformOrigin: "50% 0%" }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(14,20,30,0.82) 0%, rgba(14,20,30,0.38) 45%, rgba(14,20,30,0) 70%)` }} />
          <div style={{ position: "absolute", top: 230, width: 860, display: "flex", flexDirection: "column", ...side }}>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 10, color: PINK, opacity: draw }}>{LIST.short} {KANJI[n]} OF 12</div>
            <svg width="560" height="300" viewBox="0 0 560 300" style={{ overflow: "visible" }}>
              <text x={right ? 560 : 0} y="262" textAnchor={right ? "end" : "start"} fontFamily={SERIF} fontWeight={500} fontSize="300"
                fill={`rgba(255,253,248,${fill})`} stroke={C.white} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)}>{String(n).padStart(2, "0")}</text>
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 6 }}>
              {words.map((w, i) => {
                const p = spring({ frame: f - 30 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 86, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
              })}
            </div>
            <div style={{ height: 4, background: C.ver, marginTop: 18, width: 260 * interpolate(f, [44, 60], [0, 1], CL) }} />
          </div>
        </AbsoluteFill>
      )}
      <InkWipe dir={dir} len={20} />
    </AbsoluteFill>
  );
};

// (4) 50/50: la foto ocupa la mitad derecha (el avatar se corre solo, ver AvatarFramed)
export const SplitPhoto: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12, dur - 10, dur], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const kb = useKB(seed, dur);
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 960, overflow: "hidden", transform: `translateX(${(1 - p) * 102}%)`, borderLeft: `8px solid ${C.paper}`, boxShadow: "-12px 0 40px rgba(0,0,0,0.4)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </div>
  );
};

// (4) polaroid que cae al lado del avatar (recuerdos)
export const Polaroid: React.FC<{ src: string; caption: string; dur: number; seed?: number; left?: boolean }> = ({ src, caption, dur, seed = 1, left }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 11, mass: 0.8 } });
  const r = (hash(seed) % 2 ? 1 : -1) * (4 + (hash(seed + 3) % 5));
  return (
    <div style={{ position: "absolute", ...(left ? { left: 130 } : { right: 130 }), top: 160, width: 520, opacity: o, transform: `translateY(${(1 - p) * -1000}px) rotate(${r + (1 - p) * 25}deg)` }}>
      <div style={{ background: "#FBF8F1", padding: "24px 24px 96px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative" }}>
        <div style={{ width: 472, height: 400, overflow: "hidden", position: "relative" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.35) contrast(0.95)" }} />
          <Grain op={0.25} />
        </div>
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.indigo }}>{caption}</div>
        <div style={{ position: "absolute", top: -18, left: 190, width: 140, height: 40, background: "rgba(234,223,203,0.85)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
};

// (8) foto antigua como objeto físico: página de álbum, cinta en las esquinas, grano
export const Album: React.FC<{ src: string; seed: number; dur: number; under?: string }> = ({ src, seed, dur, under }) => {
  const f = useCurrentFrame();
  const t = f / Math.max(1, dur);
  const r = (hash(seed) % 2 ? 1 : -1) * (1.5 + (hash(seed + 1) % 3));
  const tape = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 150, height: 44, background: "rgba(236,226,204,0.82)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", ...s }} />;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #4C4A46 0%, #2C2B29 70%, #1C1C1B 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.3, backgroundImage: "repeating-linear-gradient(97deg, rgba(255,230,190,0.05) 0 1px, transparent 1px 9px)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * t}) translateY(${-10 * t}px) rotate(${-0.6 * t}deg)` }}>
        {under && (
          <div style={{ position: "absolute", left: 1240, top: 90, width: 560, padding: 18, background: "#EFE6D2", transform: `rotate(${-r * 2.5}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", opacity: 0.8 }}>
            <Img src={staticFile(under)} style={{ width: "100%", height: 380, objectFit: "cover", filter: "sepia(0.6) brightness(0.75)" }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 330, top: 110, width: 1260, padding: "30px 30px 36px", background: "#F1E9D6", transform: `rotate(${r}deg)`, boxShadow: "0 36px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 1200, height: 770, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.25) contrast(1.02)" }} />
            <Grain op={0.3} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 120px rgba(40,25,10,0.45)" }} />
          </div>
          {tape({ left: -48, top: -12, transform: "rotate(-38deg)" })}
          {tape({ right: -48, top: -12, transform: "rotate(38deg)" })}
          {tape({ left: -48, bottom: -12, transform: "rotate(38deg)" })}
          {tape({ right: -48, bottom: -12, transform: "rotate(-38deg)" })}
        </div>
      </AbsoluteFill>
      <Grain op={0.12} />
    </AbsoluteFill>
  );
};

// (7) mapa de Estocolmo en acuarela con ruta (coordenadas en % de la imagen mapse, que llena el cuadro)
export const MapJP: React.FC<{ a: [number, number]; b: [number, number]; la: string; ja?: string; lb: string; jb?: string; dur: number }> = ({ a, b, la, ja, lb, jb, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], CL);
  const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
  const span = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]) * 1.78);
  const zEnd = cl(60 / Math.max(span, 6), 1.0, 4);
  const k = ease((f - 4) / 30);
  const z = lerp(Math.max(zEnd, 4.2), zEnd, k), ox = lerp(a[0], cx, k), oy = lerp(a[1], cy, k);
  const line = interpolate(f, [18, 50], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const ax = a[0] * 19.2, ay = a[1] * 10.8, bx = b[0] * 19.2, by = b[1] * 10.8;
  const mx = (ax + bx) / 2 - (by - ay) * 0.25, my = (ay + by) / 2 - Math.abs(bx - ax) * 0.25;
  const pulse = 1 + 0.3 * Math.sin(f / 5);
  const pb = spring({ frame: f - 48, fps: 30, config: { damping: 12 } });
  // traslado para que el punto (ox,oy)% quede en el centro de la pantalla a escala z
  const tx = (50 - ox) * 19.2, ty = (50 - oy) * 10.8;
  const lab = (x: number, y: number, t: string, jp?: string, op = 1) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${1 / z}) translate(24px, -110%)`, transformOrigin: "0 0", whiteSpace: "nowrap", background: "rgba(244,237,225,0.85)", padding: "2px 14px", borderRadius: 4 }}>
      <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: 2, color: C.ink }}>{t}</span>
      {jp && <span style={{ fontFamily: SERIF_I, fontWeight: 500, fontSize: 44, color: C.ver, marginLeft: 14 }}>{jp}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile("ingrid01/g/mapse.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} fill="none" stroke={C.ver} strokeWidth={6 / z} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - line)} />
          <circle cx={ax} cy={ay} r={(12 / z) * pulse} fill={C.ver} />
          <circle cx={ax} cy={ay} r={(30 / z) * pulse} fill="none" stroke={C.ver} strokeWidth={3 / z} opacity={0.5} />
          <circle cx={bx} cy={by} r={(14 / z) * pb} fill={C.indigo} />
        </svg>
        {lab(ax, ay, la, ja)}
        {lab(bx, by, lb, jb, pb)}
      </AbsoluteFill>
      <Grain op={0.1} />
    </AbsoluteFill>
  );
};

// (10) recap: las 10 tarjetas del carrusel ordenadas en grilla, se tildan una a una
export const RecapGrid: React.FC<{ items: { txt: string; f: number }[]; cards: HabCard[]; bg: string; dur: number }> = ({ items, cards, bg }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  return (
    <AbsoluteFill>
      <BlurBg src={bg} dark={0.5} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 74, color: C.white, textShadow: shadow, opacity: p }}>
        <span style={{ color: PINK }}>{cards.length}</span> pieces · always elegant
      </div>
      {cards.map((c, i) => {
        const col = i % 6, row = Math.floor(i / 6);
        const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 85 + col * 298, top: 190 + row * 420, opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={272} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (10) CTA suave junto al avatar, con la fila de los 10 hábitos
export const CTA: React.FC<{ text: string; cards: HabCard[]; dur: number }> = ({ text, cards, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20), o = useOut(dur, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,20,30,0.72) 0%, rgba(14,20,30,0) 40%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 215, textAlign: "center", opacity: p }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 62, color: C.white, textShadow: shadow, borderBottom: `4px solid ${C.ver}`, paddingBottom: 6 }}>{text}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", gap: 10 }}>
        {cards.map((c, i) => {
          const e = spring({ frame: f - 8 - i * 3, fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ width: 138, height: 124, borderRadius: 4, overflow: "hidden", border: `3px solid ${C.paper}`, position: "relative", opacity: e, transform: `translateY(${(1 - e) * 80}px)`, boxShadow: "0 8px 18px rgba(0,0,0,0.45)" }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 6, top: 4, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.white, textShadow: shadow }}>{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// (4) avatar con encuadres: punch-in 112 % en golpes y corrimiento a la izquierda para el 50/50
export const AvatarFramed: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame();
  const inn = hash(seed + 99) % 3 !== 0;
  const t = f / Math.max(1, dur);
  let z = inn ? 1.03 + 0.05 * t : 1.08 - 0.05 * t;
  let tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
    if (m.k === "punch") z *= 1 + 0.12 * w;
    if (m.k === "split") tx += -24 * w;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "52% 33%" }} />
    </AbsoluteFill>
  );
};

// ───────────── piezas nuevas de ingrid01 ─────────────
const Linen: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "relative", background: `repeating-linear-gradient(0deg, rgba(28,39,55,0.035) 0 1px, rgba(0,0,0,0) 1px 4px), repeating-linear-gradient(90deg, rgba(28,39,55,0.035) 0 1px, rgba(0,0,0,0) 1px 4px), ${C.paper}`,
    boxShadow: "0 18px 40px rgba(0,0,0,0.38)", ...style }}>
    <div style={{ position: "absolute", inset: 10, border: `1.5px dashed rgba(28,39,55,0.28)`, pointerEvents: "none" }} />
    {children}
  </div>
);

// paleta del norte: muestras de tela que se cuelgan una a una sobre su palabra; el acento rojo llega aparte
export const Palette: React.FC<{ cols: { hex: string; name: string; sv: string; f: number }[]; accent?: { hex: string; name: string; sv: string; f: number }; dur: number }> = ({ cols, accent, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 10);
  const all = accent ? [...cols, accent] : cols;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,20,30,0.75) 0%, rgba(14,20,30,0) 55%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 34 }}>
        {all.map((c, i) => {
          const p = spring({ frame: f - c.f, fps: 30, config: { damping: 11, mass: 0.8 } });
          const sw = Math.sin((f - c.f) / 6) * 4 * Math.max(0, 1 - (f - c.f) / 45);
          const isAcc = accent && i === all.length - 1;
          return (
            <div key={i} style={{ width: isAcc ? 200 : 250, opacity: cl(p * 2, 0, 1), transform: `translateY(${(1 - p) * -260}px) rotate(${sw}deg)`, transformOrigin: "50% 0%", marginLeft: isAcc ? 30 : 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, border: "3px solid #B9B2A6", margin: "0 auto -6px", position: "relative", zIndex: 2 }} />
              <div style={{ height: isAcc ? 230 : 280, background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 3px, rgba(0,0,0,0.05) 3px 6px), ${c.hex}`, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", borderBottom: "6px dotted rgba(0,0,0,0.12)" }} />
              <div style={{ background: C.paper, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 3, color: C.ink }}>{c.name.toUpperCase()}</div>
                <div style={{ fontFamily: SERIF_I, fontSize: 26, color: isAcc ? C.ver : C.indigo }}>{c.sv}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// etiqueta de cuidado cosida: los símbolos aparecen sobre su palabra
const CareIcon: React.FC<{ k: string }> = ({ k }) => {
  const s = { fill: "none", stroke: C.ink, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="120" height="100" viewBox="0 0 120 100">
      {k === "hand" && <><path d="M12 34 L22 86 H98 L108 34" {...s} /><path d="M10 34 Q35 22 60 34 T110 34" {...s} /><path d="M50 58 q6 -26 14 -2 M58 52 q6 -22 14 0 M66 56 q5 -16 12 2" {...s} strokeWidth={4} /></>}
      {k === "nowring" && <><path d="M18 50 Q34 22 50 50 T82 50 T104 40" {...s} /><path d="M12 50 h10 M100 40 h10" {...s} /><path d="M24 16 L96 86 M96 16 L24 86" {...s} stroke={C.ver} /></>}
      {k === "flat" && <><rect x="14" y="14" width="92" height="72" {...s} /><path d="M32 50 H88" {...s} /></>}
      {k === "nohanger" && <><path d="M60 22 q0 -12 10 -10 q10 4 -10 18 L18 72 H102 L60 30" {...s} /><path d="M20 16 L100 88 M100 16 L20 88" {...s} stroke={C.ver} /></>}
      {k === "cold" && <><path d="M12 34 L22 86 H98 L108 34" {...s} /><path d="M10 34 Q35 22 60 34 T110 34" {...s} /><text x="60" y="74" textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize="26" fill={C.ink}>30°</text></>}
    </svg>
  );
};
export const Care: React.FC<{ items: { k: string; txt: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 15, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Linen style={{ position: "absolute", right: 120, top: 150, width: 520, padding: "44px 46px 34px", transform: `translateY(${(1 - p) * -700}px) rotate(1.2deg)` }}>
        <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 16, background: "repeating-linear-gradient(90deg, #DCD3C2 0 6px, #EFEAE0 6px 12px)" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: C.ver, textAlign: "center" }}>100% WOOL · ULL</div>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: C.ink, textAlign: "center", margin: "6px 0 18px" }}>Care</div>
        {items.map((it, i) => {
          const q = spring({ frame: f - it.f, fps: 30, config: { damping: 14, mass: 0.6 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: q, transform: `translateX(${(1 - q) * 40}px)`, marginBottom: 6 }}>
              <div style={{ transform: "scale(0.7)", transformOrigin: "0 50%", width: 86, height: 70 }}><CareIcon k={it.k} /></div>
              <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 30, color: C.ink }}>{it.txt}</div>
            </div>
          );
        })}
      </Linen>
    </AbsoluteFill>
  );
};

// conjunto del día: el día en inglés + sueco y tres fichas de prenda que se enganchan
export const Outfit: React.FC<{ day: string; sv: string; items: { txt: string; f: number }[]; dur: number }> = ({ day, sv, items, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 16, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,20,30,0.7) 0%, rgba(14,20,30,0) 50%)" }} />
      <div style={{ position: "absolute", left: 110, top: 150, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 10, color: PINK }}>ONE ORDINARY WEEK</div>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 120, color: C.white, textShadow: shadow, lineHeight: 1.05 }}>{day}</div>
        <div style={{ fontFamily: SERIF_I, fontSize: 52, color: PINK, textShadow: shadow }}>{sv}</div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((it, i) => {
            const q = spring({ frame: f - it.f, fps: 30, config: { damping: 12, mass: 0.6 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, opacity: cl(q * 2, 0, 1), transform: `translateX(${(1 - q) * -80}px)` }}>
                <div style={{ width: 34, height: 3, background: C.paper }} />
                <div style={{ position: "relative", background: C.paper, color: C.ink, fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: 1, padding: "10px 26px 10px 34px", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                  <div style={{ position: "absolute", left: 10, top: "50%", width: 10, height: 10, borderRadius: 5, marginTop: -5, border: `2px solid ${C.ink}` }} />{it.txt}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// libreta negra de la cocina: deseos anotados con fecha y el sello "30 days"
export const Notebook: React.FC<{ lines: { txt: string; date: string; f: number; cross?: number }[]; stampAt?: number; dur: number }> = ({ lines, stampAt = 9999, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 16, mass: 0.8 } });
  const st = spring({ frame: f - stampAt, fps: 30, config: { damping: 9, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 140, top: 130, width: 640, height: 800, background: "#151A22", borderRadius: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `translateY(${(1 - p) * 500}px) rotate(-2deg)`, padding: 26 }}>
        <div style={{ position: "absolute", right: 46, top: -4, bottom: -4, width: 22, background: "#232A36" }} />
        <div style={{ position: "relative", height: "100%", background: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 63px, rgba(67,86,107,0.35) 63px 65px), #F6F1E6`, borderRadius: 6, padding: "70px 44px" }}>
          {lines.map((l, i) => {
            const w = interpolate(f, [l.f, l.f + 22], [0, 100], CL);
            const cr = l.cross !== undefined ? interpolate(f, [l.cross, l.cross + 12], [0, 100], CL) : 0;
            return (
              <div key={i} style={{ position: "relative", height: 130, overflow: "hidden" }}>
                <div style={{ fontFamily: HAND, fontSize: 30, color: C.indigo, clipPath: `inset(0 ${100 - w}% 0 0)` }}>{l.date}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: C.ink, clipPath: `inset(0 ${100 - w}% 0 0)`, lineHeight: 1.1 }}>{l.txt}</div>
                <div style={{ position: "absolute", left: 0, top: 70, height: 4, width: `${cr * 0.9}%`, background: C.ver, transform: "rotate(-1.5deg)" }} />
              </div>
            );
          })}
          {f >= stampAt && (
            <div style={{ position: "absolute", right: 40, bottom: 70, padding: "14px 26px", border: `5px solid ${C.ver}`, color: C.ver, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 4,
              transform: `rotate(-9deg) scale(${lerp(2.2, 1, st)})`, opacity: cl(st * 1.5, 0, 0.9) }}>WAIT 30 DAYS</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// cifra con fuente real (WRAP 2012): tarjeta de informe con barra de -20…30 %
export const Wrap: React.FC<{ marks: number[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 16, mass: 0.8 } });
  const m = (i: number) => marks[i] ?? 9999;
  const bar = interpolate(f, [m(2), m(2) + 30], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const rows = ["carbon", "water", "waste"];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Linen style={{ position: "absolute", left: 110, top: 130, width: 760, padding: "46px 54px", transform: `translateX(${(1 - p) * -900}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 7, color: C.ver }}>THE REPORT · UK · 2012</div>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 62, color: C.ink, margin: "10px 0 6px", lineHeight: 1.05 }}>Wear it <span style={{ fontFamily: SERIF_I, color: C.ver }}>9 months</span> longer</div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: C.indigo, opacity: interpolate(f, [m(1), m(1) + 10], [0, 1], CL) }}>and its footprint shrinks by about</div>
        <div style={{ marginTop: 26 }}>
          {rows.map((r, i) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
              <div style={{ width: 120, fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 3, color: C.ink }}>{r.toUpperCase()}</div>
              <div style={{ flex: 1, height: 34, background: "rgba(28,39,55,0.12)", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 - 25 * bar) - i * 0}%`, background: C.ink }} />
                <div style={{ position: "absolute", left: "70%", top: 0, bottom: 0, width: "10%", background: "repeating-linear-gradient(45deg, rgba(163,38,59,0.85) 0 6px, rgba(163,38,59,0.35) 6px 12px)", opacity: bar }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 88, color: C.ver, opacity: bar, lineHeight: 1 }}>−20–30 %</div>
        <div style={{ height: 2, background: "rgba(28,39,55,0.3)", margin: "20px 0 12px" }} />
        <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 2, color: C.indigo }}>Source: WRAP · Valuing Our Clothes (2012)</div>
      </Linen>
    </AbsoluteFill>
  );
};
