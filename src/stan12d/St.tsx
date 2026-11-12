// Kit de Stan the Butcher · look "papel de carnicero y pizarra de precios". PURO CSS y DOM: sin SVG, sin texturas PNG, sin blur grande.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/Bitter";
import { loadFont as loadCond } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMark } from "@remotion/google-fonts/PermanentMarker";

const { fontFamily: SLAB } = loadSlab("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
const { fontFamily: COND } = loadCond("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const { fontFamily: MARK } = loadMark("normal", { weights: ["400"], subsets: ["latin"] });
export const F = { SLAB, COND, MARK };
export const K = { slate: "#1D2521", slate2: "#27322C", chalk: "#F2EFE4", kraft: "#C9A66F", kraft2: "#B28C55", paper: "#F5EEE3", paper2: "#EBDFCF", red: "#B3261E", ink: "#2A1B12", wood: "#6B4425", wood2: "#4A2E18", steel: "#C8CDD0", white: "#FFFDF8" };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const eout = (t: number) => Easing.out(Easing.cubic)(cl(t));
const sp = (f: number, d = 0, damping = 16, mass = 0.7) => spring({ frame: f - d, fps: 30, config: { damping, mass } });
const shadow = "0 2px 16px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.7)";
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;
const fadeIO = (f: number, dur: number, a = 8, b = 10) => interpolate(f, [0, a, dur - b, dur], [0, 1, 1, 0], CL);

// ---------- cámara de foto y clip (Ken Burns sorteado por plano)
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = hash(seed) % 2 === 1; const sec = dur / 30;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.018 + r01(seed, 1) * 0.022;
  const amp = Math.min(clip ? 0.08 : 0.2, rate * sec);
  const t = Easing.inOut(Easing.sin)(cl(f / Math.max(1, dur))); const k = out ? 1 - t : t;
  const ang = r01(seed, 4) * Math.PI * 2;
  return { transform: `translate(${Math.cos(ang) * 2 * k}%, ${Math.sin(ang) * 1.2 * k}%) scale(${1.06 + amp * k})`, transformOrigin: `${35 + r01(seed, 2) * 30}% ${35 + r01(seed, 3) * 30}%` } as React.CSSProperties;
};
export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...useKB(seed, dur) }} /></AbsoluteFill>
);
export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number; volume?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75, volume = 0 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}><OffthreadVideo src={staticFile(src)} muted={volume === 0} volume={volume} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></AbsoluteFill>;
};
const AVMASK = "radial-gradient(ellipse 9.11% 19.91% at 49.48% 17.13%, #000 80%, transparent 100%), radial-gradient(ellipse 9.90% 10.19% at 50.26% 39.81%, #000 80%, transparent 100%), radial-gradient(ellipse 20.83% 30.56% at 50.26% 66.67%, #000 80%, transparent 100%), radial-gradient(ellipse 6.40% 23.15% at 34.10% 63.89%, #000 80%, transparent 100%), radial-gradient(ellipse 6.40% 24.07% at 67.50% 63.89%, #000 80%, transparent 100%), radial-gradient(ellipse 24.48% 10.65% at 50.26% 88.89%, #000 80%, transparent 100%)";
// avatar: push lento siempre, punch-in y reencuadre lateral
export const Avatar: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame(); const inn = hash(seed + 99) % 3 !== 0; const t = f / Math.max(1, dur);
  let z = inn ? 1.03 + 0.05 * t : 1.08 - 0.05 * t; let tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
    if (m.k === "punch") z *= 1 + 0.12 * w;
    if (m.k === "split") { z *= 1 + 0.14 * w; tx += -4 * w; }
  }
  // fondo limpio (cuadro del propio reel) + el video solo sobre la persona: tapa el ruido de color que el reel junta con los minutos
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "50% 30%" }}>
        <Img src={staticFile("stan12d/av_plate.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <OffthreadVideo src={staticFile(src)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", WebkitMaskImage: AVMASK, maskImage: AVMASK }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- materiales
const kraftBg = `repeating-linear-gradient(92deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px), repeating-linear-gradient(3deg, rgba(255,240,210,0.06) 0 1px, transparent 1px 11px), linear-gradient(170deg, ${K.kraft} 0%, ${K.kraft2} 100%)`;
const paperBg = `repeating-linear-gradient(90deg, rgba(120,90,60,0.035) 0 1px, transparent 1px 5px), linear-gradient(175deg, ${K.paper} 0%, ${K.paper2} 100%)`;
const slateBg = `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 55%), repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 19px), linear-gradient(160deg, ${K.slate2} 0%, ${K.slate} 100%)`;
// pared de azulejo blanco del local (fondo de las piezas a pantalla completa)
export const Tile: React.FC<{ dur: number; dark?: number }> = ({ dur, dark = 0.12 }) => {
  const f = useCurrentFrame(); const s = lerp(1.04, 1.1, f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E9E6DE" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, backgroundImage: "linear-gradient(rgba(120,112,100,0.55) 0 3px, transparent 3px), linear-gradient(90deg, rgba(120,112,100,0.55) 0 3px, transparent 3px), linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(232,228,218,1) 100%)", backgroundSize: "160px 160px, 160px 160px, 160px 160px" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(40,30,20,${dark}) 0%, rgba(40,30,20,${dark + 0.2}) 100%)` }} />
    </AbsoluteFill>
  );
};
export const Stamp: React.FC<{ size?: number; rot?: number; color?: string }> = ({ size = 1, rot = -9, color = K.red }) => (
  <div style={{ width: 190 * size, height: 190 * size, borderRadius: "50%", border: `${5 * size}px solid ${color}`, outline: `${2 * size}px solid ${color}`, outlineOffset: 5 * size, color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${rot}deg)`, opacity: 0.86, fontFamily: COND, fontWeight: 600, lineHeight: 1.05 }}>
    <div style={{ fontSize: 30 * size, letterSpacing: 2 * size }}>STAN'S MEATS</div>
    <div style={{ fontSize: 17 * size, letterSpacing: 5 * size, margin: `${4 * size}px 0` }}>· CHICAGO ·</div>
    <div style={{ fontSize: 22 * size, letterSpacing: 3 * size }}>SINCE 1961</div>
  </div>
);
// etiqueta de precio de papel madera con ojal y cuerda
const Ticket: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; pad?: string }> = ({ children, style, pad = "20px 34px 20px 64px" }) => (
  <div style={{ position: "relative", background: kraftBg, padding: pad, borderRadius: "10px 6px 6px 10px", boxShadow: "0 14px 34px rgba(0,0,0,0.45)", clipPath: "polygon(26px 0, 100% 0, 100% 100%, 26px 100%, 0 72%, 0 28%)", ...style }}>
    <div style={{ position: "absolute", left: 22, top: "50%", marginTop: -11, width: 22, height: 22, borderRadius: "50%", background: "rgba(30,20,10,0.8)", boxShadow: "inset 0 0 0 4px rgba(255,235,200,0.5)" }} />
    {children}
  </div>
);

// ---------- overlays
export const Kin: React.FC<{ lines: string[]; accent?: number; dur: number }> = ({ lines, accent = -1, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [dur - 9, dur], [1, 0], CL); let idx = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440, background: "linear-gradient(0deg, rgba(10,6,3,0.62), rgba(10,6,3,0))" }} />
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1640, position: "relative" }}>
          {ln.split(" ").map((w, wi) => {
            const p = sp(f, (idx++) * 4 + li * 6, 15, 0.6); const acc = li === accent;
            return <span key={wi} style={{ fontFamily: acc ? MARK : SLAB, fontWeight: acc ? 400 : 700, fontSize: acc ? 112 : 76, lineHeight: 1.1, color: acc ? "#FFE9B0" : K.white, textShadow: shadow, opacity: p, transform: `translateY(${(1 - p) * 30}px) rotate(${acc ? -1.5 : 0}deg)` }}>{w}</span>;
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};
export const Lower: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 18); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, opacity: o, transform: `translateX(${(1 - p) * -700}px) rotate(-1deg)` }}>
      <Ticket><div style={{ fontFamily: MARK, fontSize: 62, color: K.ink, lineHeight: 1 }}>{title}</div><div style={{ fontFamily: COND, fontWeight: 500, fontSize: 27, letterSpacing: 4, color: K.red, textTransform: "uppercase", marginTop: 6 }}>{sub}</div></Ticket>
    </div>
  );
};
// etiqueta que cuelga y se balancea al entrar
export const Tag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 9, 0.9); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const [a, b] = text.split(" · ");
  return (
    <div style={{ position: "absolute", right: 120, bottom: 130, opacity: o * cl(f / 4), transformOrigin: "22px 50%", transform: `rotate(${lerp(-38, -2.5, p)}deg)` }}>
      <Ticket><div style={{ fontFamily: MARK, fontSize: 54, color: K.ink, lineHeight: 1.05 }}>{a}</div>{b && <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: K.red, textTransform: "uppercase" }}>{b}</div>}</Ticket>
    </div>
  );
};
// termómetro de aguja (dial de sonda): 0–220 °F en 270°
export const Thermo: React.FC<{ deg: number; dur: number; label?: string }> = ({ deg, dur, label }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const MAX = deg > 220 ? 450 : 220; const t = eout((f - 6) / 34); const v = Math.round(lerp(40, deg, t));
  const ang = -135 + 270 * (lerp(40, deg, t) / MAX);
  return (
    <div style={{ position: "absolute", right: 150, top: 120, display: "flex", alignItems: "center", gap: 30, opacity: o * p, transform: `translateY(${(1 - p) * -60}px)` }}>
      <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #ECE8DF 70%, #D8D2C6 100%)", border: "14px solid #B9BEC2", boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 0 0 3px #8F959A", position: "relative" }}>
        {Array.from({ length: 23 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: i % 2 ? 3 : 5, height: i % 2 ? 14 : 24, marginLeft: -2, background: i / 22 * MAX >= 160 && MAX === 220 ? K.red : K.ink, transform: `rotate(${-135 + (270 * i) / 22}deg) translateY(-128px)`, transformOrigin: "50% 0" }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: 118, marginLeft: -4, marginTop: -118, background: K.red, borderRadius: 4, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, boxShadow: "2px 2px 4px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, margin: -15, borderRadius: "50%", background: K.ink }} />
      </div>
      <div><div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 150, lineHeight: 0.9, color: K.white, textShadow: shadow }}>{v}°F</div>{label && <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: "#F3E7D2", textShadow: shadow, textTransform: "uppercase", marginTop: 8 }}>{label}</div>}</div>
    </div>
  );
};
// timer de cuerda: la perilla gira hasta los minutos y después hace tic
export const Timer: React.FC<{ min: number; label?: string; dur: number }> = ({ min, label, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 14); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const set = interpolate(f, [4, 28], [0, min], { ...CL, easing: Easing.out(Easing.back(1.4)) });
  const tick = f > 34 ? Math.floor((f - 34) / 15) * 0.12 : 0; const val = Math.max(0, set - tick);
  return (
    <div style={{ position: "absolute", right: 160, top: 130, display: "flex", flexDirection: "column", alignItems: "center", opacity: o * p, transform: `scale(${0.75 + 0.25 * p})` }}>
      <div style={{ width: 290, height: 290, borderRadius: 40, background: "linear-gradient(160deg, #FBF7EE 0%, #E3DCCD 100%)", boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 -8px 0 rgba(0,0,0,0.08)", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 6, marginLeft: -9, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: `20px solid ${K.red}`, zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 22, borderRadius: "50%", background: "#F8F4EA", boxShadow: "inset 0 0 0 5px #C9C2B2", transform: `rotate(${-(val / 60) * 360}deg)` }}>
          {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: i % 5 ? 2 : 4, height: i % 5 ? 10 : 20, marginLeft: -1, background: K.ink, transform: `rotate(${i * 6}deg) translateY(-118px)`, transformOrigin: "50% 0" }} />)}
          {Array.from({ length: 12 }, (_, i) => <div key={"n" + i} style={{ position: "absolute", left: "50%", top: "50%", width: 50, marginLeft: -25, textAlign: "center", fontFamily: COND, fontWeight: 600, fontSize: 24, color: K.ink, transform: `rotate(${i * 30}deg) translateY(-96px)`, transformOrigin: "50% 0" }}>{i * 5}</div>)}
        </div>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 84, height: 84, margin: -42, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #D8473D 0%, ${K.red} 70%)`, boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }} />
      </div>
      <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 58, color: K.white, textShadow: shadow, marginTop: 14, textAlign: "center", maxWidth: 620, lineHeight: 1.05 }}>{label || `${min} minutes`}</div>
    </div>
  );
};
export const Count: React.FC<{ to: number; suffix: string; label: string; dur: number }> = ({ to, suffix, label, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 16); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const v = Math.round(interpolate(f, [4, 26], [0, to], { ...CL, easing: Easing.out(Easing.quad) }));
  return (
    <div style={{ position: "absolute", left: 120, bottom: 110, opacity: o * p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 190, lineHeight: 0.9, color: K.white, textShadow: shadow }}>{v}<span style={{ fontFamily: MARK, fontWeight: 400, fontSize: 82, marginLeft: 18, color: "#FFE9B0" }}>{suffix}</span></div>
      <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 32, letterSpacing: 3, color: "#F3E7D2", textShadow: shadow, marginTop: 10, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};
// sello rojo "MISTAKE Nº" que golpea + tira de papel con el error
export const Mis: React.FC<{ n: number; text: string; dur: number }> = ({ n, text, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const hit = sp(f, 2, 9, 0.5); const p = sp(f, 8, 16);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, opacity: o, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ border: `7px solid ${K.red}`, borderRadius: 12, padding: "6px 22px 10px", color: K.red, background: "rgba(255,250,240,0.9)", fontFamily: COND, fontWeight: 600, textAlign: "center", lineHeight: 1, transform: `scale(${lerp(2.6, 1, hit)}) rotate(${lerp(-24, -7, hit)}deg)`, opacity: cl(hit * 3), boxShadow: "0 10px 26px rgba(0,0,0,0.4)" }}>
        <div style={{ fontSize: 26, letterSpacing: 6 }}>MISTAKE</div><div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 96 }}>{n}</div>
      </div>
      <div style={{ background: paperBg, padding: "16px 34px", boxShadow: "0 12px 30px rgba(0,0,0,0.45)", transform: `rotate(-1deg)`, clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>
        <div style={{ fontFamily: MARK, fontSize: 60, color: K.ink, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};
// tablilla del ranking (recap): Nº · método · nota
export const Rec: React.FC<{ n: number; title: string; score: number; dur: number }> = ({ n, title, score, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = interpolate(f, [dur - 10, dur], [1, 0], CL); const s = sp(f, 12, 9, 0.5);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: slateBg, border: `12px solid ${K.wood}`, borderRadius: 8, boxShadow: "0 18px 44px rgba(0,0,0,0.55), inset 0 0 0 3px rgba(0,0,0,0.4)", padding: "16px 44px", display: "flex", alignItems: "center", gap: 34, transform: `translateY(${(1 - p) * 240}px)` }}>
        <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: "#E9C46A" }}>Nº {n}</div>
        <div style={{ fontFamily: MARK, fontSize: 66, color: K.chalk }}>{title}</div>
        <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 74, color: n === 1 ? "#E9C46A" : K.chalk, transform: `scale(${lerp(2, 1, s)})`, opacity: cl(s * 3) }}>{score}<span style={{ fontSize: 38, opacity: 0.8 }}>/10</span></div>
      </div>
    </div>
  );
};
// barra "method n of 8": ristra de salchichitas en una cuerda
export const Progress: React.FC<{ n: number; total: number; title: string; dur: number }> = ({ n, total, title, dur }) => {
  const f = useCurrentFrame(); const o = fadeIO(f, dur, 8, 8);
  return (
    <div style={{ position: "absolute", right: 60, top: 50, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: K.white, textShadow: shadow }}><span style={{ color: "#E9C46A" }}>METHOD {n}</span> OF {total} · {title.toUpperCase()}</div>
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(255,250,235,0.7)" }} />
        {Array.from({ length: total }, (_, i) => <div key={i} style={{ width: 46, height: 16, marginLeft: i ? 8 : 0, borderRadius: 9, position: "relative", background: i < n ? "linear-gradient(180deg, #B4552F 0%, #7A2E17 100%)" : "rgba(255,250,235,0.42)", boxShadow: "0 2px 5px rgba(0,0,0,0.45)" }} />)}
      </div>
    </div>
  );
};
// número de turno del mostrador: "n of 7 · topping"
export const Top: React.FC<{ n: number; text: string; dur: number }> = ({ n, text, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 11, 0.6); const o = interpolate(f, [dur - 8, dur], [1, 0], CL);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, display: "flex", alignItems: "stretch", opacity: o, transform: `translateY(${(1 - p) * 220}px) rotate(${lerp(8, -1.5, p)}deg)`, boxShadow: "0 16px 38px rgba(0,0,0,0.5)" }}>
      <div style={{ background: K.red, color: K.white, padding: "8px 30px 12px", textAlign: "center", fontFamily: COND, fontWeight: 600, lineHeight: 1 }}><div style={{ fontSize: 22, letterSpacing: 5, marginTop: 8 }}>NOW SERVING</div><div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 120 }}>{n}</div></div>
      <div style={{ background: paperBg, padding: "18px 40px 14px 34px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: MARK, fontSize: 68, color: K.ink, lineHeight: 1, whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: i < n ? K.red : "transparent", border: `3px solid ${K.red}` }} />)}</div>
      </div>
    </div>
  );
};

