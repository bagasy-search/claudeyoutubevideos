// Hazel Appraises — marca del canal (reusable por todos los videos del canal).
// "Cartel de remate / etiqueta de tasación": papel manila, tinta negra de sello, rojo de etiqueta de liquidación,
// dorado viejo. Serif editorial (DM Serif Display) + máquina de escribir (Special Elite) + rótulo condensado (Oswald).
// Claro y legible, nada de cine oscuro. Textos SIEMPRE por props (nada quemado de un video).
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const se = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const ty = loadType("normal", { weights: ["400"], subsets: ["latin"] });
const os = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const SERIF = se.fontFamily;
export const TYPE = ty.fontFamily;
export const LABEL = os.fontFamily;

export const HZ = {
  manila: "#E9D4A0",
  manila2: "#DCC285",
  manilaEdge: "#C8A867",
  paper: "#FBF6EA",
  ink: "#1F1B16",
  inkSoft: "#4A4036",
  red: "#C4262E",
  redDeep: "#97191F",
  gold: "#B8892B",
  goldSoft: "#E3C677",
  denim: "#4F6E93",
  green: "#3F6B4A",
  white: "#FFFDF6",
  shadow: "rgba(31,27,22,0.32)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// papel manila con fibras y manchas (CSS puro, sin imágenes externas)
export const manilaBg = (base = HZ.manila) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 18% 12%, rgba(255,255,255,0.45), transparent 55%)," +
    "radial-gradient(ellipse at 88% 92%, rgba(120,80,20,0.16), transparent 50%)," +
    "repeating-linear-gradient(97deg, rgba(120,90,40,0.05) 0 2px, transparent 2px 7px)",
});
export const paperBg = (base = HZ.paper) => ({
  backgroundColor: base,
  backgroundImage:
    "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.6), transparent 55%)," +
    "radial-gradient(ellipse at 80% 90%, rgba(150,110,50,0.10), transparent 50%)",
});

// PRNG determinista (hash entero) — el farm rinde en chunks: nunca Math.random
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const fontsReady = (): Promise<unknown> => Promise.all([se.waitUntilDone(), ty.waitUntilDone(), os.waitUntilDone()]);
