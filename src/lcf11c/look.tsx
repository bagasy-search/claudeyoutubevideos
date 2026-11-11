// lcf11c · look 313 «la libreta de una sola persona»: hoja de libreta con espiral a la izquierda, renglón gris claro, lápiz de grafito,
// clips de oficina en vez de cinta, mesada laminada blanca gastada. Sin filtros, grano, viñeta ni temblor (sí balanceo lento de cámara en mano).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Kalam";
import { loadFont as loadSerif } from "@remotion/google-fonts/Lora";
import { loadFont as loadSans } from "@remotion/google-fonts/Nunito";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["400", "700"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["600"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const K = {
  card: "#fbfbf7", cardEdge: "#dcdcd4", rule: "#c9ced6", margin: "#d9a0a0", ink: "#2b2b2e", pencil: "#4a4a48",
  tape: "#b9bec4", wood1: "#ecebe6", wood2: "#d9d6cd", red: "#c0392b", tx: "#ffffff", shadow: "rgba(25,25,20,.38)",
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eOut = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
export const eIO = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// resorte con masa (llega, se pasa un poco y asienta)
export const spr = (t: number, a: number, w = 8, z = 0.5) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
export const sf = (p: string) => staticFile(p);

// balanceo lento de cámara en mano (permitido): deriva suave, sin temblor
export const hand = (t: number, seed: number, amp = 1) => ({
  x: amp * (7 * Math.sin(t * 0.31 + seed) + 3 * Math.sin(t * 0.73 + seed * 2)),
  y: amp * (5 * Math.sin(t * 0.27 + seed * 3) + 2 * Math.sin(t * 0.61 + seed)),
  r: amp * 0.18 * Math.sin(t * 0.21 + seed),
});

// mesada laminada blanca gastada vista desde arriba (motas finas), luz de ventana desde la izquierda
export const Wood: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, ${K.wood1}, ${K.wood2})` }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 30%, rgba(120,110,95,.08) 0 1px, transparent 2px) 0 0/23px 19px, radial-gradient(circle at 70% 60%, rgba(120,110,95,.07) 0 1px, transparent 2px) 0 0/31px 27px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at ${16 + 3 * Math.sin(t * 0.1)}% 25%, rgba(255,250,235,.55), transparent 70%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 90% at 50% 45%, transparent 60%, rgba(60,55,45,.22))" }} />
    {dark > 0 && <AbsoluteFill style={{ background: "#14120e", opacity: dark }} />}
  </AbsoluteFill>
);

// fondo = la foto del momento, desenfocada y cálida (para piezas que van "sobre" el video)
export const BlurBg: React.FC<{ src?: string | null; t: number; dim?: number }> = ({ src, t, dim = 0.35 }) => (
  <AbsoluteFill style={{ background: "#2a1c10", overflow: "hidden" }}>
    {src && <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) saturate(.9)", transform: `scale(${1.15 + 0.01 * t})` }} />}
    <AbsoluteFill style={{ background: "#1b1007", opacity: dim }} />
  </AbsoluteFill>
);

// clip de oficina metálico (sujeta la hoja; reemplaza la cinta del 370)
export const Tape: React.FC<{ x: number; y: number; w?: number; rot?: number; o?: number }> = ({ x, y, w = 150, rot = -8, o = 1 }) => {
  const L = Math.max(70, Math.min(120, w * 0.6));
  return <svg width={40} height={L + 10} style={{ position: "absolute", left: x - 20, top: y - 34, transform: `rotate(${rot * 0.5}deg)`, opacity: o, filter: "drop-shadow(0 3px 3px rgba(0,0,0,.3))" }}>
    <path d={`M12,${L} L12,12 A8,8 0 0 1 28,12 L28,${L - 14} A5,5 0 0 1 18,${L - 14} L18,20`} fill="none" stroke="#8d939a" strokeWidth={3.2} strokeLinecap="round" />
  </svg>;
};

// hoja de libreta con espiral a la izquierda (la base del look 313)
export const IndexCard: React.FC<{ w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; lineGap?: number; top?: number }> = ({ w, h, children, style, lineGap = 46, top = 120 }) => {
  const rings = Math.floor((h - 40) / 46);
  return <div style={{ position: "relative", width: w, height: h, background: K.card, borderRadius: "4px 8px 8px 4px", boxShadow: `0 26px 56px ${K.shadow}, 0 2px 0 ${K.cardEdge}`, ...style }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: top + lineGap - 6, bottom: 12, background: `repeating-linear-gradient(180deg, transparent 0 ${lineGap - 2}px, ${K.rule} ${lineGap - 2}px ${lineGap}px)`, opacity: 0.9 }} />
    <div style={{ position: "absolute", left: 92, top: 0, bottom: 0, width: 2, background: K.margin, opacity: 0.55 }} />
    {Array.from({ length: rings }, (_, i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 26, top: 30 + i * 46, width: 16, height: 16, borderRadius: 8, background: "#cfccc3", boxShadow: "inset 0 2px 3px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: -18, top: 26 + i * 46, width: 52, height: 22, borderRadius: 11, border: "4px solid #9aa0a6", borderRightColor: "#c9ced3", boxShadow: "0 2px 2px rgba(0,0,0,.25)" }} />
    </React.Fragment>)}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 30% 20%, rgba(255,255,255,.35), transparent 70%)", pointerEvents: "none" }} />
    {children}
  </div>;
};
