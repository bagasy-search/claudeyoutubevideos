// Piezas del video chiyo01 — look "mostrador de Ginza": tarjeta perla con filete dorado, rojo camelia, ciruela, rubor.
// Parten de las piezas de fumiko01 (src/fumiko) con otro mundo: nada de washi ni tinta.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadSans } from "@remotion/google-fonts/Jost";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["500", "700"], subsets: ["latin"] });
// japonés: subset de Zen Old Mincho (OFL) solo con los caracteres que se usan
const JP = "ZenSub";
if (typeof document !== "undefined" && !document.getElementById("ch-jp")) {
  const st = document.createElement("style"); st.id = "ch-jp";
  st.innerHTML = `@font-face{font-family:'${JP}';src:url('${staticFile("chiyo01/font/zen_sub.woff2")}') format('woff2');font-weight:700;font-display:block;}`;
  document.head.appendChild(st);
}

export const C = { paper: "#F7F2EB", paper2: "#EEE4D8", ink: "#2A2025", ver: "#B4232F", plum: "#5B2B3D", gold: "#B79A5B", blush: "#F1BDB8", white: "#FFFDFB" };
export const FONTS = { SERIF, SANS, HAND, JP };
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";

// ---------- azar determinista (hash entero)
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;

// ---------- Ken Burns sorteado por plano (sentido, velocidad, foco y ángulo)
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = (hash(seed) % 2) === 1;
  const sec = dur / 30;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.018 + r01(seed, 1) * 0.022;
  const amp = Math.min(clip ? 0.08 : 0.2, rate * sec);
  const zBase = 1.06;
  const t = Easing.inOut(Easing.sin)(Math.min(1, Math.max(0, f / Math.max(1, dur))));
  const k = out ? 1 - t : t;
  const z = zBase + amp * k;
  const ox = 35 + r01(seed, 2) * 30, oy = 35 + r01(seed, 3) * 30;
  const ang = r01(seed, 4) * Math.PI * 2;
  const tx = Math.cos(ang) * 2 * k, ty = Math.sin(ang) * 1.2 * k;
  return { transform: `translate(${tx}%, ${ty}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` } as React.CSSProperties;
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 58%, rgba(30,14,20,0.28) 100%)" }} />
);

export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const kb = useKB(seed, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

// ---------- utilidades de animación
export const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
export const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], CL); };

// tarjeta perla del mostrador: papel liso, doble filete dorado
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: `linear-gradient(170deg, ${C.white} 0%, ${C.paper} 55%, ${C.paper2} 100%)`, position: "relative", borderRadius: 3,
    boxShadow: `0 18px 50px rgba(0,0,0,0.38), inset 0 0 0 2px ${C.gold}, inset 0 0 0 8px ${C.paper}, inset 0 0 0 9px rgba(183,154,91,0.55)`, ...style }}>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// sello redondo rojo camelia (como la tapa de un labial) con el número en kanji
export const KANJI = ["", "一", "二", "三", "四"];
export const Seal: React.FC<{ text: string; size?: number; delay?: number }> = ({ text, size = 92, delay = 0 }) => {
  const p = useIn(delay, 12);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #D2414C 0%, ${C.ver} 55%, #8E1722 100%)`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: JP, fontWeight: 700, fontSize: size * 0.5, transform: `scale(${interpolate(p, [0, 1], [1.7, 1])})`, opacity: p, boxShadow: `0 6px 16px rgba(0,0,0,0.35), inset 0 0 0 ${Math.max(2, size * 0.03)}px rgba(255,253,251,0.55)` }}>{text}</div>
  );
};

