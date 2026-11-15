// scr15a · overlays propios (MEJORAS 2,4,5,8,9 + chip de seguridad). PURO CSS/DOM, sin SVG, sin blur, sin grano. Nada arriba a la izquierda.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS, useKB } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const inout = (f: number, d: number, a = 10, b = 10) => interpolate(f, [0, a, d - b, d], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
const CHALK = "#f4f1ea", AMBER = "#f4a83a", RED = "#c8321f", INK = "#1f1c18";
const STEPS = ["CANDLE MATH", "THE DRUM", "CLEAN IT WET", "PAN + SAND", "3 LEGS · 1 INCH", "4 CANDLES", "POT ON TOP", "LIGHT + MEASURE", "40 MIN TAIL", "ADD MASS", "WHERE · NEVER", "SNUFF + RELOAD"];

// MEJORA 2 · progreso: una cinta de acero de 12 tramos arriba a la derecha; el tramo del paso actual se pinta ámbar
export const StepTape: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12);
  return <div style={{ position: "absolute", right: 56, top: 46, opacity: o, transform: `translateX(${(1 - o) * 80}px)` }}>
    <div style={{ display: "flex", height: 34, width: 600, background: "linear-gradient(#d9dde0,#9aa1a6)", border: "3px solid #5f666c", borderRadius: 4, overflow: "hidden" }}>
      {STEPS.map((_, i) => <div key={i} style={{ flex: 1, borderRight: i < 11 ? "2px solid #4a5055" : undefined, background: i + 1 < n ? "#c97d2c" : i + 1 === n ? (f > 10 ? AMBER : "#c97d2c") : "transparent" }} />)}
    </div>
    <div style={{ marginTop: 8, textAlign: "right", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: 2, textShadow: "2px 2px 0 rgba(0,0,0,.65)" }}>STEP {n} / 12 · {STEPS[n - 1]}</div>
  </div>;
};

// MEJORA 5 · cortina de capítulo: una chapa de hierro oxidado (foto real) cruza de derecha a izquierda tapando el corte
export const IronSheet: React.FC<{ dur: number; src: string }> = ({ dur, src }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [0, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 1920 - t * 3840, top: 0, width: 1920, height: 1080, overflow: "hidden", boxShadow: "-18px 0 26px rgba(0,0,0,.5), 18px 0 26px rgba(0,0,0,.5)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(40,20,10,.25)" }} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 1840 : 50, top: 0, bottom: 0, width: 30, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {Array.from({ length: 6 }).map((_, j) => <div key={j} style={{ width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(#b0a8a0,#3a332e)" }} />)}</div>)}
    </div>
  </AbsoluteFill>;
};

// presentación: chapa de acero estampada (abajo a la izquierda), que cae de canto y queda
export const SteelTag: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 14); const r = interpolate(f, [0, 14], [70, 0], { ...CL, easing: Easing.out(Easing.back(1.6)) });
  return <div style={{ position: "absolute", left: 90, bottom: 90, opacity: o, perspective: 1200 }}>
    <div style={{ padding: "26px 46px", background: "linear-gradient(135deg,#e1e4e6,#9097a0)", border: "4px solid #626970", borderRadius: 12, transform: `rotateX(${r}deg) rotate(-2deg)`, transformOrigin: "50% 100%", boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#33393f", letterSpacing: 4, textShadow: "-2px -2px 0 rgba(0,0,0,.3), 2px 2px 0 rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#3e454b", letterSpacing: 2, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>;
};

// MEJORA 4 · pantalla partida: el avatar se corre y a la derecha una copia queda sujeta con dos imanes a la chapa del taller
export const MagnetBoard: React.FC<{ src: string; seed: number; dur: number; label?: string }> = ({ src, seed, dur, label }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 14, 12); const kb = useKB(seed, dur);
  return <><div style={{ position: "absolute", left: 1040, top: 0, right: 0, bottom: 0, opacity: cl(o * 2), background: "linear-gradient(90deg,#3a3633,#24211f)", boxShadow: "-16px 0 24px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: 1100, top: 150, width: 760, padding: 14, paddingBottom: label ? 70 : 14, background: "#f7f3ea", transform: `translateY(${(1 - o) * 900}px) rotate(${seed % 2 ? 1.5 : -1.5}deg)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)" }}>
      <div style={{ width: 760, height: 620, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></div>
      {label && <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, whiteSpace: "nowrap" }}>{label}</div>}
      {[60, 640].map((x) => <div key={x} style={{ position: "absolute", left: x, top: -20, width: 64, height: 40, borderRadius: 8, background: "linear-gradient(#e0453a,#9c1d14)", boxShadow: "0 6px 0 rgba(0,0,0,.35)" }} />)}
    </div></>;
};

// MEJORA 9 · dato con fuente: pizarrita de tiza colgada de un clavo, abajo a la izquierda
export const Slate: React.FC<{ big: string; label: string; src: string; dur: number }> = ({ big, label, src, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const rev = cl((f - 8) / 16);
  return <div style={{ position: "absolute", left: 80, bottom: 70, opacity: o, transform: `translateY(${(1 - o) * 60}px) rotate(-1.5deg)` }}>
    <div style={{ padding: "22px 34px", background: "linear-gradient(170deg,#2f322f,#1f221f)", border: "12px solid #7a5a36", borderRadius: 6, boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: big.length > 7 ? 64 : 80, color: AMBER, lineHeight: 1, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - rev * 100}% -20% 0)` }}>{big}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: CHALK, marginTop: 10, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#b9b1a2", marginTop: 6, whiteSpace: "nowrap" }}>SOURCE · {src}</div>
    </div>
  </div>;
};

// chip de seguridad: cinta de peligro amarilla y negra con el texto, abajo a la izquierda
export const Hazard: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 8, 10); const w = ou(f / 10);
  return <div style={{ position: "absolute", left: 0, bottom: 60, opacity: o, clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>
    <div style={{ display: "flex", alignItems: "center", boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>
      <div style={{ width: 120, height: 96, background: "repeating-linear-gradient(-45deg,#f2c230 0 22px,#1b1b1b 22px 44px)" }} />
      <div style={{ padding: "0 40px", height: 96, display: "flex", alignItems: "center", background: "#f2c230", fontFamily: SANS, fontWeight: 900, fontSize: 46, color: "#1b1b1b", letterSpacing: 1, whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ width: 60, height: 96, background: "repeating-linear-gradient(-45deg,#f2c230 0 22px,#1b1b1b 22px 44px)" }} />
    </div>
  </div>;
};
