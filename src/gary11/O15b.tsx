// scr15b · overlays propios (MEJORAS 2,4,5,9 + chip de seguridad). PURO CSS/DOM, sin SVG, sin blur, sin grano. Nada arriba a la izquierda.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS, useKB } from "./Piezas";

const { SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const inout = (f: number, d: number, a = 10, b = 10) => interpolate(f, [0, a, d - b, d], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
const WAX = "#f3ead2", ORANGE = "#f39a2e", ENAMEL = "#1f3f6e", INK = "#1c1b19", RED = "#c8321f";
const CORR = `repeating-linear-gradient(90deg, #c4955c 0px, #b07f48 7px, #c99a60 14px)`;
const PARTS = ["WHAT IT IS", "THE CAN", "THE CARDBOARD", "THE WAX", "MELT IT SAFE", "FILL IT TWICE", "THE STOVE", "LIGHT + BOIL TEST", "TURN DOWN · PUT OUT", "REFILL + STORE"];

// MEJORA 2 · progreso: tira de cartón corrugado de 10 tramos arriba a la derecha; la parte actual se llena de naranja
export const PartStrip: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12);
  return <div style={{ position: "absolute", right: 70, top: 60, opacity: o, transform: `translateY(${(1 - o) * -60}px)` }}>
    <div style={{ display: "flex", gap: 6, height: 40, width: 560 }}>
      {PARTS.map((_, i) => <div key={i} style={{ flex: 1, background: i + 1 < n ? "#d98a2a" : i + 1 === n ? (f > 10 ? ORANGE : "#d98a2a") : CORR, border: "2px solid #6a4826", borderRadius: 3 }} />)}
    </div>
    <div style={{ marginTop: 10, marginLeft: "auto", width: "fit-content", padding: "6px 22px", background: "rgba(20,18,16,.88)", borderRadius: 8, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 2 }}><span style={{ color: ORANGE, fontSize: 70 }}>{n}</span> / 10 · {PARTS[n - 1]}</div>
  </div>;
};

// MEJORA 5 · cortina de capítulo: una lámina con foto real (cartón, lata o cera) sube de abajo hacia arriba con bordes de corrugado
export const CardFlap: React.FC<{ dur: number; src: string }> = ({ dur, src }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [0, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, top: 1080 - t * 2160, width: 1920, height: 1080, overflow: "hidden", boxShadow: "0 -18px 26px rgba(0,0,0,.5), 0 18px 26px rgba(0,0,0,.5)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: CORR }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: CORR }} />
    </div>
  </AbsoluteFill>;
};

// presentación: faja de etiqueta de lata (crema con bandas azul enlozado), abajo a la izquierda, se desenrolla
export const CanLabel: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 14); const w = ou(f / 16);
  return <div style={{ position: "absolute", right: 90, bottom: 110, opacity: o, clipPath: `inset(0 0 0 ${100 - w * 100}%)` }}>
    <div style={{ padding: "30px 50px", background: `linear-gradient(180deg, ${ENAMEL} 0 12px, ${WAX} 12px calc(100% - 12px), ${ENAMEL} calc(100% - 12px))`, boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: INK, letterSpacing: 4, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </div>;
};

// MEJORA 4 · pantalla partida: el avatar se corre y a la derecha la foto queda pegada con cinta sobre cartón corrugado
export const TapedCard: React.FC<{ src: string; seed: number; dur: number; label?: string }> = ({ src, seed, dur, label }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 14, 12); const kb = useKB(seed, dur);
  return <><div style={{ position: "absolute", left: 1120, top: 0, right: 0, bottom: 0, opacity: cl(o * 2), background: CORR, boxShadow: "-16px 0 24px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: 1160, top: 170, width: 700, padding: 14, paddingBottom: label ? 70 : 14, background: "#f8f5ec", transform: `translateX(${(1 - o) * 900}px) rotate(${seed % 2 ? 1.5 : -1.5}deg)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)" }}>
      <div style={{ width: 700, height: 580, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></div>
      {label && <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, whiteSpace: "nowrap" }}>{label}</div>}
      {[-30, 590].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: -16, width: 160, height: 46, background: "rgba(232,222,190,.9)", transform: `rotate(${i ? 25 : -25}deg)` }} />)}
    </div></>;
};

// MEJORA 9 · dato con fuente: tapa de lata con cinta de enmascarar escrita, abajo a la izquierda
export const TapeData: React.FC<{ big: string; label: string; src: string; dur: number }> = ({ big, label, src, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const rev = cl((f - 8) / 16);
  return <div style={{ position: "absolute", left: 80, bottom: 70, opacity: o, transform: `translateY(${(1 - o) * 60}px)` }}>
    <div style={{ padding: "26px 38px", background: "linear-gradient(135deg,#eef0f2,#9aa1a8)", border: "6px solid #6f757c", borderRadius: 14, boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ background: "rgba(238,226,190,.97)", padding: "14px 24px", transform: "rotate(-1deg)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: big.length > 8 ? 62 : 78, color: ENAMEL, lineHeight: 1, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - rev * 100}% -20% 0)` }}>{big}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: INK, marginTop: 8, whiteSpace: "nowrap" }}>{label}</div></div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#2b3036", marginTop: 10, whiteSpace: "nowrap" }}>SOURCE · {src}</div>
    </div>
  </div>;
};

// chip de seguridad: cartel enlozado rojo y blanco, abajo a la izquierda
export const Enamel: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 8, 10); const w = ou(f / 10);
  return <div style={{ position: "absolute", left: 70, bottom: 60, opacity: o, transform: `scale(${0.9 + 0.1 * w})`, transformOrigin: "0 100%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 40px", background: RED, border: "8px solid #f5f3ee", borderRadius: 18, boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f3ee", color: RED, fontFamily: SANS, fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: "#f5f3ee", letterSpacing: 1, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </div>;
};
