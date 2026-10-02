// Opal's Hen House — marca del canal (reusable por todos los videos del canal).
// "Libreta del gallinero + etiqueta de bolsa de alimento": papel crema rayado, lápiz, rojo granero, kraft de bolsa,
// amarillo yema, verde campo de Indiana. Slab de etiqueta de alimento (Zilla Slab) + letra de libreta (Caveat) +
// rótulo condensado (Oswald). Claro y legible. Textos SIEMPRE por props (nada quemado de un video).
import { loadFont as loadSlab } from "@remotion/google-fonts/ZillaSlab";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const sl = loadSlab("normal", { weights: ["500", "700"], subsets: ["latin"] });
const ha = loadHand("normal", { weights: ["500", "700"], subsets: ["latin"] });
const os = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const SLAB = sl.fontFamily;
export const HAND = ha.fontFamily;
export const LABEL = os.fontFamily;

export const OP = {
  paper: "#F7F0DC",
  paper2: "#EFE4C6",
  rule: "#9DB7D5",
  margin: "#D9776E",
  pencil: "#2C2A28",
  pencilSoft: "#5B5650",
  red: "#A8322D",
  redDeep: "#7E211D",
  kraft: "#C9A574",
  kraftDeep: "#A9834F",
  yolk: "#F2B632",
  shell: "#F3E6CF",
  green: "#4F7A35",
  sky: "#CFE3EE",
  white: "#FFFDF7",
  shadow: "rgba(44,42,40,0.32)",
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// hoja de libreta rayada (CSS puro)
export const notebookBg = (base = OP.paper) => ({
  backgroundColor: base,
  backgroundImage:
    `linear-gradient(90deg, transparent 118px, ${hexA(OP.margin, 0.75)} 118px, ${hexA(OP.margin, 0.75)} 121px, transparent 121px),` +
    `repeating-linear-gradient(180deg, transparent 0 63px, ${hexA(OP.rule, 0.7)} 63px 65px),` +
    "radial-gradient(ellipse at 15% 10%, rgba(255,255,255,0.55), transparent 55%)," +
    "radial-gradient(ellipse at 85% 95%, rgba(140,100,40,0.12), transparent 50%)",
});
// kraft de bolsa de alimento con trama
export const kraftBg = (base = OP.kraft) => ({
  backgroundColor: base,
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(90,60,20,0.06) 0 3px, transparent 3px 9px)," +
    "repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 9px)," +
    "radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.3), transparent 55%)",
});

// PRNG determinista (el farm rinde en chunks: nunca Math.random)
export function rnd(seed: number) {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const fontsReady = (): Promise<unknown> => Promise.all([sl.waitUntilDone(), ha.waitUntilDone(), os.waitUntilDone()]);
