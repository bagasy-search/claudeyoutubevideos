// hk14: kit CSS/DOM de len14 (Lenny). Materiales del oficio en CSS puro (madera, azulejo, papel, corcho, acero, tela, tiza),
// escenario 3D con perspective/translateZ. Sin SVG, sin filter blur grande, sin backdrop-filter, sin feTurbulence.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade } from "./kit";
export { K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, useFade };

export type H = React.FC<{ dur: number; src?: string; v?: number }>;
export const F: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => { const o = useFade(dur); return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>; };

// ---------- materiales
export const WOOD: React.CSSProperties = {
  backgroundColor: "#8a5a34",
  backgroundImage: "repeating-linear-gradient(92deg, rgba(60,30,10,0.18) 0 3px, transparent 3px 22px), repeating-linear-gradient(88deg, rgba(255,220,170,0.10) 0 1px, transparent 1px 9px), linear-gradient(180deg, #9b6a40, #6e4424)",
};
export const PALEWOOD: React.CSSProperties = {
  backgroundColor: "#c9a272",
  backgroundImage: "repeating-linear-gradient(90deg, rgba(120,80,40,0.16) 0 2px, transparent 2px 18px), linear-gradient(180deg, #d8b585, #b98d5c)",
};
export const TILE: React.CSSProperties = {
  backgroundColor: "#b7d8c8",
  backgroundImage: "linear-gradient(rgba(255,255,255,0.85) 3px, transparent 3px), linear-gradient(90deg, rgba(255,255,255,0.85) 3px, transparent 3px), radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35), transparent 60%)",
  backgroundSize: "120px 120px, 120px 120px, 100% 100%",
};
export const PAPER: React.CSSProperties = { backgroundColor: "#f4ecd9", backgroundImage: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.6), rgba(160,130,80,0.15) 100%)" };
export const CORK: React.CSSProperties = {
  backgroundColor: "#b98a55",
  backgroundImage: "radial-gradient(circle at 20% 30%, rgba(90,55,20,0.5) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(90,55,20,0.4) 0 2px, transparent 3px), radial-gradient(circle at 45% 85%, rgba(240,200,140,0.5) 0 2px, transparent 3px)",
  backgroundSize: "23px 19px, 31px 27px, 17px 29px",
};
export const STEEL: React.CSSProperties = { backgroundColor: "#9aa3a8", backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 4px), linear-gradient(180deg, #b9c1c5, #7d868b)" };
export const PEG: React.CSSProperties = {
  backgroundColor: "#c49a6a",
  backgroundImage: "radial-gradient(circle, #3a2614 0 7px, transparent 8px), linear-gradient(180deg, #cfa676, #b48a5a)",
  backgroundSize: "60px 60px, 100% 100%",
};
export const CHALK: React.CSSProperties = { backgroundColor: "#2f3a33", backgroundImage: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.08), transparent 70%)" };
export const CLOTH: React.CSSProperties = {
  backgroundColor: "#efe6cf",
  backgroundImage: "repeating-linear-gradient(0deg, rgba(120,100,60,0.12) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(120,100,60,0.12) 0 1px, transparent 1px 6px)",
};
export const NIGHT: React.CSSProperties = { background: "radial-gradient(ellipse at 50% 30%, #1d2a3d, #0b111b)" };

// ---------- piezas
export const Box: React.FC<{ x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; z?: number; r?: number; o?: number }> = ({ x, y, w, h, style, children, z = 0, r = 0, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateZ(${z}px) rotate(${r}deg)`, opacity: o, ...style }}>{children}</div>
);
export const Tx: React.FC<{ x: number; y: number; w?: number; s?: number; c?: string; f?: string; wt?: number; a?: "left" | "center" | "right"; o?: number; ls?: number; children: React.ReactNode; z?: number }> = ({ x, y, w = 1600, s = 60, c = K.ink, f = SANS, wt = 800, a = "center", o = 1, ls = 0, children, z = 0 }) => (
  <div style={{ position: "absolute", left: a === "center" ? x - w / 2 : a === "right" ? x - w : x, top: y, width: w, textAlign: a, fontFamily: f, fontWeight: wt, fontSize: s, color: c, opacity: o, letterSpacing: ls, lineHeight: 1.08, transform: `translateZ(${z}px)` }}>{children}</div>
);
/** escenario 3D: la cámara inclina y se mueve lento */
export const Stage: React.FC<{ rx?: number; ry?: number; persp?: number; bg?: React.CSSProperties; children: React.ReactNode }> = ({ rx = 0, ry = 0, persp = 1600, bg, children }) => (
  <AbsoluteFill style={{ perspective: persp, overflow: "hidden", ...(bg || {}) }}>
    <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
/** tarjeta de papel con sombra de contacto */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; r?: number; z?: number; o?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, r = 0, z = 0, o = 1, children, style }) => (
  <Box x={x} y={y} w={w} h={h} r={r} z={z} o={o} style={{ ...PAPER, borderRadius: 6, boxShadow: "0 18px 30px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.3)", ...style }}>{children}</Box>
);
/** chinche/clavo */
export const Pin: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = K.red }) => (
  <div style={{ position: "absolute", left: x - 14, top: y - 14, width: 28, height: 28, borderRadius: 14, background: `radial-gradient(circle at 35% 35%, #fff8, ${c} 45%, #0006)`, boxShadow: "3px 5px 6px rgba(0,0,0,0.4)" }} />
);
/** sello de goma estampado */
export const Rubber: React.FC<{ t: number; at: number; x: number; y: number; text: string; c?: string; r?: number; s?: number }> = ({ t, at, x, y, text, c = K.red, r = -8, s = 64 }) => {
  const p = pr(t, at, at + 0.25); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${lerp(1.8, 1, eout(p))})`, opacity: p, border: `7px solid ${c}`, borderRadius: 10, padding: "6px 26px", color: c, fontFamily: SANS, fontWeight: 900, fontSize: s, letterSpacing: 4, whiteSpace: "nowrap" }}>{text}</div>;
};
/** foto real (plano anterior) recortada como recuadro de papel */
export const PhotoPrint: React.FC<{ src?: string; x: number; y: number; w: number; h: number; r?: number; z?: number }> = ({ src, x, y, w, h, r = 0, z = 0 }) => (
  <Box x={x} y={y} w={w} h={h} r={r} z={z} style={{ background: "#fffaf0", padding: 16, boxShadow: "0 20px 34px rgba(0,0,0,0.4)" }}>
    {src && !src.endsWith(".mp4") ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#ccc" }} />}
  </Box>
);
export const chain = (n: number, w = 16) => Array.from({ length: n }, (_, i) => (
  <div key={i} style={{ width: w, height: w * 1.6, border: `4px solid #8c9196`, borderRadius: w, marginTop: -w * 0.45, transform: `rotateY(${i % 2 ? 90 : 0}deg)`, boxSizing: "border-box" }} />
));