// ---------- texto cinético palabra por palabra (solo en golpes)
export const Kinetic: React.FC<{ lines: string[]; accent?: number; dur: number }> = ({ lines, accent = -1, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 9);
  let idx = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440, background: "linear-gradient(0deg, rgba(24,10,16,0.6), rgba(24,10,16,0))" }} />
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600, position: "relative" }}>
          {ln.split(" ").map((w, wi) => {
            const d = (idx++) * 4 + li * 6;
            const p = spring({ frame: f - d, fps: 30, config: { damping: 16, mass: 0.6 } });
            const acc = li === accent;
            return (
              <span key={wi} style={{ fontFamily: SERIF, fontStyle: acc ? "normal" : "italic", fontWeight: acc ? 600 : 400, fontSize: acc ? 116 : 72, lineHeight: 1.1, color: acc ? C.white : "#F6E6E1",
                textShadow: shadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`, filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)` }}>{w}</span>
            );
          })}
        </div>
      ))}
      <div style={{ height: 3, width: 220 * interpolate(f, [10, 28], [0, 1], CL), background: C.ver, marginTop: 20, position: "relative" }} />
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const w = interpolate(f, [0, 18], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 110, bottom: 120, clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
        <Card style={{ padding: "22px 44px 20px 40px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 62, color: C.ink, lineHeight: 1.05 }}>{title}</div>
          <div style={{ height: 2, background: C.ver, width: 90, margin: "10px 0 10px" }} />
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 5, color: C.plum, textTransform: "uppercase" }}>{sub}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// rótulo de lugar: punto rojo + nombre + japonés
export const Place: React.FC<{ text: string; jp?: string; dur: number }> = ({ text, jp, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 100, top: 90, display: "flex", alignItems: "center", gap: 20, transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`, opacity: p }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.ver, boxShadow: "0 0 0 6px rgba(255,253,251,0.35), 0 2px 10px rgba(0,0,0,0.5)" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, color: C.white, textShadow: shadow }}>{text}</div>
        {jp ? <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 44, color: C.blush, textShadow: shadow, marginLeft: 4 }}>{jp}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// etiqueta de precio del mostrador (abajo a la derecha)
export const Tag: React.FC<{ text: string; dur: number; left?: boolean }> = ({ text, dur, left }) => {
  const p = useIn(0, 16), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", ...(left ? { left: 110 } : { right: 110 }), bottom: 120, transform: `translateX(${interpolate(p, [0, 1], [left ? -500 : 500, 0])}px)` }}>
        <Card style={{ padding: "18px 34px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: C.ink, display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 14, height: 14, borderRadius: "50%", background: C.ver, display: "inline-block" }} />{text}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const Quote: React.FC<{ text: string; who?: string; dur: number }> = ({ text, who, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const chars = Math.round(interpolate(f, [4, 4 + text.length * 1.1], [0, text.length], CL));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100, opacity: o }}>
      <Card style={{ padding: "28px 54px 24px", maxWidth: 1500 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 60, color: C.ink }}>
          {text.slice(0, chars)}<span style={{ opacity: 0 }}>{text.slice(chars)}</span>
        </div>
        {who ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: 5, color: C.ver, textTransform: "uppercase", marginTop: 8 }}>{who}</div> : null}
      </Card>
    </AbsoluteFill>
  );
};

// reloj de tocador (latón): las agujas giran hasta la hora
export const Clock: React.FC<{ h: number; m: number; label: string; dur: number }> = ({ h, m, label, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [6, 40], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const mDeg = (m / 60) * 360 + (1 - t) * -720, hDeg = ((h % 12) / 12) * 360 + (m / 60) * 30 + (1 - t) * -60;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 150, top: 140, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <svg width="300" height="300" viewBox="-110 -110 220 220" style={{ filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.45))" }}>
          <circle r="106" fill={C.gold} />
          <circle r="96" fill={C.paper} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1="0" y1="-86" x2="0" y2={i % 3 === 0 ? -70 : -79} stroke={C.ink} strokeWidth={i % 3 === 0 ? 4 : 2} transform={`rotate(${i * 30})`} />)}
          <line x1="0" y1="10" x2="0" y2="-48" stroke={C.ink} strokeWidth="7" strokeLinecap="round" transform={`rotate(${hDeg})`} />
          <line x1="0" y1="14" x2="0" y2="-74" stroke={C.ver} strokeWidth="4" strokeLinecap="round" transform={`rotate(${mDeg})`} />
          <circle r="6" fill={C.ver} />
        </svg>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 62, color: C.white, textShadow: shadow }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// ficha con fuente real (autor, año)
export const Stat: React.FC<{ title: string; lines: string[]; foot: string; dur: number }> = ({ title, lines, foot, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 110, top: 150, width: 760, transform: `translateX(${interpolate(p, [0, 1], [-860, 0])}px)` }}>
        <Card style={{ padding: "42px 52px 38px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 7, color: C.ver }}>THE STUDY</div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, lineHeight: 1.08, color: C.ink, margin: "12px 0 20px" }}>{title}</div>
          {lines.map((l, i) => { const q = spring({ frame: f - 10 - i * 8, fps: 30, config: { damping: 18 } }); return <div key={i} style={{ fontFamily: SANS, fontWeight: 400, fontSize: 34, color: C.ink, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, marginBottom: 6 }}>{l}</div>; })}
          <div style={{ height: 2, background: C.gold, margin: "22px 0 16px", opacity: 0.8 }} />
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 40, color: C.plum }}>{foot}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// palabra japonesa grande + traducción (centro)
export const Greet: React.FC<{ jp: string; ro?: string; en: string; dur: number; low?: boolean }> = ({ jp, ro, en, dur, low }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const chars = [...jp];
  return (
    <AbsoluteFill style={{ justifyContent: low ? "flex-end" : "center", alignItems: "center", opacity: o, paddingBottom: low ? 110 : 0 }}>
      <div style={{ position: "absolute", inset: 0, background: low ? "linear-gradient(0deg, rgba(24,10,16,0.62), rgba(24,10,16,0) 55%)" : "radial-gradient(ellipse at center, rgba(24,10,16,0.55), rgba(24,10,16,0) 70%)" }} />
      <div style={{ display: "flex", gap: 6, position: "relative" }}>
        {chars.map((c, i) => { const q = spring({ frame: f - i * 2, fps: 30, config: { damping: 15 } }); return <span key={i} style={{ fontFamily: JP, fontWeight: 700, fontSize: low ? 100 : 128, color: C.white, textShadow: shadow, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}>{c}</span>; })}
      </div>
      {ro ? <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 10, color: C.blush, textShadow: shadow, textTransform: "uppercase", marginTop: 4, position: "relative", opacity: interpolate(f, [10, 22], [0, 1], CL) }}>{ro}</div> : null}
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 60, color: "#FBEDE8", textShadow: shadow, position: "relative", marginTop: 6, opacity: interpolate(f, [18, 30], [0, 1], CL) }}>{en}</div>
    </AbsoluteFill>
  );
};

// anillo de segundos (30 s de toalla, 3 s de presión, 60 s de masaje): se llena mientras cuenta
export const Ring: React.FC<{ secs: number; label: string; dur: number; left?: boolean }> = ({ secs, label, dur, left }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [6, Math.max(20, dur - 14)], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const R = 118, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", ...(left ? { left: 140 } : { right: 140 }), top: 130, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="300" height="300" viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.5))" }}>
          <circle r={R + 18} fill="rgba(42,32,37,0.55)" />
          <circle r={R} fill="none" stroke="rgba(255,253,251,0.28)" strokeWidth="10" />
          <circle r={R} fill="none" stroke={C.blush} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${L * t} ${L}`} transform="rotate(-90)" />
          <text y="30" textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 112, fill: C.white }}>{Math.max(1, Math.round(secs * t))}</text>
          <text y="78" textAnchor="middle" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 6, fill: C.blush }}>SEC</text>
        </svg>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 50, color: C.white, textShadow: shadow, marginTop: 12 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// gotas de aceite que se cuentan (3 gotas / 1 gota)
