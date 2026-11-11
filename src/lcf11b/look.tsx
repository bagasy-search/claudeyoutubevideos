// lcf11b · look 313 «cuaderno de una sola persona»: libreta espiral (hoja cuadriculada clara, anillos metálicos arriba),
// lápiz de grafito y porciones marcadas con un círculo rojo de birome. Mesada blanca gastada. Sin filtros, grano, viñeta ni temblor.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/WorkSans";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["600", "800"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const K = {
  page: "#fbfbf6", grid: "rgba(120,150,175,.22)", edge: "#e4e2d8", ring: "#9aa0a6", ringHi: "#e9ecef",
  pencil: "#3c3a37", ink: "#1f3d6b", red: "#c4302b", counter1: "#eeeae1", counter2: "#d9d3c6", tx: "#fffdf7", shadow: "rgba(30,25,15,.4)",
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
// balanceo lento de cámara en mano (permitido): deriva suave, sin temblor
export const hand = (t: number, seed: number, amp = 1) => ({
  x: amp * (6 * Math.sin(t * 0.29 + seed) + 3 * Math.sin(t * 0.67 + seed * 2)),
  y: amp * (5 * Math.sin(t * 0.23 + seed * 3) + 2 * Math.sin(t * 0.59 + seed)),
  r: amp * 0.15 * Math.sin(t * 0.19 + seed),
});

// mesada de fórmica blanca gastada, luz de ventana desde la izquierda
export const Counter: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, ${K.counter1}, ${K.counter2})` }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(35deg, rgba(120,110,90,.035) 0 3px, transparent 3px 11px), repeating-linear-gradient(-55deg, rgba(255,255,255,.18) 0 1px, transparent 1px 17px)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 75% at ${16 + 3 * Math.sin(t * 0.1)}% 28%, rgba(255,246,222,.55), transparent 72%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "linear-gradient(180deg,#b9b4a8,#8f897c)" }} />
  </AbsoluteFill>
);

// fondo = foto del momento desenfocada (para piezas sobre el video)
export const BlurBg: React.FC<{ src?: string | null; t: number; dim?: number }> = ({ src, t, dim = 0.3 }) => (
  <AbsoluteFill style={{ background: "#2b241b", overflow: "hidden" }}>
    {src && <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px)", transform: `scale(${1.15 + 0.01 * t})` }} />}
    <AbsoluteFill style={{ background: "#16110b", opacity: dim }} />
  </AbsoluteFill>
);

// hoja de libreta espiral: cuadrícula celeste, anillos arriba, borde perforado
export const NotePage: React.FC<{ w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; rings?: boolean }> = ({ w, h, children, style, rings = true }) => {
  const n = Math.floor((w - 80) / 46);
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <div style={{ position: "absolute", inset: 0, background: K.page, borderRadius: "4px 4px 6px 6px", boxShadow: `0 26px 60px ${K.shadow}, 0 2px 0 ${K.edge}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, top: 70, background: `repeating-linear-gradient(0deg, ${K.grid} 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, ${K.grid} 0 2px, transparent 2px 40px)` }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 30% 20%, rgba(255,255,255,.4), transparent 70%)" }} />
        {rings && Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + i * 46, top: 26, width: 16, height: 16, borderRadius: 8, background: "#5c5850", opacity: 0.55 }} />)}
        {children}
      </div>
      {rings && Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 47 + i * 46, top: -22, width: 22, height: 58, borderRadius: 11, border: `5px solid ${K.ring}`, borderBottomColor: "transparent",
          boxShadow: `inset 2px 0 0 ${K.ringHi}`, transform: "rotate(-6deg)" }} />
      ))}
    </div>
  );
};

// círculo de birome roja alrededor de una porción (se dibuja)
export const Ring: React.FC<{ k: number; w?: number; h?: number }> = ({ k, w = 150, h = 62 }) => (
  <div style={{ position: "absolute", left: -12, top: -8, width: w, height: h, borderRadius: "50%", border: `4px solid ${K.red}`, transform: "rotate(-4deg)",
    clipPath: `polygon(0 0, ${k * 100}% 0, ${k * 100}% 100%, 0 100%)`, opacity: k > 0 ? 0.9 : 0 }} />
);
