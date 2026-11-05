// gary01 Â· piezas 2.5D (HTML/SVG con perspectiva real) que viven ENCIMA del mundo 3D, de las tomas y del avatar borroneado.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily: FONT } = loadFont("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
export const P = "img/cme4c/";
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const easeIO = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const ei = (t: number, a: number, b: number) => easeIO((t - a) / (b - a));
// resorte determinista (sin depender del fps del contexto): sube con sobrepico y se asienta
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };

export const COL = { ink: "#f4efe6", ice: "#8fd6ff", ice2: "#d9f3ff", amber: "#ffb257", red: "#ff4a3d", dim: "rgba(244,239,230,.7)", navy: "#0b1424" };

// extrusiÃ³n: capas de sombra dura (el canto de la letra) + sombra suave al piso
export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.6)`;