export const Drops: React.FC<{ n: number; label: string; marks?: number[]; dur: number }> = ({ n, label, marks, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 120, bottom: 120, display: "flex", alignItems: "flex-end", gap: 34 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-end", height: 130 }}>
          {Array.from({ length: n }, (_, i) => {
            const q = spring({ frame: f - (marks?.[i] ?? 4 + i * 9), fps: 30, config: { damping: 10, mass: 0.6 } });
            return <div key={i} style={{ width: 64, height: 86, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", clipPath: "polygon(50% 0%, 86% 46%, 100% 70%, 86% 92%, 50% 100%, 14% 92%, 0% 70%, 14% 46%)",
              background: "radial-gradient(circle at 36% 62%, #FFE9A8 0%, #E9B93F 45%, #B67F14 100%)", opacity: q, transform: `translateY(${(1 - q) * -160}px) scale(${0.6 + 0.4 * q})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))" }} />;
          })}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 96, lineHeight: 1, color: C.white, textShadow: shadow, opacity: interpolate(f, [8, 20], [0, 1], CL) }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

// tres capas finas que se apilan (loción)
export const Layers: React.FC<{ marks: number[]; labels: string[]; dur: number }> = ({ marks, labels, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 120, top: 150, width: 560, opacity: p }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 70, color: C.white, textShadow: shadow, marginBottom: 20 }}>Three thin layers</div>
        {labels.map((l, i) => {
          const q = spring({ frame: f - marks[i], fps: 30, config: { damping: 14, mass: 0.7 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 14, opacity: q, transform: `translateY(${(1 - q) * -50}px)` }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.ver, color: C.white, fontFamily: SERIF, fontWeight: 600, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>{i + 1}</div>
              <div style={{ flex: 1, padding: "14px 24px", background: `rgba(255,253,251,${0.78 + i * 0.08})`, borderRadius: 3, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.ink, boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }}>{l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// precio que cuenta (¥30,000 → $200 / $10 · 4 meses)
export const Price: React.FC<{ big: string; sub: string; to?: number; prefix?: string; dur: number; left?: boolean }> = ({ big, sub, to, prefix = "", dur, left }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const v = to ? Math.round(interpolate(f, [4, 34], [0, to], { ...CL, easing: Easing.out(Easing.cubic) })) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", ...(left ? { left: 120 } : { right: 120 }), bottom: 120, transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`, opacity: p }}>
        <Card style={{ padding: "26px 46px 24px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 110, lineHeight: 1, color: C.ink }}>{to ? prefix + v.toLocaleString("en-US") : big}</div>
          <div style={{ height: 2, background: C.ver, width: 80, margin: "12px 0 10px" }} />
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 4, color: C.plum, textTransform: "uppercase" }}>{sub}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// palabras que se van sumando en fila (frente · nariz · mejillas · mentón)
export const Chips: React.FC<{ items: string[]; marks: number[]; dur: number; left?: boolean }> = ({ items, marks, dur, left }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", ...(left ? { left: 70, width: 820 } : { left: 0, right: 0 }), bottom: 90, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        {items.map((it, i) => {
          const q = spring({ frame: f - marks[i], fps: 30, config: { damping: 13, mass: 0.6 } });
          return <div key={i} style={{ padding: "12px 30px", background: C.paper, borderRadius: 40, boxShadow: `0 8px 20px rgba(0,0,0,0.4), inset 0 0 0 2px ${C.gold}`, fontFamily: SERIF, fontWeight: 500, fontSize: 46, color: C.ink, opacity: q, transform: `translateY(${(1 - q) * 40}px) scale(${0.8 + 0.2 * q})` }}>{it}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// dirección del masaje: de dónde a dónde, ×10
export const Stroke: React.FC<{ a: string; b: string; times?: string; dur: number }> = ({ a, b, times, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 9);
  const w = interpolate(f, [6, 26], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 110, bottom: 110, display: "flex", alignItems: "center", gap: 22, opacity: p }}>
        <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: C.white, textShadow: shadow }}>{a}</span>
        <div style={{ width: 150 * w, height: 4, background: C.blush, position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", right: -4, top: -9, width: 22, height: 22, borderTop: `4px solid ${C.blush}`, borderRight: `4px solid ${C.blush}`, transform: "rotate(45deg)" }} />
        </div>
        <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: C.white, textShadow: shadow, opacity: w, marginLeft: 8 }}>{b}</span>
        {times ? <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink, background: C.blush, borderRadius: 30, padding: "4px 20px", marginLeft: 14, opacity: interpolate(f, [22, 32], [0, 1], CL) }}>{times}</span> : null}
      </div>
    </AbsoluteFill>
  );
};
