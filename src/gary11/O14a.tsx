// gary14a · overlays propios (MEJORAS 2,4,5,8,9 + CTA de mitad + chip «THE SAFE WAY»). PURO CSS/DOM, sin SVG, sin blur, sin grano.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const inout = (f: number, d: number, a = 10, b = 10) => interpolate(f, [0, a, d - b, d], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
const INK = "#1d2430", CREAM = "#f3ecdc", YEL = "#f2c230", ST = "#2f7d6d", GN = "#c0392b";
const ROUNDS = ["AIR", "POWER", "HOURS", "FUEL", "COLD", "FURNACE", "NOISE & THEFT", "UPKEEP", "MONEY", "LIFE"];

// MEJORA 2 · progreso: tira de 10 fusibles de cartucho arriba a la derecha; los rounds jugados quedan con el visor encendido
export const FuseStrip: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12);
  return <div style={{ position: "absolute", right: 56, top: 48, opacity: o, transform: `translateY(${(1 - o) * -30}px)` }}>
    <div style={{ display: "flex", gap: 8, background: "rgba(24,26,30,.86)", padding: "14px 16px", borderRadius: 8 }}>
      {ROUNDS.map((_, i) => { const on = i + 1 < n || (i + 1 === n && f > 10); const cur = i + 1 === n;
        return <div key={i} style={{ width: 22, height: 54, borderRadius: 11, background: "linear-gradient(90deg,#b9b9b9,#eee,#9a9a9a)", position: "relative", transform: cur ? `scale(${1 + 0.15 * cl((f - 10) / 6)})` : "none" }}>
          <div style={{ position: "absolute", left: 5, right: 5, top: 14, bottom: 14, borderRadius: 3, background: on ? (cur ? YEL : "#e98f2a") : "#3a3a3a" }} /></div>; })}
    </div>
    <div style={{ marginTop: 8, textAlign: "right", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: 2, textShadow: "2px 2px 0 rgba(0,0,0,.6)" }}>ROUND {n} / 10 · {ROUNDS[n - 1]}</div>
  </div>;
};

