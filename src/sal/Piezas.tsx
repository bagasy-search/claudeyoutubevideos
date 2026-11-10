// Piezas del video sal01 — look "zapatería de barrio": cartón kraft de caja de zapatos, cuero oscuro, rojo del almohadón del banco, bronce del medidor.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["500", "700"], subsets: ["latin"] });
const JP = SERIF;

export const C = { paper: "#F2E6CF", paper2: "#D6BC94", ink: "#2A1C14", ver: "#A3322A", indigo: "#24394A", gold: "#C8963E", white: "#FFF8EC" };
export const FONTS = { SERIF, SANS, HAND, JP };

// ---------- azar determinista (hash entero)
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;

// ---------- Ken Burns aleatorio de verdad (sentido, velocidad, foco y ángulo sorteados por plano)
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = (hash(seed) % 2) === 1;
  const sec = dur / 30;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.018 + r01(seed, 1) * 0.022; // %/s
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
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,12,6,0.32) 100%)" }} />
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

export const AvatarClip: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  // push lento, siempre (nunca quieto), sentido sorteado
  const inn = hash(seed + 99) % 3 !== 0;
  const t = f / Math.max(1, dur);
  const z = inn ? 1.03 + 0.05 * t : 1.08 - 0.05 * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "50% 38%" }} />
    </AbsoluteFill>
  );
};

// ---------- utilidades de animación
const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); };
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";

// cartón kraft de caja de zapatos (fibras con gradientes, sin imágenes)
export const Washi: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: `linear-gradient(180deg, ${C.paper} 0%, ${C.paper2} 100%)`, position: "relative", overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.35)", ...style }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "repeating-linear-gradient(97deg, rgba(110,70,30,0.08) 0 1px, transparent 1px 5px), repeating-linear-gradient(8deg, rgba(110,70,30,0.06) 0 1px, transparent 1px 13px)" }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// sello: etiqueta ovalada de talle, como las de las cajas
export const Hanko: React.FC<{ text: string; size?: number; delay?: number }> = ({ text, size = 92, delay = 0 }) => {
  const p = useIn(delay, 12);
  return (
    <div style={{ width: size * 1.25, height: size, borderRadius: "50%", border: `4px solid ${C.ver}`, color: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: SERIF, fontWeight: 700, fontSize: size * 0.5, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(-6deg)`, opacity: p, background: "rgba(163,50,42,0.06)" }}>{text}</div>
  );
};




// ---------- texto cinético palabra por palabra (solo en golpes)
export const Kinetic: React.FC<{ lines: string[]; accent?: number; dur: number }> = ({ lines, accent = -1, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 9);
  let idx = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "linear-gradient(0deg, rgba(10,6,3,0.55), rgba(10,6,3,0))" }} />
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
          {ln.split(" ").map((w, wi) => {
            const d = (idx++) * 4 + li * 6;
            const p = spring({ frame: f - d, fps: 30, config: { damping: 16, mass: 0.6 } });
            const acc = li === accent;
            return (
              <span key={wi} style={{ fontFamily: SERIF, fontWeight: acc ? 700 : 600, fontSize: acc ? 118 : 74, lineHeight: 1.08, color: acc ? C.white : "#F3E9D8",
                textShadow: shadow, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`, filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)`,
                borderBottom: acc && wi === ln.split(" ").length - 1 ? `6px solid ${C.ver}` : undefined }}>{w}</span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const w = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 110, bottom: 130, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 6, height: 110 * w, background: C.ver }} />
        <div style={{ clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 66, color: C.white, textShadow: shadow }}>{title}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 5, color: "#EFE4D2", textShadow: shadow, textTransform: "uppercase" }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Place: React.FC<{ text: string; jp?: string; dur: number }> = ({ text, jp, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 100, top: 90, display: "flex", alignItems: "center", gap: 18, transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`, opacity: p }}>
        <svg width="34" height="44" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0z" fill={C.ver} /><circle cx="12" cy="11.5" r="4.5" fill={C.paper} /></svg>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: C.white, textShadow: shadow }}>{text}</div>
        {jp ? <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 40, color: "#F1E2C9", textShadow: shadow, marginLeft: 6 }}>{jp}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export const Tag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const p = useIn(0, 16), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", right: 110, bottom: 120, padding: "18px 30px", transform: `translateX(${interpolate(p, [0, 1], [500, 0])}px) rotate(-1.2deg)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.ink }}><span style={{ color: C.ver, marginRight: 12 }}>●</span>{text}</div>
      </Washi>
    </AbsoluteFill>
  );
};

export const Quote: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const chars = Math.round(interpolate(f, [4, 4 + text.length * 1.1], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: o }}>
      <Washi style={{ padding: "26px 48px", maxWidth: 1500 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 62, color: C.ink }}>
          {text.slice(0, chars)}<span style={{ opacity: 0 }}>{text.slice(chars)}</span>
        </div>
      </Washi>
    </AbsoluteFill>
  );
};

