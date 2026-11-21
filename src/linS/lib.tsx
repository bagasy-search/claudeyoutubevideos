// serie Linda (lin16) · "Linda, Retired Flight Attendant" — look "cabina de 1985": pase de abordar crema, azul cabina, rojo de aerolínea,
// latón de las alas del uniforme y birome (Playfair Display + Jost + Caveat). Todo es función pura de t (segundos): el farm rinde en chunks.
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
  slug: string; end: number; fr: number[]; items: { n: number; t: string; sub?: string; f: string; lado?: string; top?: number }[]; bg?: string; mapa?: string;
  shots: { s: number; e: number; k: string; f?: string; sc?: string; arg?: string; tr?: string; len?: number; cz?: number; off?: number; rate?: number; mods?: { a: number; b: number; k: string; f?: string }[] }[];
  ov: ({ k: string; a: number; b: number } & Record<string, unknown>)[];
};
export let D = { slug: "", end: 1, fr: [], items: [], shots: [], ov: [] } as unknown as Data;
export let P = "";
export const setData = (d: unknown) => { D = d as Data; P = D.slug + "/"; };
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);

// claves heredadas de la serie base: washi = pase de abordar crema · sumi = tinta azul marino · hanko = rojo aerolínea · ai = azul cabina · bamboo = latón de las alas
export const C = { washi: "#F7F2E6", washi2: "#E8E0CC", sumi: "#14213D", kinari: "#E6D7B4", ai: "#1E3A5F", cha: "#7b4b2a", nezumi: "#7d8590", hanko: "#B3261E", bamboo: "#B08D45", line: "rgba(20,33,61,.18)" };
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

// pase de abordar: crema con trama fina de cartulina (sólo degradés: nada de feTurbulence, que traba el farm) y doble filete de latón
export const Washi: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = C.washi }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, #FFFCF5 0%, ${tone} 55%, ${C.washi2} 100%)`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(120,95,50,.05) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(120,95,50,.035) 0 1px, transparent 1px 38px)" }} />
    <div style={{ position: "absolute", inset: 26, border: `2px solid ${C.bamboo}`, opacity: 0.75 }} />
    <div style={{ position: "absolute", inset: 36, border: `1px solid ${C.bamboo}`, opacity: 0.5 }} />
    {children}
  </AbsoluteFill>
);

// sello de control redondo (rojo de aerolínea): cae, aplasta y deja tinta despareja
export const Hanko: React.FC<{ t: number; at: number; x: number; y: number; size?: number; txt?: string; rot?: number; bl?: boolean }> = ({ t, at, x, y, size = 150, txt = "1", rot = -8, bl = true }) => {
  if (t < at - 0.2) return null;
  const p = eo(t, at - 0.2, 0.2), sc = lerp(2.1, 1, p) * (1 + 0.06 * Math.exp(-9 * Math.max(0, t - at)) * Math.sin(40 * Math.max(0, t - at)));
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", border: `${size * 0.05}px solid ${C.hanko}`, color: C.hanko,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p * 0.93, transform: `rotate(${rot}deg) scale(${sc.toFixed(4)})`, mixBlendMode: bl ? "multiply" : "normal", background: bl ? undefined : "rgba(255,250,240,.9)",
    boxShadow: `inset 0 0 0 ${size * 0.035}px ${C.washi}, inset 0 0 0 ${size * 0.05}px ${C.hanko}`, WebkitMaskImage: "radial-gradient(circle at 30% 25%, #000 55%, rgba(0,0,0,.72) 100%)" }}>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * 0.1, letterSpacing: "0.28em", marginLeft: "0.28em" }}>No.</div>
    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size * (String(txt).length > 1 ? 0.42 : 0.5), lineHeight: 0.95 }}>{txt}</div>
  </div>;
};

// trazo de birome que se dibuja de izquierda a derecha
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

// tapizado de asiento de avión (trama de sarga por CSS) para los cambios de capítulo y los paneles de la cabina
export const tela = (col: string, claro = false): React.CSSProperties => ({
  backgroundColor: col,
  backgroundImage: `repeating-linear-gradient(45deg, rgba(${claro ? "90,70,40" : "255,255,255"},.06) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.07) 0 2px, transparent 2px 6px), radial-gradient(120% 100% at 20% 0%, rgba(255,255,255,.14), transparent 60%)`,
});

// tablero de partidas de aeropuerto (split-flap): cada letra es una paleta negra que gira por otras letras y se clava en la suya con un rebote
const POOL = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
export const Flap: React.FC<{ t: number; at: number; txt: string; H?: number; gap?: number; col?: string; fl?: number; out?: number }> = ({ t, at, txt, H = 140, gap = 0.055, col = "#F6E7BE", fl: FL = 0.065, out = 1e9 }) => (
  <div style={{ display: "flex", gap: H * 0.05 }}>
    {String(txt).toUpperCase().split("").map((c, i) => {
      if (c === " ") return <div key={i} style={{ width: H * 0.28 }} />;
      const st = at + i * gap, k = t - st, nf = c.match(/[A-Z0-9]/) ? 1 + Math.floor(h(i, 11) * 2) : 0, fl = FL;
      const fi = Math.floor(Math.max(0, k) / fl), ko = t - out - i * 0.03, saliendo = ko > 0, fo = Math.floor(Math.max(0, ko) / fl), vacio = saliendo && fo >= 3;
      const girando = (k >= 0 && fi < nf) || (saliendo && !vacio), ch = vacio ? "" : girando ? POOL[(Math.floor(h(i, 3) * 97) + (saliendo ? fo + 5 : fi) * 7) % POOL.length] : c;
      const fase = girando ? ((saliendo ? ko : k) % fl) / fl : 0, asentado = k - nf * fl, reb = asentado > 0 ? 1 + 0.08 * Math.exp(-14 * asentado) * Math.sin(38 * asentado) : 1;
      const ap = eo(t, st - 0.12, 0.14);
      return <div key={i} style={{ position: "relative", width: H * 0.66, height: H, borderRadius: H * 0.06, opacity: ap, transform: `translateY(${(1 - ap) * -14}px)`,
        background: "linear-gradient(180deg,#2a2c31 0%,#1b1c20 49.5%,#0c0d0f 50.5%,#1d1e22 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 6px 14px rgba(0,0,0,.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: H * 0.74, color: col, lineHeight: 1,
          transform: `scaleY(${girando ? Math.max(0.08, Math.abs(Math.cos(fase * Math.PI))) : reb})`, textShadow: `0 0 ${H * 0.12}px rgba(246,200,110,.35)` }}>{ch}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: Math.max(2, H * 0.018), background: "rgba(0,0,0,.85)" }} />
        <div style={{ position: "absolute", left: 0, top: "44%", width: H * 0.05, height: "12%", background: "#3a3c42" }} /><div style={{ position: "absolute", right: 0, top: "44%", width: H * 0.05, height: "12%", background: "#3a3c42" }} />
      </div>;
    })}
  </div>
);
// marco del tablero
export const Tablero: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "linear-gradient(180deg,#14161a,#08090b)", padding: "22px 26px", borderRadius: 14, border: "2px solid #2e3137", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)", ...style }}>{children}</div>
);
