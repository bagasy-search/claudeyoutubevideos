// cl2heladera · utilidades puras de tiempo, resortes y tipografía. Todo es f(t): nada guarda estado entre cuadros.
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadBody } from "@remotion/google-fonts/Barlow";

export const { fontFamily: FONT } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
export const { fontFamily: BODY } = loadBody("normal", { weights: ["500", "700"], subsets: ["latin"] });
export const FPS = 30;
export const P = "cl2heladera/";
export const s = (t: number) => Math.round(t * FPS);
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// resorte amortiguado (masa-resorte): 0 → 1 con sobrepico; k = rigidez relativa, z = amortiguación
export const spr = (t: number, a: number, k = 1, z = 0.32) => {
  const x = (t - a) * 7 * k;
  if (x <= 0) return 0;
  const w = Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * x) * (Math.cos(w * x) + (z / w) * Math.sin(w * x));
};
// resorte que entra en a y sale en b (sale más rápido, sin sobrepico)
export const io = (t: number, a: number, b: number, k = 1) => Math.min(spr(t, a, k), 1 - e(t, b - 0.25, b + 0.05));
// hash entero (mulberry) → [0,1): sorteos deterministas por id
export const hash = (n: number, salt = 0) => {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
};
export const idn = (id: string) => { let h = 7; for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619); return h >>> 0; };
// paleta del video: el frío es luz azul, el calor es luz naranja, la falla es un punto rojo
export const C = { ink: "#f3f6f8", dim: "rgba(243,246,248,.72)", ice: "#7fd3ff", ice2: "#d6f1ff", heat: "#ff9a3c", heat2: "#ffd2a1", red: "#ff4b3e", ok: "#7dff9b", glass: "rgba(200,232,255,.10)", edge: "rgba(210,238,255,.55)", night: "#06101a" };
export const shadowTxt = "0 3px 0 rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.55)";
