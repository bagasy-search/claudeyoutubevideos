// swl11b · look 370 «caja de recetas de casa»: fichas rayadas (renglón azul, margen rojo), cinta de papel, mesa de madera clara,
// tinta de lapicera. Serif fina + sans + letra a mano. Sin filtros, grano, viñeta ni temblor (sí el balanceo lento de cámara en mano).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700", "900"], subsets: ["latin"] });

export const K = {
  card: "#fdfaf1", cardEdge: "#e9e0c9", rule: "#9cc3e6", margin: "#e2747a", ink: "#23324f", pencil: "#3b3b3b",
  tape: "rgba(236,222,170,.82)", wood1: "#c89a68", wood2: "#a87a4c", red: "#b8323a", tx: "#fffaf0", shadow: "rgba(40,22,8,.45)",
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

// mesa de madera clara vista desde arriba, con luz de ventana que entra desde la izquierda
export const Wood: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.wood1}, ${K.wood2})` }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(90,52,20,.16) 0 2px, transparent 2px 190px), repeating-linear-gradient(90deg, transparent 0 31px, rgba(255,235,200,.06) 31px 33px, transparent 33px 71px), repeating-linear-gradient(0deg, transparent 0 7px, rgba(90,52,20,.035) 7px 8px)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at ${18 + 3 * Math.sin(t * 0.1)}% 30%, rgba(255,240,205,.38), transparent 70%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 90% at 50% 45%, transparent 55%, rgba(50,25,8,.38))" }} />
    {dark > 0 && <AbsoluteFill style={{ background: "#120a04", opacity: dark }} />}
  </AbsoluteFill>
);

// fondo = la foto del momento, desenfocada y cálida (para piezas que van "sobre" el video)
export const BlurBg: React.FC<{ src?: string | null; t: number; dim?: number }> = ({ src, t, dim = 0.35 }) => (
  <AbsoluteFill style={{ background: "#2a1c10", overflow: "hidden" }}>
    {src && <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) saturate(.9)", transform: `scale(${1.15 + 0.01 * t})` }} />}
    <AbsoluteFill style={{ background: "#1b1007", opacity: dim }} />
  </AbsoluteFill>
);

// tira de cinta de papel (washi crema) con bordes rasgados
export const Tape: React.FC<{ x: number; y: number; w?: number; rot?: number; o?: number }> = ({ x, y, w = 150, rot = -8, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - 20, width: w, height: 40, background: K.tape, transform: `rotate(${rot}deg)`, opacity: o,
    boxShadow: "0 2px 4px rgba(0,0,0,.12)", clipPath: "polygon(2% 8%, 98% 0%, 100% 30%, 97% 62%, 100% 100%, 3% 92%, 0% 60%, 3% 30%)" }} />
);

// ficha rayada 5x3 (la base del look 370)
export const IndexCard: React.FC<{ w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; lineGap?: number; top?: number }> = ({ w, h, children, style, lineGap = 46, top = 120 }) => (
  <div style={{ position: "relative", width: w, height: h, background: K.card, borderRadius: 6, boxShadow: `0 28px 60px ${K.shadow}, 0 2px 0 ${K.cardEdge}`, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: top - 6, height: 3, background: K.margin, opacity: 0.85 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: top + lineGap - 6, bottom: 0, background: `repeating-linear-gradient(180deg, transparent 0 ${lineGap - 2}px, ${K.rule} ${lineGap - 2}px ${lineGap}px)`, opacity: 0.8 }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 30% 20%, rgba(255,255,255,.35), transparent 70%), linear-gradient(180deg, transparent 85%, rgba(160,130,80,.08))" }} />
    {children}
  </div>
);