// MEJORA 5 · transición de capítulo: un caño de EMT pasa de lado a lado tapando el corte, con el cable amarillo tirado detrás
export const Conduit: React.FC<{ dur: number; src?: string }> = ({ dur, src = "gary14a/g/g0320.png" }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [0, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const x = 1920 - t * 3840; // entra por la derecha, cubre el corte, sale por la izquierda
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: 0, width: 1920, height: 1080, overflow: "hidden", boxShadow: "-18px 0 26px rgba(0,0,0,.5), 18px 0 26px rgba(0,0,0,.5)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${(t - 0.5) * 120}px) scale(1.08)` }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,14,18,.25)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: YEL }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 14, background: YEL }} />
    </div>
  </AbsoluteFill>;
};

// presentación: parche bordado de la camisa de trabajo
export const Patch: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 14), s = 0.6 + 0.4 * ou(f / 14);
  return <div style={{ position: "absolute", left: 90, bottom: 90, opacity: o, transform: `scale(${s}) rotate(-3deg)`, transformOrigin: "0 100%" }}>
    <div style={{ width: 680, height: 240, borderRadius: "50%", background: "#1f3a5f", border: "10px solid #e9dcc4", outline: "4px dashed #e9dcc4", outlineOffset: -24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#f6efe0", letterSpacing: 6 }}>{text}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#e9dcc4", letterSpacing: 1, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>;
};

// MEJORA 4 · pantalla partida: el avatar se corre a la izquierda y a la derecha se abre la puerta del tablero con la foto adentro
export const PanelDoor: React.FC<{ src: string; seed: number; dur: number; label?: string }> = ({ src, seed, dur, label }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 14, 12); const kb = useKB(seed, dur);
  return <><div style={{ position: "absolute", left: 1040, top: 0, right: 0, bottom: 0, opacity: cl(o * 2), overflow: "hidden", boxShadow: "-16px 0 24px rgba(0,0,0,.45)" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,16,20,.78), rgba(14,16,20,.88))" }} /></div>
  <div style={{ position: "absolute", left: 1100, top: 110, width: 760, height: 860, perspective: 1800 }}>
    <div style={{ position: "absolute", inset: 0, background: "#9aa1a8", borderRadius: 10, border: "16px solid #6f767c", overflow: "hidden", opacity: cl(o * 2) }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 24px", background: "rgba(20,22,26,.85)", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: 2 }}>{label}</div>}
    </div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#c5cacf,#a9aeb3)", border: "16px solid #6f767c", borderRadius: 10, transformOrigin: "100% 50%", transform: `rotateY(${o * 105}deg)`, backfaceVisibility: "hidden" }}>
      <div style={{ position: "absolute", left: 30, top: 410, width: 40, height: 80, background: "#555", borderRadius: 6 }} />
    </div>
  </div></>;
};

// MEJORA 4/8 · recuerdo como objeto: foto sujeta en la tablilla de trabajo (clipboard) que entra desde abajo, con la nota a mano
export const Clipboard: React.FC<{ src: string; note: string; seed: number; dur: number; left?: boolean }> = ({ src, note, seed, dur, left }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 16, 12); const r = (hash(seed) % 2 ? 1 : -1) * (3 + (hash(seed + 3) % 3));
  const p = Math.min(1, f / 26);
  return <div style={{ position: "absolute", [left ? "left" : "right"]: 36, top: 230, width: 500, height: 700, transform: `translateY(${(1 - o) * 1000}px) rotate(${r}deg)` } as React.CSSProperties}>
    <div style={{ position: "absolute", inset: 0, background: "#a8763f", borderRadius: 18, boxShadow: "8px 12px 0 rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 30, right: 30, top: 70, bottom: 30, background: "#fbf8ef" }}>
      <div style={{ margin: 22, height: 390, overflow: "hidden", border: "8px solid #fff", boxShadow: "2px 3px 0 rgba(0,0,0,.2)" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ padding: "0 30px", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#1f4f8f", lineHeight: 1.05, clipPath: `inset(-20% ${100 - 100 * cl((f - 18) / 22)}% -20% 0)` }}>{note}</div>
    </div>
    <div style={{ position: "absolute", left: 150, top: 20, width: 220, height: 80, background: "linear-gradient(#d9dee2,#8d959c)", borderRadius: 12, transform: `scaleY(${0.7 + 0.3 * p})` }} />
  </div>;
};

// MEJORA 9 · dato con fuente sobre material real: la tarjeta de inspección colgada de un precinto
export const DataTag: React.FC<{ big: string; label: string; src: string; dur: number }> = ({ big, label, src, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const sw = Math.sin(f / 18) * 1.2 * o;
  return <div style={{ position: "absolute", left: 80, top: 0, opacity: cl(o * 1.5) }}>
    <div style={{ marginLeft: 120, width: 6, height: 50 * o, background: "#2a2a2a" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 26, width: 800, padding: "18px 26px", boxSizing: "border-box", background: CREAM, borderRadius: 12, border: "4px solid #c9b88f", transform: `rotate(${sw}deg)`, transformOrigin: "120px 0", boxShadow: "6px 10px 0 rgba(0,0,0,.35)", position: "relative" }}>
      <div style={{ position: "absolute", left: 108, top: -8, width: 26, height: 26, borderRadius: "50%", background: "#2a2a2a" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: big.length > 6 ? 58 : 70, color: INK, lineHeight: 1, whiteSpace: "nowrap", marginTop: 12 }}>{big}</div>
      <div style={{ borderLeft: "3px dashed #c9b88f", paddingLeft: 22, marginTop: 12 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: INK, lineHeight: 1.15 }}>{label}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#6a5a40", marginTop: 8 }}>SOURCE · {src}</div></div>
    </div>
  </div>;
};

// chip «THE SAFE WAY»: chapa de aluminio estampada, remachada en la esquina inferior
export const SafeWay: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 8, 10); const hit = cl(1 - (f - 6) / 8);
  return <div style={{ position: "absolute", left: 70, bottom: 50, opacity: o, transform: `scale(${1 + 0.08 * hit})`, transformOrigin: "0 100%" }}>
    <div style={{ padding: "18px 34px 18px 64px", background: "linear-gradient(135deg,#dfe3e6,#9aa3ab)", borderRadius: 8, border: "3px solid #7d858c", position: "relative", boxShadow: "5px 8px 0 rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: 20, top: "50%", width: 22, height: 22, marginTop: -11, borderRadius: "50%", background: "radial-gradient(#f4f4f4,#777)" }} />
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: ST }}>THE SAFE WAY</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#3c4248", textShadow: "-1px -1px 0 rgba(0,0,0,.35), 1px 1px 0 rgba(255,255,255,.7)" }}>{text}</div>
    </div>
  </div>;
};

// CTA de mitad (sin voz): el manual asoma sobre la mesada con la cinta «LINK IN DESCRIPTION»
export const MidCta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 16, 14);
  return <div style={{ position: "absolute", right: 80, bottom: 70, transform: `translateY(${(1 - o) * 520}px) rotate(-4deg)` }}>
    <div style={{ width: 400, height: 500, background: "#1f3a5f", borderRadius: "6px 14px 14px 6px", borderLeft: "26px solid #142843", boxShadow: "0 22px 30px rgba(0,0,0,.45)", padding: "40px 30px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: "#f6efe0", lineHeight: 1.05 }}>THE WINTER BLACKOUT MANUAL</div>
      <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#e9dcc4", lineHeight: 1.2 }}>station + generator: the whole plan on one page</div>
    </div>
    <div style={{ position: "absolute", left: 6, right: 6, bottom: 34, padding: "12px 0", background: YEL, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: INK, letterSpacing: 1, transform: "rotate(-3deg)", boxShadow: "0 6px 10px rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>LINK IN THE DESCRIPTION</div>
  </div>;
};
