// apex03 — utilidades comunes del documental (a mano, minuto a minuto). Identidad Apex Files: condensada blanca + rojo.
import { Easing, interpolate as rInterpolate } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: SANS } = loadInter("normal", { weights: ["400", "600", "800"] });
// ROMAN queda como nombre para los componentes heredados: en Apex Files es la condensada del canal
export const { fontFamily: ROMAN } = loadOswald("normal", { weights: ["500", "700"] });
export const COND = ROMAN;
export const { fontFamily: MONO } = loadMono("normal", { weights: ["500", "700"] });

export const FPS = 30, W = 1920, H = 1080;
export const RED = "#E3202E", RED2 = "#FF4A4A", SAND = "#E9C48A", VENOM = "#B6FF3B";
export const EMBER = "#FF8A2B", EMBER2 = "#FFC46B", ICE = "#9FD8FF", INK = "#0a0908";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const k01 = (t: number, a: number, b: number) => (b <= a ? (t >= b ? 1 : 0) : Math.min(1, Math.max(0, (t - a) / (b - a))));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export function interp(t: number, inp: number[], out: number[]) {
  const x = inp.slice();
  for (let i = 1; i < x.length; i++) if (x[i] <= x[i - 1]) x[i] = x[i - 1] + 1e-4;
  return rInterpolate(t, x, out, clamp);
}
export const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const shadow = "0 2px 18px rgba(0,0,0,.65), 0 1px 3px rgba(0,0,0,.8)";
