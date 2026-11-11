// Piezas de ck11b — look "recetario de la iglesia" (red Loretta, canal 242): papel crema, tinta marrón, vino y dorado; DM Serif + Inter + Caveat.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
const JP = SERIF;

export const C = { paper: "#F6EAD2", paper2: "#E9D6B2", ink: "#2A1A0E", ver: "#8E1D2B", indigo: "#5A3E24", gold: "#C9973F", white: "#FFF8EA", rose: "#E3B25C" };
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

export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number; start?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75, start = 0 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} startFrom={Math.round(start * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
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
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "57% 28%" }} />
    </AbsoluteFill>
  );
};

// ---------- utilidades de animación
const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); };
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";

// hoja de libreta: papel crema con renglones azules, margen rojo y agujeros de espiral (sin imágenes)
export const Washi: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: `radial-gradient(120% 90% at 30% 15%, #FBF3E2 0%, ${C.paper} 55%, ${C.paper2} 100%)`, position: "relative", overflow: "hidden", borderRadius: 6, boxShadow: "0 1px 0 rgba(255,255,255,.6) inset, 0 3px 6px rgba(0,0,0,.25), 0 22px 50px rgba(0,0,0,.4)", ...style }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 41px, rgba(90,62,36,0.16) 41px 42.5px)" }} />
    <div style={{ position: "absolute", inset: 12, border: "1.5px solid rgba(90,62,36,0.45)", borderRadius: 3 }} />
    <div style={{ position: "absolute", inset: 17, border: "0.8px solid rgba(90,62,36,0.3)", borderRadius: 2 }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// chapita de latón (la del collar): disco con agujero arriba y número grabado
const Hanko: React.FC<{ text: string; size?: number; delay?: number }> = ({ text, size = 92, delay = 0 }) => {
  const p = useIn(delay, 12);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #A8343F 0%, #8E1D2B 60%, #5E0F1A 100%)", boxShadow: "0 3px 8px rgba(0,0,0,0.35), inset 0 0 0 4px rgba(243,214,160,0.55)", color: "#F8DDA4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      fontFamily: SERIF, fontWeight: 700, fontSize: size * 0.5, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${interpolate(p, [0, 1], [-28, -6])}deg)`, opacity: p }}>
      <div style={{ position: "absolute", top: size * 0.07, left: "50%", marginLeft: -size * 0.055, width: size * 0.11, height: size * 0.11, borderRadius: "50%", background: "rgba(31,26,20,0.75)" }} />
      <span style={{ marginTop: size * 0.1, textShadow: "0 1px 0 rgba(0,0,0,0.35)" }}>{text}</span>
    </div>
  );
};

const KANJI = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// ---------- tarjeta de hábito: panel de papel que entra de la izquierda + número kanji sellado
export const HabitCard: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const p = useIn(0, 20), o = useOut(dur, 12);
  const line = interpolate(f, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 760, background: "linear-gradient(90deg, rgba(20,14,8,0.55), rgba(20,14,8,0))" }} />
      <Washi style={{ position: "absolute", left: 90, top: 300, width: 600, padding: "44px 52px 46px", transform: `translateX(${interpolate(p, [0, 1], [-720, 0])}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Hanko text={KANJI[n]} delay={9} />
          <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 6, fontSize: 24, color: C.ver }}>NO. {String(n).padStart(2, "0")} / 05</div>
        </div>
        <div style={{ height: 3, background: C.ink, width: `${line * 100}%`, margin: "26px 0 22px", opacity: 0.8 }} />
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 70, lineHeight: 1.02, color: C.ink }}>{title}</div>
      </Washi>
    </AbsoluteFill>
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
      <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "center", gap: 18, background: "rgba(20,16,12,0.58)", padding: "10px 26px 10px 20px", borderRadius: 8, transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)`, opacity: p }}>
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

