// serie Setsuko (02-07) · "Setsuko's Kyoto Wardrobe" — piezas base del look: papel washi, tinta sumi, una serif fina (Shippori Mincho) + una sans (Jost),
// y la paleta de los cinco neutros que ella nombra. Todo es función pura de t (segundos): el farm rinde en chunks.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/ShipporiMincho";
import { loadFont as loadSans } from "@remotion/google-fonts/Jost";
import DATA from "./data.json";

// sólo los subconjuntos que cubren los kanji usados (墨生成り藍茶鼠一…十掟店京都室町鴨川東山西陣藍染成人の日月…): 25 de 122
const JP = ["[80]","[117]","[115]","[119]","[78]","[104]","[5]","[105]","[61]","[113]","[112]","[110]","[76]","[114]","[106]","[116]","[111]","[107]","[102]","[95]","[96]","[101]","[118]","[87]","[97]"];
export const SERIF = loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", ...((DATA as any).jp || JP)] as never }).fontFamily;
export const SANS = loadSans("normal", { weights: ["300", "400", "500"], subsets: ["latin"] }).fontFamily;

export const P = (DATA as any).slug + "/";
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const D = DATA as unknown as Record<string, any> & {
  slug: string; end: number; fr: number[]; items: { n: number; t: string; sub?: string; f: string; kan?: string }[]; bg?: string; mapa?: string;
  shots: { s: number; e: number; k: string; f?: string; sc?: string; arg?: string; tr?: string; len?: number; off?: number; rate?: number; mods?: { a: number; b: number; k: string; f?: string }[] }[];
  ov: ({ k: string; a: number; b: number } & Record<string, unknown>)[];
};
export const FR = (k: number) => D.fr[k];

export const C = { washi: "#f2ede2", washi2: "#e8e1d2", sumi: "#1e1c1a", kinari: "#e6dcc4", ai: "#1f3a5f", cha: "#7b4b2a", nezumi: "#8c8b87", hanko: "#b3372a", bamboo: "#b99a5b", line: "rgba(30,28,26,.18)" };
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const out3 = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const eo = (t: number, a: number, d: number) => out3((t - a) / d);
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const swing = (t: number, a: number, amp = 9, k = 2.0, w = 7) => (t < a ? 0 : amp * Math.exp(-k * (t - a)) * Math.sin(w * (t - a)));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
// hash entero (el seno con semillas grandes se correlaciona)
export const h = (n: number, k: number) => {
  let x = Math.imul(n + 1, 2654435761 | 0) ^ Math.imul(k + 7, 40503);
  x = Math.imul(x ^ (x >>> 15), 2246822519 | 0);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
};

// papel washi: degradé cálido + fibras (ruido estático en un SVG de fondo, se rasteriza una vez)
const FIBRA = "url(\"data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='480' height='480'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9 0.035' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.11 0'/></filter><rect width='480' height='480' filter='url(%23n)'/></svg>".replace(/%23/g, "#")) + "\")";
export const Washi: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = C.washi }) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, #faf6ee 0%, ${tone} 55%, ${C.washi2} 100%)`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: FIBRA, opacity: 0.9 }} />
    <AbsoluteFill style={{ backgroundImage: FIBRA, backgroundSize: "731px 731px", transform: "rotate(90deg) scale(1.8)", opacity: 0.5 }} />
    {children}
  </AbsoluteFill>
);

// sello hanko rojo: cae, aplasta y deja tinta despareja
export const Hanko: React.FC<{ t: number; at: number; x: number; y: number; size?: number; txt?: string; rot?: number }> = ({ t, at, x, y, size = 150, txt = "掟", rot = -6 }) => {
  if (t < at - 0.2) return null;
  const p = eo(t, at - 0.2, 0.2), sc = lerp(2.1, 1, p) * (1 + 0.06 * Math.exp(-9 * Math.max(0, t - at)) * Math.sin(40 * Math.max(0, t - at)));
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size * 0.16, border: `${size * 0.055}px solid ${C.hanko}`, color: C.hanko,
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 500, fontSize: size * (txt.length > 1 ? 0.4 : 0.62), lineHeight: 1, writingMode: "vertical-rl",
    opacity: p * 0.93, transform: `rotate(${rot}deg) scale(${sc.toFixed(4)})`, mixBlendMode: "multiply", boxShadow: `inset 0 0 ${size * 0.08}px rgba(179,55,42,.35)`,
    WebkitMaskImage: "radial-gradient(circle at 30% 25%, #000 55%, rgba(0,0,0,.72) 100%)" }}>{txt}</div>;
};

// pincelada sumi que se pinta de izquierda a derecha (la punta más fina que el cuerpo)
export const Pincel: React.FC<{ t: number; at: number; dur?: number; x: number; y: number; w: number; hgt?: number; rot?: number; col?: string; op?: number }> = ({ t, at, dur = 0.35, x, y, w, hgt = 14, rot = 0, col = C.sumi, op = 0.9 }) => {
  const p = eo(t, at, dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: hgt, transformOrigin: "0 50%", transform: `rotate(${rot}deg)`, opacity: op }}>
    <div style={{ width: `${p * 100}%`, height: "100%", background: col, borderRadius: `${hgt}px ${hgt * 0.35}px ${hgt * 0.5}px ${hgt}px / ${hgt * 0.6}px ${hgt * 0.5}px ${hgt * 0.3}px ${hgt * 0.7}px`,
      WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 78%,rgba(0,0,0,.55) 92%,transparent 100%)" }} />
  </div>;
};

// texto que entra palabra por palabra (sube 18 px y aparece)
export const Palabras: React.FC<{ t: number; at: number; txt: string; gap?: number; style?: React.CSSProperties }> = ({ t, at, txt, gap = 0.13, style }) => (
  <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
    {txt.split(" ").map((w, i) => { const p = eo(t, at + i * gap, 0.38); return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>{w}</span>; })}
  </div>
);

// tela tejida para tarjetas de color (trama fina por CSS)
export const tela = (col: string, claro = false): React.CSSProperties => ({
  backgroundColor: col,
  backgroundImage: `repeating-linear-gradient(0deg, rgba(${claro ? "90,70,40" : "255,255,255"},.07) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 1px, transparent 1px 3px), radial-gradient(120% 100% at 20% 0%, rgba(255,255,255,.14), transparent 60%)`,
});
