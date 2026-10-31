// dur29 · lo mínimo que el kit 3D (h3d) toma del hkit de len29: fuente, color de texto y curvas de tiempo en SEGUNDOS.
import { F } from "./ukit";
export const FONT = F, TX = "#f7f4ee";
export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const eio = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export type H = { k: string; at: number; out: number; [x: string]: any };