// reloj analógico de tinta: las agujas giran hasta la hora
export const Clock: React.FC<{ h: number; m: number; label: string; night?: boolean; dur: number }> = ({ h, m, label, night, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [6, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const mDeg = (m / 60) * 360 + (1 - t) * -720, hDeg = ((h % 12) / 12) * 360 + (m / 60) * 30 + (1 - t) * -60;
  const face = night ? C.indigo : C.paper, ink = night ? C.paper : C.ink;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 150, top: 150, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <svg width="300" height="300" viewBox="-110 -110 220 220" style={{ filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.45))" }}>
          <circle r="104" fill={face} stroke={night ? C.gold : C.ink} strokeWidth="5" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1="0" y1="-92" x2="0" y2={i % 3 === 0 ? -76 : -84} stroke={ink} strokeWidth={i % 3 === 0 ? 5 : 2.5} transform={`rotate(${i * 30})`} />)}
          <line x1="0" y1="10" x2="0" y2="-52" stroke={ink} strokeWidth="8" strokeLinecap="round" transform={`rotate(${hDeg})`} />
          <line x1="0" y1="14" x2="0" y2="-80" stroke={C.ver} strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${mDeg})`} />
          <circle r="7" fill={C.ver} />
        </svg>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.white, textShadow: shadow }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};


export const Counter: React.FC<{ to: number; prefix?: string; suffix: string; label: string; dur: number }> = ({ to, prefix = "", suffix, label, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const v = Math.round(interpolate(f, [4, 40], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 120, bottom: 120, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, opacity: p }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 170, lineHeight: 0.9, color: C.white, textShadow: shadow }}>{prefix}{v}<span style={{ fontSize: 70, marginLeft: 14 }}>{suffix}</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#F0E3CE", textShadow: shadow, marginTop: 10 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Stat: React.FC<{ title: string; lines: string[]; foot: string; dur: number }> = ({ title, lines, foot, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 110, top: 160, width: 680, padding: "40px 48px", transform: `translateX(${interpolate(p, [0, 1], [-760, 0])}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: C.ver }}>THE RESEARCH</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.ink, margin: "10px 0 18px" }}>{title}</div>
        {lines.map((l, i) => { const q = useIn(10 + i * 8, 18); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: C.ink, opacity: q, transform: `translateX(${(1 - q) * 30}px)`, marginBottom: 6 }}>— {l}</div>; })}
        <div style={{ height: 2, background: "rgba(35,31,28,0.3)", margin: "20px 0 14px" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.indigo }}>{foot}</div>
      </Washi>
    </AbsoluteFill>
  );
};

export const Route: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const t1 = interpolate(f, [4, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const t2 = interpolate(f, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 460, right: 460, bottom: 110, padding: "26px 40px" }}>
        <svg width="100%" height="120" viewBox="0 0 1000 120">
          <circle cx="40" cy="60" r="16" fill={C.ink} /><circle cx="960" cy="60" r="16" fill={C.ver} />
          <text x="40" y="112" textAnchor="middle" style={{ fontFamily: SANS, fontSize: 22, fontWeight: 600, fill: C.ink }}>HOME</text>
          <text x="960" y="112" textAnchor="middle" style={{ fontFamily: SANS, fontSize: 22, fontWeight: 600, fill: C.ver }}>MARKET</text>
          <line x1="60" y1="44" x2={60 + 880 * t1} y2="44" stroke={C.ink} strokeWidth="5" strokeDasharray="14 10" />
          <line x1="940" y1="76" x2={940 - 880 * t2} y2="76" stroke={C.ver} strokeWidth="5" strokeDasharray="14 10" />
          <text x="500" y="30" textAnchor="middle" style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, fill: C.ink, opacity: t1 }}>{a} →</text>
          <text x="500" y="112" textAnchor="middle" style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, fill: C.ver, opacity: t2 }}>← {b}</text>
        </svg>
      </Washi>
    </AbsoluteFill>
  );
};






export const Three: React.FC<{ items: string[]; marks: number[]; head?: string; dur: number }> = ({ items, marks, head = "", dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 110, top: 200, width: 640, padding: "34px 44px", transform: `translateX(${(1 - p) * -700}px) rotate(-1deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 6, fontSize: 22, color: C.ver, marginBottom: 14 }}>{head}</div>
        {items.map((it, i) => {
          const n = Math.round(interpolate(f, [marks[i], marks[i] + it.length * 1.1], [0, it.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const q = spring({ frame: f - marks[i], fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 8 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: C.ver, opacity: q, transform: `scale(${0.6 + 0.4 * q})` }}>{i + 1}.</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: C.indigo }}>{it.slice(0, n)}</span>
            </div>
          );
        })}
      </Washi>
    </AbsoluteFill>
  );
};

export const Soft: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const p = useIn(0, 20), o = useOut(dur, 12);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, opacity: o * p }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: C.white, textShadow: shadow, borderBottom: `4px solid ${C.ver}`, paddingBottom: 8 }}>{text}</div>
    </AbsoluteFill>
  );
};

// ---------- pantallas completas (C)
const Checkbox: React.FC<{ on: number }> = ({ on }) => (
  <svg width="54" height="54" viewBox="0 0 54 54">
    <rect x="4" y="4" width="46" height="46" rx="6" fill="none" stroke={C.ink} strokeWidth="4" />
    <path d="M13 28 L23 38 L42 15" fill="none" stroke={C.ver} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - on)} />
  </svg>
);


