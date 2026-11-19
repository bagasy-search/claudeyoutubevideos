// tdp16 · Tomás, Dirty Passport — look «pasaporte»: página crema con guilloche fino, tapa azul noche, tinta de sello roja, ámbar.
// Fraunces (serif fina) + Montserrat (sans). Todo es función pura de t (segundos): el farm rinde en chunks.
import type React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSans } from "@remotion/google-fonts/Montserrat";

export const SERIF = loadSerif("normal", { weights: ["300", "400", "600"], subsets: ["latin"] }).fontFamily;
loadSerif("italic", { weights: ["300", "400"], subsets: ["latin"] });
export const SANS = loadSans("normal", { weights: ["500", "600", "800"], subsets: ["latin"] }).fontFamily;

type Shot = { s: number; e: number; k: string; f?: string; sc?: string; tr?: string; len?: number; off?: number; from?: number; n?: number; mods?: { a: number; b: number; k: string }[] } & Record<string, any>;
type Data = Record<string, any> & { slug: string; end: number; shots: Shot[]; ov: ({ k: string; a: number; b: number } & Record<string, any>)[];
  paradas: { n: number; t: string; sub?: string; f: string; city?: string }[] };
export let D = { slug: "", end: 1, shots: [], ov: [], paradas: [] } as unknown as Data;
export let P = "";
export const setData = (d: unknown) => { D = d as Data; P = D.slug + "/"; };
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);

export const C = { navy: "#0b1424", navy2: "#16233b", page: "#efe6d2", page2: "#e2d6bc", ink: "#1d1a16", red: "#b3261e", amber: "#ffb257", cream: "#f6f0e4", line: "rgba(29,26,22,.16)" };
export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const eo = (t: number, a: number, d: number) => { const x = cl((t - a) / d); return 1 - Math.pow(1 - x, 3); };
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
// resorte con peso (sube con sobrepico y se asienta)
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
export const h = (n: number, k: number) => { let x = ((n + 1) * 2654435761) ^ ((k + 7) * 40503); x >>>= 0; x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
export const sale = (t: number, b: number, d = 0.35) => 1 - e(t, b - d, b);

// papel de pasaporte: guilloche con gradientes (sin SVG ni filtros)
export const paginaBg: React.CSSProperties = {
  backgroundColor: C.page,
  backgroundImage: [
    "repeating-radial-gradient(circle at 30% 40%, rgba(60,90,120,.07) 0 1px, transparent 1px 9px)",
    "repeating-radial-gradient(circle at 75% 70%, rgba(150,60,60,.05) 0 1px, transparent 1px 11px)",
    "linear-gradient(180deg, rgba(255,255,255,.35), rgba(0,0,0,.05))",
  ].join(", "),
};
export const tapaBg: React.CSSProperties = {
  backgroundColor: C.navy,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 2px, transparent 2px 6px), radial-gradient(80% 70% at 50% 40%, rgba(60,90,140,.25), transparent 70%)",
};
export const sombra = "0 4px 28px rgba(0,0,0,.6), 0 1px 2px rgba(0,0,0,.6)";
export const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase" };