// ---------- pantallas completas
// barrido de papel madera (transición de capítulo): una hoja con pliegues cruza la pantalla
const KraftWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame(); const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-1.25, 1.25, Easing.inOut(Easing.quad)(t)); const hor = dir % 2 === 0; const sign = dir < 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: hor ? `${sign * pos * 100 - 15}%` : "-15%", top: hor ? "-15%" : `${sign * pos * 100 - 15}%`, width: "130%", height: "130%", background: kraftBg, transform: `rotate(${dir === 3 ? 4 : -3}deg)`, boxShadow: "0 0 80px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 2px, rgba(255,255,255,0.07) 2px 4px, transparent 4px 240px)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Stamp size={1.7} rot={-12} color="rgba(120,30,20,0.55)" /></div>
      </div>
    </AbsoluteFill>
  );
};
// apertura de cada método: papel que barre → foto a pantalla completa, número que se destapa, título palabra por palabra
export const MethodScene: React.FC<{ n: number; rank: number; total: number; title: string; src: string; dur: number }> = ({ n, rank, total, title, src, dur }) => {
  const f = useCurrentFrame(); const v = n - 1, right = v % 2 === 1, mode = v % 3;
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL); const k = cl((f - 10) / (dur - 10));
  const z = mode === 0 ? lerp(1.26, 1.08, eout(k)) : mode === 1 ? lerp(1.05, 1.2, k) : 1.14; const px = mode === 2 ? lerp(right ? 4 : -4, right ? -4 : 4, k) : 0;
  const num = eio((f - 14) / 22); const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 120, alignItems: "flex-end", textAlign: "right" } : { left: 120, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      {f >= 10 && (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}%) scale(${z})` }} /></AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(16,11,8,0.86) 0%, rgba(16,11,8,0.42) 45%, rgba(16,11,8,0) 70%)` }} />
          <div style={{ position: "absolute", top: 210, width: 900, display: "flex", flexDirection: "column", ...side }}>
            <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 30, letterSpacing: 9, color: "#E9C46A", opacity: num }}>METHOD {n} OF {total}</div>
            <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 300, lineHeight: 0.95, color: K.white, textShadow: shadow, clipPath: `inset(${(1 - num) * 100}% 0 0 0)`, transform: `translateY(${(1 - num) * 40}px)` }}><span style={{ fontFamily: COND, fontWeight: 500, fontSize: 90, verticalAlign: "top", marginRight: 10, color: "#E9C46A" }}>Nº</span>{rank}</div>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start" }}>
              {words.map((w, i) => { const p = sp(f, 30 + i * 5, 15, 0.6); return <span key={i} style={{ fontFamily: MARK, fontSize: 96, color: K.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(-1.5deg)` }}>{w}</span>; })}
            </div>
            <div style={{ height: 6, background: K.red, marginTop: 16, width: 280 * cl((f - 44) / 16) }} />
          </div>
        </AbsoluteFill>
      )}
      <KraftWipe dir={v % 4} len={20} />
    </AbsoluteFill>
  );
};
// pizarra de precios con el ranking: se va llenando método por método
export type Row = { rank: number; title: string; score: number };
export const ScoreBoard: React.FC<{ rows: Row[]; now: number; dur: number }> = ({ rows, now, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 18); const o = fadeIO(f, dur, 6, 8); const wr = eio((f - 10) / 22); const sc = sp(f, 30, 8, 0.5);
  const cam = lerp(1, 1.05, f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1560, background: slateBg, border: `26px solid ${K.wood}`, borderRadius: 10, boxShadow: `0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 4px ${K.wood2}, inset 0 0 60px rgba(0,0,0,0.5)`, padding: "26px 70px 30px", transform: `scale(${(0.9 + 0.1 * p) * cam}) rotate(${lerp(-2, -0.6, p)}deg)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "3px solid rgba(242,239,228,0.5)", paddingBottom: 10, marginBottom: 12 }}>
            <div style={{ fontFamily: MARK, fontSize: 74, color: K.chalk }}>8 ways to cook a hot dog</div>
            <div style={{ fontFamily: COND, fontWeight: 500, fontSize: 34, letterSpacing: 5, color: "#E9C46A" }}>OUT OF 10</div>
          </div>
          {rows.map((r) => {
            const done = r.rank > now, cur = r.rank === now; const show = done || cur;
            return (
              <div key={r.rank} style={{ display: "flex", alignItems: "baseline", height: 92, gap: 30, opacity: show ? 1 : 0.28 }}>
                <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 44, letterSpacing: 3, color: "#E9C46A", width: 124 }}>Nº {r.rank}</div>
                <div style={{ fontFamily: MARK, fontSize: cur ? 76 : 62, color: K.chalk, flex: 1, whiteSpace: "nowrap", clipPath: cur ? `inset(0 ${100 - wr * 100}% 0 0)` : undefined }}>{show ? r.title : "· · · · ·"}</div>
                <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: cur ? 86 : 66, color: cur ? "#E9C46A" : K.chalk, transform: cur ? `scale(${lerp(2.4, 1, sc)}) rotate(${lerp(-12, 0, sc)}deg)` : undefined, opacity: cur ? cl(sc * 3) : show ? 1 : 0 }}>{show ? r.score : ""}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// hoja de papel de carnicero con renglones a lápiz graso que aparecen sobre su palabra
export type Line = { t: string; f: number; done?: boolean };
export const Sheet: React.FC<{ kicker: string; title: string; lines: Line[]; dur: number; seed: number; stamp?: boolean }> = ({ kicker, title, lines, dur, seed, stamp = true }) => {
  const f = useCurrentFrame(); const pin = sp(f, 0, 17, 0.8); const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const fs = lines.length > 6 ? 54 : lines.length > 4 ? 68 : 78; let cur = -1; lines.forEach((l, i) => { if (f >= l.f) cur = i; });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.28} />
      <div style={{ position: "absolute", left: 190, top: 70, width: 1540, height: 940, background: paperBg, boxShadow: "0 34px 80px rgba(0,0,0,0.55)", transform: `translateY(${(1 - pin) * 300}px) rotate(${((seed % 3) - 1) * 0.7}deg) scale(${lerp(1, 1.04, f / Math.max(1, dur))})`, opacity: pin, clipPath: "polygon(0 0, 100% 0, 100% 97%, 96% 100%, 90% 97.5%, 84% 100%, 78% 97.5%, 72% 100%, 66% 97.5%, 60% 100%, 54% 97.5%, 48% 100%, 42% 97.5%, 36% 100%, 30% 97.5%, 24% 100%, 18% 97.5%, 12% 100%, 6% 97.5%, 0 100%)" }}>
        <div style={{ position: "absolute", left: 90, right: 80, top: 54, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><div style={{ fontFamily: COND, fontWeight: 600, fontSize: 28, letterSpacing: 7, color: K.red }}>{kicker}</div><div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 104, color: K.ink, lineHeight: 1.05, marginTop: 6 }}>{title}</div></div>
          {stamp && <div style={{ marginTop: -6 }}><Stamp size={0.92} /></div>}
        </div>
        <div style={{ position: "absolute", left: 90, right: 80, top: 280 }}>
          {lines.map((l, i) => {
            const p = l.done ? 1 : eio((f - l.f) / 13); const now = i === cur && !l.done;
            return (
              <div key={i} style={{ fontFamily: MARK, fontSize: fs, color: l.done ? "rgba(42,27,18,0.5)" : K.ink, lineHeight: 1.5, whiteSpace: "nowrap", position: "relative", clipPath: `inset(-10% ${100 - p * 100}% -10% 0)` }}>
                <span style={{ color: K.red, marginRight: 18 }}>{l.done ? "✓" : "—"}</span>{l.t}
                {now && <span style={{ position: "absolute", left: -10, right: 0, bottom: fs * 0.2, height: fs * 0.36, background: "rgba(233,196,106,0.4)", zIndex: -1 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
// cartel de capítulo: rollo de papel madera que baja desde un rodillo de acero
export const Chapter: React.FC<{ kicker: string; title: string; dur: number }> = ({ kicker, title, dur }) => {
  const f = useCurrentFrame(); const roll = eout(f / 16); const o = fadeIO(f, dur, 4, 8); const p = sp(f, 12, 14);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.3} />
      <div style={{ position: "absolute", left: 330, right: 330, top: 0, height: 60, background: "linear-gradient(180deg, #8E9499 0%, #E6EAEC 35%, #9BA1A6 70%, #5F6569 100%)", borderRadius: "0 0 30px 30px", boxShadow: "0 12px 24px rgba(0,0,0,0.45)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 380, right: 380, top: 30, height: 760 * roll, background: kraftBg, boxShadow: "0 30px 70px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}>
          <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: K.red, opacity: p }}>{kicker}</div>
          <div style={{ fontFamily: MARK, fontSize: title.length > 18 ? 104 : 136, color: K.ink, lineHeight: 1.05, marginTop: 14, transform: `rotate(-2deg) scale(${0.9 + 0.1 * p})`, opacity: p }}>{title}</div>
        </div>
        <div style={{ position: "absolute", right: 60, bottom: 40, opacity: p * 0.9 }}><Stamp size={0.75} rot={10} /></div>
      </div>
    </AbsoluteFill>
  );
};
// los siete del estilo Chicago colgados de una cuerda de atar: cada etiqueta cae en su palabra
export const Seven: React.FC<{ items: { t: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); const o = fadeIO(f, dur, 6, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.3} />
      <div style={{ position: "absolute", left: -20, right: -20, top: 150, height: 9, background: "repeating-linear-gradient(60deg, #EDE3CC 0 6px, #B9A983 6px 10px)", boxShadow: "0 3px 6px rgba(0,0,0,0.4)", transform: "rotate(-0.6deg)" }} />
      {items.map((it, i) => {
        const p = sp(f, it.f, 8, 0.9); const x = 62 + i * 258; const sway = Math.sin((f + i * 17) / 21) * 1.6;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 146 - i * 2.7, width: 246, transformOrigin: "50% 0", transform: `rotate(${lerp(i % 2 ? 50 : -50, sway, p)}deg) translateY(${(1 - cl(p * 2)) * -500}px)`, opacity: cl((f - it.f) / 3) }}>
            <div style={{ width: 3, height: 70, background: "#D9CFB6", margin: "0 auto" }} />
            <div style={{ background: kraftBg, borderRadius: "70px 70px 10px 10px", padding: "70px 10px 30px", textAlign: "center", boxShadow: "0 16px 34px rgba(0,0,0,0.5)", position: "relative", minHeight: 620 }}>
              <div style={{ position: "absolute", left: "50%", top: 18, marginLeft: -12, width: 24, height: 24, borderRadius: "50%", background: "rgba(30,20,10,0.8)", boxShadow: "inset 0 0 0 4px rgba(255,235,200,0.5)" }} />
              <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 210, color: K.red, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontFamily: MARK, fontSize: it.t.length > 9 ? 50 : 62, color: K.ink, lineHeight: 1.05, marginTop: 34 }}>{it.t}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// CTA: hoja de pedidos con la pregunta para los comentarios
export const CTA: React.FC<{ text: string; dur: number; seed: number }> = ({ text, dur, seed }) => {
  const f = useCurrentFrame(); const hit = sp(f, 14, 9, 0.5);
  return (
    <AbsoluteFill>
      <Sheet kicker="TELL ME IN THE COMMENTS" title="One question" lines={text.split("|").map((t, i) => ({ t, f: 26 + i * 22 }))} dur={dur} seed={seed} stamp={false} />
      <div style={{ position: "absolute", right: 300, top: 120, border: `8px solid ${K.red}`, borderRadius: 14, padding: "8px 30px", color: K.red, background: "rgba(255,250,240,0.92)", fontFamily: COND, fontWeight: 600, fontSize: 66, letterSpacing: 6, transform: `scale(${lerp(2.6, 1, hit)}) rotate(${lerp(-26, 7, hit)}deg)`, opacity: cl(hit * 3) * interpolate(f, [dur - 10, dur], [1, 0], CL), boxShadow: "0 12px 28px rgba(0,0,0,0.4)" }}>SUBSCRIBE</div>
    </AbsoluteFill>
  );
};
// mapa real (foto) con alfileres de cabeza roja que se clavan en su palabra
export const MapPins: React.FC<{ src: string; pins: { x: number; y: number; t: string; f: number }[]; dur: number }> = ({ src, pins, dur }) => {
  const f = useCurrentFrame(); const z = lerp(1.02, 1.16, eio(f / Math.max(1, dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: fadeIO(f, dur, 6, 8), background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "62% 45%" }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        {pins.map((p, i) => {
          const s = sp(f, p.f, 9, 0.6);
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, opacity: cl((f - p.f) / 3) }}>
              <div style={{ position: "absolute", left: -3, top: -70 * s, width: 6, height: 70, background: "linear-gradient(90deg, #8A8F93, #E8ECEE, #777C80)", transformOrigin: "50% 100%" }} />
              <div style={{ position: "absolute", left: -22, top: -70 * s - 40, width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #E8574C 0%, ${K.red} 65%, #6E130E 100%)`, boxShadow: "6px 10px 12px rgba(0,0,0,0.4)" }} />
              <div style={{ position: "absolute", left: 34, top: -128, transform: `scale(${s}) rotate(-2deg)`, transformOrigin: "0 100%" }}><Ticket pad="10px 24px 10px 54px"><div style={{ fontFamily: MARK, fontSize: 40, color: K.ink, whiteSpace: "nowrap" }}>{p.t}</div></Ticket></div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// tarjeta de método con foto (carrusel y recap): ticket de papel con foto, puesto y nota
export type MCard = { title: string; src: string; rank: number; score: number };
const MethodCard: React.FC<{ c: MCard; w: number; dim?: number; lit?: number }> = ({ c, w, dim = 0, lit = 0 }) => (
  <div style={{ width: w, background: paperBg, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.5)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.4})` }} />
      <div style={{ position: "absolute", left: w * 0.03, top: w * 0.03, background: K.red, color: K.white, fontFamily: SLAB, fontWeight: 800, fontSize: w * 0.1, padding: `0 ${w * 0.035}px`, transform: "rotate(-4deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }}><span style={{ fontFamily: COND, fontWeight: 500, fontSize: w * 0.05, marginRight: 4 }}>Nº</span>{c.rank}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: w * 0.03, height: w * 0.17 }}>
      <span style={{ fontFamily: MARK, fontSize: w * (c.title.length > 12 ? 0.092 : 0.115), color: K.ink, lineHeight: 1, opacity: 1 - dim * 0.5 }}>{c.title}</span>
      {lit > 0 && <span style={{ fontFamily: SLAB, fontWeight: 800, fontSize: w * 0.11, color: K.red, transform: `scale(${lerp(2.2, 1, lit)})`, opacity: cl(lit * 3) }}>{c.score}<span style={{ fontSize: w * 0.05 }}>/10</span></span>}
    </div>
  </div>
);
const DimBg: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.68 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - dark}) saturate(0.7)`, transform: `scale(${1.2 + 0.0004 * f})` }} /></AbsoluteFill>;
};
// carrusel 3D de los 8 métodos → abanico
export const Carousel: React.FC<{ cards: MCard[]; bg: string; head: string; sub: string; subAt: number; dur: number }> = ({ cards, bg, head, sub, subAt, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [dur - 12, dur], [1, 0], CL); const pIn = sp(f, 0, 22);
  const fanT = eio((f - dur * 0.62) / 34); const rot = -f * 0.9; const R = 700, PR = 1700;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <DimBg src={bg} />
      <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 84, color: K.white, textShadow: shadow, lineHeight: 1 }}>{head}</div>
        <div style={{ fontFamily: MARK, fontSize: 52, color: "#FFE9B0", textShadow: shadow, marginTop: 10, opacity: cl((f - subAt) / 10) }}>{sub}</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%", transformOrigin: "50% 52%", transform: `scale(${lerp(1.38, 1, fanT)})` }}>
        {cards.map((c, i) => {
          const appear = sp(f, 4 + i * 5, 16, 0.6); const N = cards.length; const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180; const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1); const phi = -28 + i * (56 / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const x = lerp(rx, PR * Math.sin(pr), fanT), y = lerp(40, PR * (1 - Math.cos(pr)), fanT), z = lerp(rz, i * 2, fanT);
          const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fanT);
          return <div key={i} style={{ position: "absolute", left: 960 - 220, top: 350, zIndex: Math.round(2000 + z), opacity: vis * appear, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${lerp(th, 0, fanT)}deg) rotateZ(${lerp(0, phi, fanT)}deg) scale(${lerp(1, 0.92, fanT) * appear})` }}><MethodCard c={c} w={440} /></div>;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// recap: las 8 tarjetas en dos filas, cada una recibe su nota
export const Recap: React.FC<{ cards: MCard[]; marks: number[]; bg: string; head: string; dur: number }> = ({ cards, marks, bg, head, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 20);
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [dur - 8, dur], [1, 0], CL) }}>
      <DimBg src={bg} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SLAB, fontWeight: 800, fontSize: 76, color: K.white, textShadow: shadow, opacity: p }}>{head}</div>
      {cards.map((c, i) => {
        const row = Math.floor(i / 4), col = i % 4; const e = sp(f, i * 3, 16); const lit = f >= marks[i]; const ck = sp(f, marks[i], 10, 0.6);
        return <div key={i} style={{ position: "absolute", left: 96 + col * 440, top: 190 + row * 420, opacity: e, transform: `translateY(${(1 - e) * 60 + Math.sin((f + i * 23) / 19) * 6}px) rotate(${((hash(i + 40) % 7) - 3) * 0.7}deg) scale(${lit ? 1 : 0.94})` }}><MethodCard c={c} w={400} dim={lit ? 0 : 0.8} lit={lit ? ck : 0} /></div>;
      })}
    </AbsoluteFill>
  );
};
// foto antigua como objeto: copia en papel con borde blanco sobre el tajo de madera, cinta en las esquinas, una segunda copia debajo
export const Album: React.FC<{ src: string; seed: number; dur: number; board?: string; caption?: string }> = ({ src, seed, dur, board, caption }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur); const r = (hash(seed) % 2 ? 1 : -1) * (1.2 + (hash(seed + 1) % 3)); const drop = sp(f, 0, 14, 0.8);
  const tape = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 150, height: 44, background: "rgba(236,226,204,0.85)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", ...s }} />;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, ${K.wood} 0%, ${K.wood2} 100%)`, overflow: "hidden" }}>
      {board ? <Img src={staticFile(board)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.62)", transform: `scale(${1.1 + 0.05 * t})` }} /> : <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(88deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 46px), repeating-linear-gradient(2deg, rgba(255,220,170,0.05) 0 1px, transparent 1px 13px)" }} />}
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * t}) translateY(${-10 * t}px) rotate(${-0.5 * t}deg)` }}>
        <div style={{ position: "absolute", left: 330, top: 100, width: 1260, padding: caption ? "30px 30px 110px" : "30px 30px 36px", background: "#F3ECDB", transform: `rotate(${r + (1 - drop) * 6}deg) translateY(${(1 - drop) * -140}px) scale(${1.06 - 0.06 * drop})`, boxShadow: `0 ${36 + (1 - drop) * 40}px 80px rgba(0,0,0,0.6)` }}>
          <div style={{ width: 1200, height: 770, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.22) contrast(1.02)" }} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 110px rgba(40,25,10,0.42)" }} />
          </div>
          {caption && <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: MARK, fontSize: 58, color: K.ink }}>{caption}</div>}
          {tape({ left: -48, top: -12, transform: "rotate(-38deg)" })}{tape({ right: -48, top: -12, transform: "rotate(38deg)" })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
