// swl11c · look 370 «libro de cuentas de la cocina»: hoja de libro contable (renglones verdes pálidos, doble línea roja de la columna de centavos),
// tinta azul de birome y lápiz, regla de madera. Mesa de madera de su cocinita. Sin filtros, grano, viñeta ni temblor.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Kalam";
import { loadFont as loadSerif } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadType } from "@remotion/google-fonts/CourierPrime";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const { fontFamily: TYPE } = loadType("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const K = {
  page: "#f3f1e2", rule: "rgba(92,140,110,.33)", head: "rgba(52,96,140,.55)", red: "#b8322c", ink: "#20386b", pencil: "#3d3a35",
  wood1: "#6b4a2f", wood2: "#4c331f", green: "#2f5e46", copper: "#b87333", shadow: "rgba(25,15,5,.45)", tag: "#e9d6a6",
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eOut = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
export const eIO = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const spr = (t: number, a: number, w = 8, z = 0.5) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
export const sf = (p: string) => staticFile(p);
export const drift = (t: number, seed: number, amp = 1) => ({
  x: amp * (5 * Math.sin(t * 0.27 + seed) + 2 * Math.sin(t * 0.61 + seed * 2)),
  y: amp * (4 * Math.sin(t * 0.21 + seed * 3) + 2 * Math.sin(t * 0.53 + seed)),
});

// mesa de madera de la cocinita (vetas), luz de la ventana de cortinas amarillas desde arriba a la izquierda
export const Table: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.wood1}, ${K.wood2})` }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(2deg, rgba(0,0,0,.06) 0 2px, transparent 2px 23px), repeating-linear-gradient(-1deg, rgba(255,220,170,.05) 0 1px, transparent 1px 41px)" }} />
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, transparent 0 318px, rgba(20,10,0,.35) 318px 322px)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 70% at ${20 + 2 * Math.sin(t * 0.1)}% 18%, rgba(255,226,150,.38), transparent 70%)` }} />
  </AbsoluteFill>
);

export const BlurBg: React.FC<{ src?: string | null; t: number; dim?: number }> = ({ src, t, dim = 0.3 }) => (
  <AbsoluteFill style={{ background: "#2b241b", overflow: "hidden" }}>
    {src && <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px)", transform: `scale(${1.15 + 0.01 * t})` }} />}
    <AbsoluteFill style={{ background: "#16110b", opacity: dim }} />
  </AbsoluteFill>
);

// hoja de libro de cuentas: renglones verdes cada 56 px, encabezado azul, doble línea roja que separa la columna de centavos (a la derecha)
export const LEDGER_ROW = 56;
export const Ledger: React.FC<{ w: number; h: number; money?: number; children?: React.ReactNode; style?: React.CSSProperties; top?: number }> = ({ w, h, money = 260, children, style, top = 150 }) => (
  <div style={{ position: "relative", width: w, height: h, ...style }}>
    <div style={{ position: "absolute", inset: 0, background: K.page, borderRadius: 3, boxShadow: `0 28px 60px ${K.shadow}, 0 3px 0 #ddd9c4`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, background: `repeating-linear-gradient(180deg, transparent 0 ${LEDGER_ROW - 2}px, ${K.rule} ${LEDGER_ROW - 2}px ${LEDGER_ROW}px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top - 6, height: 4, background: K.head }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 96, width: 2, background: "rgba(184,50,44,.45)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: money, width: 7, borderLeft: "2px solid rgba(184,50,44,.55)", borderRight: "2px solid rgba(184,50,44,.55)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: money / 2.6, width: 2, background: "rgba(92,140,110,.35)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 25% 15%, rgba(255,255,255,.35), transparent 70%)" }} />
      {children}
    </div>
  </div>
);

// regla de madera con marcas en pulgadas (guía de lectura que baja renglón por renglón)
export const Ruler: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <div style={{ position: "absolute", width: w, height: 54, background: "linear-gradient(180deg,#d9b479,#c39a5c)", borderRadius: 3, boxShadow: "0 10px 18px rgba(0,0,0,.35)", overflow: "hidden", ...style }}>
    {Array.from({ length: Math.floor(w / 24) }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 10 + i * 24, top: 0, width: 2, height: i % 4 === 0 ? 22 : i % 2 ? 9 : 14, background: "rgba(50,30,10,.7)" }} />
    ))}
  </div>
);
