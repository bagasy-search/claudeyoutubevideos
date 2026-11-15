// Claudio el Conserje — marca del canal (igual que el libro "El Frasco Marrón de Claudio" y la landing). Reusable por los 12 videos.
// Identidad de CONSERJE DE HOTEL: azul marino de la chaqueta · amarillo de guante (acento) · latón de la plaqueta de habitación
// y del llavero · blanco de azulejo · rojo SÓLO para alertas. Fraunces (títulos, como el libro) + Oswald (rótulos) + Caveat (notas
// a mano de Claudio). Claro y con luz de baño, nunca cine oscuro.
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const fr = loadFraunces("normal", { weights: ["400", "600", "700", "900"], subsets: ["latin", "latin-ext"] });
const os = loadOswald("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
const cv = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

export const SERIF = fr.fontFamily;
export const LABEL = os.fontFamily;
export const HAND = cv.fontFamily;

export const CL = {
  white: "#FBF9F4",     // blanco cálido de azulejo
  tile: "#EFE9DF",      // azulejo crema del hotel
  grout: "#D8CFC1",
  navy: "#1E2D4F",      // chaqueta
  navyDeep: "#131D35",
  navySoft: "#C9D3E6",
  yellow: "#F2C230",    // guante amarillo (acento)
  yellowSoft: "#FBE7A2",
  brass: "#B58B45",     // plaqueta y llavero
  brassLight: "#E3C27F",
  nitrile: "#3C7FD9",   // guante de nitrilo azul
  red: "#D23B2E",       // SÓLO alertas
  ink: "#1A2233",
  inkSoft: "#59627A",
  brown: "#5B3416",     // la botella marrón
  slime: "#1C1A14",
  shadow: "rgba(19,29,53,0.32)",
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
