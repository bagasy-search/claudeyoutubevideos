// serie Peggy (02-07) · "Peggy's London" — look "grandes almacenes de Londres, 1960": tarjeta crema de la tienda con filete de latón,
// verde inglés, borgoña y lápiz (Playfair Display + Jost + Caveat). Todo es función pura de t (segundos): el farm rinde en chunks.
// Los datos de cada video entran por setData() desde su index_<slug>.tsx (una sola rama para toda la serie).
import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Jost";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

export const SERIF = loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin"] });
export const SANS = loadSans("normal", { weights: ["300", "400", "500"], subsets: ["latin"] }).fontFamily;
export const HAND = loadHand("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

type Data = Record<string, any> & {
  slug: string; end: number; fr: number[]; items: { n: number; t: string; sub?: string; f: string }[]; bg?: string; mapa?: string;
  shots: { s: number; e: number; k: string; f?: string; sc?: string; arg?: string; tr?: string; len?: number; off?: number; rate?: number; mods?: { a: number; b: number; k: string; f?: string }[] }[];
  ov: ({ k: string; a: number; b: number } & Record<string, unknown>)[];
};
export let D = { slug: "", end: 1, fr: [], items: [], shots: [], ov: [] } as unknown as Data;
export let P = "";
export const setData = (d: unknown) => { D = d as Data; P = D.slug + "/"; };
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);

// claves heredadas de la serie base: washi = papel crema · sumi = tinta · hanko = borgoña · ai = verde inglés · bamboo = latón
export const C = { washi: "#F5EFE3", washi2: "#E9DFCC", sumi: "#1F1B17", kinari: "#E8D6B0", ai: "#1F4433", cha: "#7b4b2a", nezumi: "#8c8b87", hanko: "#7C1F2C", bamboo: "#A9843F", line: "rgba(31,27,23,.18)" };
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const out3 = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const eo = (t: number, a: number, d: number) => out3((t - a) / d);
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const swing = (t: number, a: number, amp = 9, k = 2.0, w = 7) => (t < a ? 0 : amp * Math.exp(-k * (t - a)) * Math.sin(w * (t - a)));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const h = (n: number, k: number) => {
  let x = Math.imul(n + 1, 2654435761 | 0) ^ Math.imul(k + 7, 40503);
  x = Math.imul(x ^ (x >>> 15), 2246822519 | 0);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
};

// tarjeta de la tienda: crema con trama fina de papel verjurado (sólo degradés: nada de feTurbulence, que traba el farm) y doble filete de latón
export const Washi: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = C.washi }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, #FFFCF5 0%, ${tone} 55%, ${C.washi2} 100%)`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(120,95,50,.05) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(120,95,50,.035) 0 1px, transparent 1px 38px)" }} />
    <div style={{ position: "absolute", inset: 26, border: `2px solid ${C.bamboo}`, opacity: 0.75 }} />
    <div style={{ position: "absolute", inset: 36, border: `1px solid ${C.bamboo}`, opacity: 0.5 }} />
    {children}
  </AbsoluteFill>
);

// sello de goma redondo de la tienda (borgoña): cae, aplasta y deja tinta despareja
export const Hanko: React.FC<{ t: number; at: number; x: number; y: number; size?: number; txt?: string; rot?: number }> = ({ t, at, x, y, size = 150, txt = "1", rot = -8 }) => {
  if (t < at - 0.2) return null;
  const p = eo(t, at - 0.2, 0.2), sc = lerp(2.1, 1, p) * (1 + 0.06 * Math.exp(-9 * Math.max(0, t - at)) * Math.sin(40 * Math.max(0, t - at)));
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", border: `${size * 0.05}px solid ${C.hanko}`, color: C.hanko,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p * 0.93, transform: `rotate(${rot}deg) scale(${sc.toFixed(4)})`, mixBlendMode: "multiply",
    boxShadow: `inset 0 0 0 ${size * 0.035}px ${C.washi}, inset 0 0 0 ${size * 0.05}px ${C.hanko}`, WebkitMaskImage: "radial-gradient(circle at 30% 25%, #000 55%, rgba(0,0,0,.72) 100%)" }}>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * 0.1, letterSpacing: "0.28em", marginLeft: "0.28em" }}>No.</div>
    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size * (String(txt).length > 1 ? 0.42 : 0.5), lineHeight: 0.95 }}>{txt}</div>
  </div>;
};

// trazo de lápiz / tiza de sastre que se dibuja de izquierda a derecha
export const Pincel: React.FC<{ t: number; at: number; dur?: number; x: number; y: number; w: number; hgt?: number; rot?: number; col?: string; op?: number }> = ({ t, at, dur = 0.35, x, y, w, hgt = 14, rot = 0, col = C.sumi, op = 0.9 }) => {
  const p = eo(t, at, dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: hgt, transformOrigin: "0 50%", transform: `rotate(${rot}deg)`, opacity: op }}>
    <div style={{ width: `${p * 100}%`, height: "100%", background: col, borderRadius: hgt, WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 78%,rgba(0,0,0,.55) 92%,transparent 100%)" }} />
  </div>;
};

// texto que entra palabra por palabra (sube 18 px y aparece)
export const Palabras: React.FC<{ t: number; at: number; txt: string; gap?: number; style?: React.CSSProperties }> = ({ t, at, txt, gap = 0.13, style }) => (
  <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
    {String(txt).split(" ").map((w, i) => { const p = eo(t, at + i * gap, 0.38); return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>{w}</span>; })}
  </div>
);

// paño de lana (trama de sarga por CSS) para los cambios de capítulo y las hojas de las puertas
export const tela = (col: string, claro = false): React.CSSProperties => ({
  backgroundColor: col,
  backgroundImage: `repeating-linear-gradient(45deg, rgba(${claro ? "90,70,40" : "255,255,255"},.06) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.07) 0 2px, transparent 2px 6px), radial-gradient(120% 100% at 20% 0%, rgba(255,255,255,.14), transparent 60%)`,
});
