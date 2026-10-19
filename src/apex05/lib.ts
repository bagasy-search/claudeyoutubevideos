// apex05 (osos) — utilidades comunes del documental (a mano, minuto a minuto). Marca Apex Files: rojo expediente + papel.
import { Easing, interpolate as rInterpolate } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: COND } = loadOswald("normal", { weights: ["500", "700"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"] });
export const { fontFamily: TYPE } = loadType("normal", { weights: ["400"] });
export const { fontFamily: SANS } = loadInter("normal", { weights: ["400", "600", "800"] });

export const FPS = 30, W = 1920, H = 1080;
export const RED = "#C4161C", RED2 = "#FF3B30", PAPER = "#EFE8DA", INK = "#08090A", MUD = "#B08A55", GOLD = "#E8C27A";
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