// hara hachi bu: cuenco que se llena hasta 80 % y anillo
export const Gauge: React.FC<{ pct: number; jp: string; label: string; dur: number }> = ({ pct, jp, label, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [8, 48], [0, pct / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const R = 120, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", right: 120, top: 170, width: 480, padding: "38px 30px 34px", borderRadius: 6, transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`, opacity: p }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="300" height="300" viewBox="-150 -150 300 300">
            <circle r={R} fill="none" stroke="rgba(35,31,28,0.12)" strokeWidth="22" />
            <circle r={R} fill="none" stroke={C.ver} strokeWidth="22" strokeLinecap="round" strokeDasharray={`${L * t} ${L}`} transform="rotate(-90)" />
            <text y="28" textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, fill: C.ink }}>{Math.round(t * 100)}%</text>
          </svg>
          <div style={{ fontFamily: JP, fontWeight: 700, fontSize: 56, color: C.ink, marginTop: 8, letterSpacing: 6 }}>{jp}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 4, color: C.ver, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
        </div>
      </Washi>
    </AbsoluteFill>
  );
};

export const Counter: React.FC<{ to: number; suffix: string; label: string; dur: number }> = ({ to, suffix, label, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const v = Math.round(interpolate(f, [4, 40], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 120, bottom: 120, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, opacity: p }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 170, lineHeight: 0.9, color: C.white, textShadow: shadow }}>{v.toLocaleString("en-US")}<span style={{ fontSize: 70, marginLeft: 14 }}>{suffix}</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#F0E3CE", textShadow: shadow, marginTop: 10 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Stat: React.FC<{ head?: string; title: string; lines: string[]; foot: string; dur: number }> = ({ head = "THE NUMBER", title, lines, foot, dur }) => {
  const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 110, top: 160, width: 680, padding: "40px 48px", transform: `translateX(${interpolate(p, [0, 1], [-760, 0])}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: C.ver }}>{head}</div>
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

export const Thermo: React.FC<{ deg: number; label: string; sub: string; subAt: number; dur: number }> = ({ deg, label, sub, subAt, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 16), o = useOut(dur, 10);
  const t = interpolate(f, [6, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const v = Math.round(20 + (deg - 20) * t);
  const s = interpolate(f, [subAt, subAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 170, top: 130, display: "flex", alignItems: "center", gap: 34, opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
        <svg width="110" height="460" viewBox="0 0 110 460" style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" }}>
          <rect x="35" y="10" width="40" height="370" rx="20" fill={C.paper} stroke={C.ink} strokeWidth="4" />
          <circle cx="55" cy="400" r="46" fill={C.ver} stroke={C.ink} strokeWidth="4" />
          <rect x="45" y={370 - 340 * (0.15 + 0.85 * t * 0.8)} width="20" height={340 * (0.15 + 0.85 * t * 0.8) + 10} fill={C.ver} />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1="75" x2="92" y1={60 + i * 55} y2={60 + i * 55} stroke={C.ink} strokeWidth="3" />)}
        </svg>
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 160, lineHeight: 0.9, color: C.white, textShadow: shadow }}>{v}°C</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#F2E6D3", textShadow: shadow }}>{label}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#FFE7C9", textShadow: shadow, marginTop: 16, opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// rueda de estaciones: 春夏秋冬, el sector activo se pinta
export const Seasons: React.FC<{ marks: number[]; items: string[]; dur: number }> = ({ marks, items, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 12);
  const act = marks.reduce((a, m, i) => (f >= m ? i : a), 0);
  const rot = interpolate(f, marks.concat([dur]), marks.map((_, i) => -i * 90).concat([-270 - 8]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const KJ = ["春", "夏", "秋", "冬"], EN = ["SPRING", "SUMMER", "AUTUMN", "WINTER"], COL = ["#C98A9A", "#5E8C57", "#C0702E", "#4E6E8E"];
  const sec = (i: number) => { const a0 = (i * 90 - 135) * Math.PI / 180, a1 = ((i + 1) * 90 - 135) * Math.PI / 180, R = 150; return `M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`; };
  const q = spring({ frame: f - marks[act], fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 110, top: 110, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
        <svg width="360" height="360" viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.45))" }}>
          <circle r="166" fill={C.paper} />
          <g transform={`rotate(${rot})`}>
            {KJ.map((k, i) => {
              const mid = (i * 90 - 90) * Math.PI / 180;
              return (
                <g key={i}>
                  <path d={sec(i)} fill={i === act ? COL[i] : "rgba(35,31,28,0.06)"} stroke={C.paper} strokeWidth="6" />
                  <text x={98 * Math.cos(mid)} y={98 * Math.sin(mid) + 22} textAnchor="middle" transform={`rotate(${-rot} ${98 * Math.cos(mid)} ${98 * Math.sin(mid)})`}
                    style={{ fontFamily: JP, fontWeight: 700, fontSize: 62, fill: i === act ? C.white : "rgba(35,31,28,0.55)" }}>{k}</text>
                </g>
              );
            })}
          </g>
          <circle r="30" fill={C.ink} />
          <path d="M0 -176 L-14 -150 L14 -150 Z" fill={C.ver} />
        </svg>
        <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 8, fontSize: 28, color: C.white, textShadow: shadow, marginTop: 16 }}>{EN[act]}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: "#FFF6E6", textShadow: shadow, marginTop: 4, opacity: q, maxWidth: 520, textAlign: "center" }}>{items[act]}</div>
      </div>
    </AbsoluteFill>
  );
};

// carta manuscrita: líneas que se escriben solas
export const Letter: React.FC<{ lines: string[]; at2: number; dur: number }> = ({ lines, at2, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  const starts = [4, at2];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 560, right: 560, bottom: 100, padding: "30px 46px 26px", transform: `translateY(${(1 - p) * 120}px) rotate(1deg)`,
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 63px, rgba(44,71,102,0.25) 63px 65px)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 500, fontSize: 30, color: C.indigo, opacity: 0.8 }}>Dear sister,</div>
        {lines.map((l, i) => {
          const n = Math.round(interpolate(f, [starts[i], starts[i] + l.length * 1.3], [0, l.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: C.indigo }}>{l.slice(0, n)}<span style={{ opacity: 0 }}>{l.slice(n)}</span></div>;
        })}
      </Washi>
    </AbsoluteFill>
  );
};

// temporizador de cocina: dial que marca 20 y luego hace tic
export const Timer: React.FC<{ min: number; tickAt: number; label?: string; dur: number }> = ({ min, tickAt, label, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 14), o = useOut(dur, 10);
  const set = interpolate(f, [4, 30], [0, min], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const ticks = f > tickAt ? Math.floor((f - tickAt) / 12.6) : 0;
  const val = set - Math.min(3, ticks) * 0.25;
  const wob = f > tickAt && (f - tickAt) % 12.6 < 3 ? 1.5 : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", right: 170, top: 160, opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${wob}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="320" height="320" viewBox="-120 -120 240 240" style={{ filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.45))" }}>
          <circle r="112" fill="#F7F3EC" stroke="#D9D2C6" strokeWidth="8" />
          <g transform={`rotate(${-(val / 60) * 360})`}>
            {Array.from({ length: 60 }, (_, i) => <line key={i} x1="0" y1="-98" x2="0" y2={i % 5 === 0 ? -80 : -90} stroke={C.ink} strokeWidth={i % 5 === 0 ? 3 : 1.5} transform={`rotate(${i * 6})`} />)}
            {Array.from({ length: 12 }, (_, i) => <text key={i} x={64 * Math.sin(i * Math.PI / 6)} y={-64 * Math.cos(i * Math.PI / 6) + 9} textAnchor="middle" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, fill: i === 4 ? C.ver : C.ink }}>{i * 5}</text>)}
          </g>
          <path d="M0 -118 L-10 -100 L10 -100 Z" fill={C.ver} />
          <circle r="22" fill={C.ver} />
        </svg>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: C.white, textShadow: shadow, marginTop: 10 }}>{label || `${min} minutes`}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Greet: React.FC<{ jp: string; en: string; dur: number }> = ({ jp, en, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const chars = [...jp];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(10,6,3,0.5), rgba(10,6,3,0) 70%)" }} />
      <div style={{ display: "flex", gap: 4 }}>
        {chars.map((c, i) => { const q = spring({ frame: f - i * 2, fps: 30, config: { damping: 15 } }); return <span key={i} style={{ fontFamily: JP, fontWeight: 700, fontSize: 120, color: C.white, textShadow: shadow, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}>{c}</span>; })}
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: "#F6E8D2", textShadow: shadow, opacity: interpolate(f, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>“{en}.”</div>
    </AbsoluteFill>
  );
};

export const Three: React.FC<{ head?: string; items: string[]; marks: number[]; dur: number }> = ({ head = "", items, marks, dur }) => {
  const big = items.length > 4 || items.some((x) => x.length > 22); const W = big ? 720 : 600, FS = big ? 36 : 44;
  const f = useCurrentFrame(); const p = useIn(0, 18), o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Washi style={{ position: "absolute", left: 110, top: big ? 150 : 200, width: W, padding: "34px 44px", transform: `translateX(${(1 - p) * -700}px) rotate(-1deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 6, fontSize: 22, color: C.ver, marginBottom: 14 }}>{head}</div>
        {items.map((it, i) => {
          const n = Math.round(interpolate(f, [marks[i], marks[i] + it.length * 1.1], [0, it.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const q = spring({ frame: f - marks[i], fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 8 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: C.ver, opacity: q, transform: `scale(${0.6 + 0.4 * q})` }}>{i + 1}.</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: FS, color: C.indigo }}>{it.slice(0, n)}</span>
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

export const Shopping: React.FC<{ items: { txt: string; f: number }[]; bg: string; dur: number }> = ({ items, bg, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  return (
    <AbsoluteFill>
      <Photo src={bg} seed={5252} dur={dur} />
      <AbsoluteFill style={{ background: "rgba(20,12,6,0.45)" }} />
      <Washi style={{ position: "absolute", left: 610, top: 120, width: 700, height: 840, padding: "50px 60px", transform: `translateY(${(1 - p) * 900}px) rotate(-1.5deg)`,
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 89px, rgba(44,71,102,0.22) 89px 91px)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 8, fontSize: 24, color: C.ver }}>ONLY FOR TODAY</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: C.ink, margin: "6px 0 30px" }}>Market list</div>
        {items.map((it, i) => {
          const n = Math.round(interpolate(f, [it.f, it.f + it.txt.length * 1.0], [0, it.txt.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const on = interpolate(f, [it.f + 14, it.f + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 91 }}>
              <Checkbox on={on} />
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.indigo }}>{it.txt.slice(0, n)}</span>
            </div>
          );
        })}
      </Washi>
    </AbsoluteFill>
  );
};

export const Recap: React.FC<{ items: { txt: string; f: number }[]; bg: string; dur: number }> = ({ items, bg, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  return (
    <AbsoluteFill>
      <Photo src={bg} seed={7171} dur={dur} />
      <AbsoluteFill style={{ background: "rgba(20,12,6,0.5)" }} />
      <Washi style={{ position: "absolute", left: 260, right: 260, top: 90, bottom: 90, padding: "48px 70px", transform: `scale(${0.92 + 0.08 * p})`, opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 26 }}>
          <Hanko text="5" size={86} delay={6} />
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 74, color: C.ink }}>My five breeds</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 70, rowGap: 14 }}>
          {items.map((it, i) => {
            const on = interpolate(f, [it.f, it.f + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const lit = f >= it.f;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: lit ? 1 : 0.35 }}>
                <Checkbox on={on} />
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.ink }}><span style={{ color: C.ver, marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{it.txt}</span>
              </div>
            );
          })}
        </div>
      </Washi>
    </AbsoluteFill>
  );
};
