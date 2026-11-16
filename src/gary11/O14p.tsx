// scr14a · overlays propios. PURO CSS/DOM, sin SVG, sin blur, sin grano. Nada arriba a la izquierda salvo la barra de pasos (arriba a la derecha).
// Looks nuevos (no repiten scr15a/b): regla de acero con brasa, chapa que barre con cordón de soldadura, chapa estampada a golpe de punzón,
// foto en marco soldado con prensas, etiqueta de envío manila atada con alambre, cinta de peligro amarilla y negra.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS, useKB } from "./Piezas";

const { SANS, SERIF } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const inout = (f: number, d: number, a = 10, b = 10) => interpolate(f, [0, a, d - b, d], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
const EMBER = "#ff7a1a", HOT = "#ffb347", INK = "#1b1a18", CREAM = "#efe6d2", STEEL = "linear-gradient(180deg,#c9ced3,#8d949b 55%,#6b7178)";
const STEPS = ["SCRAP LIST + COST", "MAKE THE TANK SAFE", "CUT THE BODY", "THE GRAVITY HOPPER", "GRATE + AIR", "THE COOKTOP", "CHIMNEY + WATER", "FIRST FIRE OUTSIDE", "THE THREE TESTS", "RUN IT ALL NIGHT"];

// barra de pasos: regla de acero de 10 tramos arriba a la derecha; los pasos hechos quedan pavonados, el actual se pone al rojo
export const StepRule: React.FC<{ n: number; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const glow = 0.6 + 0.4 * Math.sin(f / 6);
  return <div style={{ position: "absolute", right: 70, top: 60, opacity: o, transform: `translateX(${(1 - o) * 80}px)` }}>
    <div style={{ display: "flex", width: 880, height: 46, background: STEEL, border: "3px solid #4a4f55", borderRadius: 4, boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>
      {STEPS.map((_, i) => <div key={i} style={{ flex: 1, position: "relative", borderRight: i < 9 ? "2px solid #4a4f55" : "none",
        background: i + 1 < n ? "linear-gradient(180deg,#3d4a66,#24293a)" : i + 1 === n ? `rgba(255,${100 + glow * 40},30,${0.75 + glow * 0.25})` : "transparent" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: 14, background: "#2c3036" }} /></div>)}
    </div>
    <div style={{ marginTop: 10, marginLeft: "auto", width: "fit-content", padding: "6px 22px", background: "rgba(18,18,20,.9)", borderRadius: 6, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 2 }}>
      STEP <span style={{ color: EMBER, fontSize: 66 }}>{n}</span> / 10 · {STEPS[n - 1]}</div>
  </div>;
};

// cortina de capítulo: una chapa con foto real barre de izquierda a derecha; su borde delantero es un cordón de soldadura al rojo
export const PlateWipe: React.FC<{ dur: number; src: string }> = ({ dur, src }) => {
  const f = useCurrentFrame(); const t = interpolate(f, [0, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const x = -1920 + t * 3840;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: x, top: 0, width: 1920, height: 1080, overflow: "hidden", boxShadow: "-18px 0 26px rgba(0,0,0,.5), 18px 0 26px rgba(0,0,0,.5)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 30, background: `repeating-linear-gradient(180deg, ${HOT} 0 10px, ${EMBER} 10px 18px, #c4361a 18px 24px)`, boxShadow: `0 0 30px 8px rgba(255,122,26,.7)` }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, background: "repeating-linear-gradient(180deg,#8d949b 0 10px,#6b7178 10px 18px)" }} />
    </div>
  </AbsoluteFill>;
};

// presentación: chapa de acero donde las letras aparecen una a una a golpe de punzón, abajo a la derecha
export const StampPlate: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 10, 14); const n = Math.floor(cl((f - 6) / 34) * text.length + 0.001);
  return <div style={{ position: "absolute", right: 90, bottom: 170, opacity: o, transform: `translateY(${(1 - ou(f / 10)) * 60}px)` }}>
    <div style={{ position: "relative", padding: "30px 60px", background: STEEL, border: "4px solid #4a4f55", borderRadius: 8, boxShadow: "0 12px 0 rgba(0,0,0,.4)" }}>
      {[[14, 14], [14, -1], [-1, 14], [-1, -1]].map(([l, tp], i) => <div key={i} style={{ position: "absolute", left: l >= 0 ? l : undefined, right: l < 0 ? 14 : undefined, top: tp >= 0 ? tp : undefined, bottom: tp < 0 ? 14 : undefined, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#eef0f2,#5c6167)" }} />)}
      <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 60, color: "#3a3e44", letterSpacing: 10, whiteSpace: "nowrap", textShadow: "0 -2px 0 rgba(0,0,0,.5), 0 2px 0 rgba(255,255,255,.6)" }}>
        {text.split("").map((c, i) => <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{c}</span>)}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK, marginTop: 8, letterSpacing: 3, whiteSpace: "nowrap", opacity: cl((f - 44) / 10) }}>{sub}</div>
    </div>
  </div>;
};

// pantalla partida: el avatar se corre y a la derecha la foto entra en un marco de ángulo soldado sujeto con dos prensas
export const WeldFrame: React.FC<{ src: string; seed: number; dur: number; label?: string }> = ({ src, seed, dur, label }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 14, 12); const kb = useKB(seed, dur);
  return <><div style={{ position: "absolute", left: 1120, top: 0, right: 0, bottom: 0, opacity: cl(o * 2), background: "linear-gradient(135deg,#2a2c30,#141517)", boxShadow: "-16px 0 24px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: 1160, top: 180, width: 700, padding: 18, paddingBottom: label ? 78 : 18, background: STEEL, transform: `translateY(${(1 - o) * 900}px)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)" }}>
      <div style={{ width: 700, height: 560, overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} /></div>
      {label && <div style={{ position: "absolute", left: 18, right: 18, bottom: 14, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: INK, fontFamily: SANS, fontWeight: 900, fontSize: 38, color: HOT, whiteSpace: "nowrap" }}>{label}</div>}
      {[60, 560].map((x) => <div key={x} style={{ position: "absolute", left: x, top: -40, width: 90, height: 70, background: "#d94a1c", borderRadius: 6, boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 38, top: -40, width: 14, height: 40, background: "#9aa0a6" }} /></div>)}
    </div></>;
};

// dato con fuente: etiqueta de envío manila con ojal reforzado y alambre, abajo a la izquierda; el número se escribe con marcador
export const ShipTag: React.FC<{ big: string; label: string; src: string; dur: number }> = ({ big, label, src, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 12, 12); const rev = cl((f - 8) / 16); const sw = Math.sin(f / 9) * 2 * Math.exp(-f / 40);
  return <div style={{ position: "absolute", left: 90, bottom: 130, opacity: o, transform: `translateY(${(1 - o) * 80}px) rotate(${-2 + sw}deg)`, transformOrigin: "0 50%" }}>
    <div style={{ position: "relative", padding: "26px 44px 22px 90px", background: "linear-gradient(180deg,#e8cf98,#d9bb7c)", clipPath: "polygon(40px 0,100% 0,100% 100%,40px 100%,0 70%,0 30%)", boxShadow: "6px 10px 0 rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: 30, top: "50%", width: 34, height: 34, marginTop: -17, borderRadius: "50%", background: "#bfa067", border: "6px solid #f2e2b8" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: big.length > 8 ? 64 : 82, color: INK, lineHeight: 1, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - rev * 100}% -20% 0)` }}>{big}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: INK, marginTop: 8, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#5a4520", marginTop: 8, whiteSpace: "nowrap" }}>SOURCE · {src}</div>
    </div>
  </div>;
};

// chip de seguridad: cinta de peligro amarilla y negra que cruza abajo con el aviso en un rótulo negro
export const Hazard: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = inout(f, dur, 8, 10); const w = ou(f / 12);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, opacity: o, display: "flex", justifyContent: "center" }}>
    <div style={{ position: "absolute", left: 0, top: 22, width: `${w * 100}%`, height: 64, background: "repeating-linear-gradient(-45deg,#f2c21b 0 34px,#151515 34px 68px)", boxShadow: "0 8px 0 rgba(0,0,0,.35)" }} />
    <div style={{ position: "relative", padding: "16px 44px", background: INK, border: "6px solid #f2c21b", borderRadius: 10, fontFamily: SANS, fontWeight: 900, fontSize: 48, color: "#fff", letterSpacing: 1, whiteSpace: "nowrap", transform: `scale(${0.9 + 0.1 * w})` }}>⚠ {text}</div>
  </div>;
};
