// Rhonda the Cleaning Lady — marca del canal (igual que el libro y la landing). Reusable por todos los videos del canal.
// Blanco cálido de baño limpio · celeste de la casaca · amarillo guante · rojo SÓLO para alertas.
// Fraunces (títulos) + Oswald (rótulos) + Caveat (la firma/notas de Rhonda). Claro y luminoso, nunca cine oscuro.
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const fr = loadFraunces("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin"] });
const os = loadOswald("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const cv = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const SERIF = fr.fontFamily;
export const LABEL = os.fontFamily;
export const HAND = cv.fontFamily;
export const fontsReady = (): Promise<unknown> => Promise.all([fr.waitUntilDone(), os.waitUntilDone(), cv.waitUntilDone()]);

export const RH = {
  white: "#FBF8F2",     // blanco cálido
  tile: "#F1EEE8",
  grout: "#D9D4CB",
  blue: "#2F78B7",      // celeste de la casaca
  blueDeep: "#1F5688",
  blueSoft: "#CFE2F3",
  yellow: "#F5C518",    // guante
  yellowSoft: "#FCEBA6",
  red: "#D1342A",       // SÓLO alertas
  ink: "#1E2A36",
  inkSoft: "#5A6672",
  brown: "#5B3416",     // la botella marrón
  slime: "#1C1A14",
  fizz: "#FFFFFF",
  shadow: "rgba(30,42,54,0.28)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
// PRNG determinista (hash entero) — el farm rinde en chunks: nunca Math.random
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const ease = (x: number) => x * x * (3 - 2 * x);
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
