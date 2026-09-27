// theme.ts — identidad visual de The Free Builder / El Constructor Libre para los componentes frame a frame de src/tfb/.
// Paleta = la de las miniaturas del canal: BLANCO + AMARILLO de lupa + ROJO de flecha, sobre el footage.
// Tipografías: Anton (golpes de texto, como las miniaturas), Inter (etiquetas), Caveat (anotación a mano).
import { Easing, interpolate, spring } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const { fontFamily: ANTON } = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "700", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: CAVEAT } = loadCaveat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });

export const F_DISPLAY = `${ANTON}, Impact, sans-serif`;
export const F_SANS = `${INTER}, Arial, sans-serif`;
export const F_HAND = `${CAVEAT}, cursive`;

export const C = {
  white: "#FFFFFF",
  yellow: "#FFD21F",
  yellowDeep: "#F2B705",
  red: "#E32619",
  redDeep: "#B3160C",
  ink: "#111111",
  ink2: "#1E1E1C",
  green: "#2FBF5B",
  water: "#3FA9F5",
  plastic: "#1B1B1D",
  plasticHi: "#3A3A3E",
  melt: "#FF7A1A",
  cream: "#F1E4C9",
  shadow: "rgba(0,0,0,0.45)",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lin = (f: number, a: number[], b: number[], easing?: (t: number) => number) =>
  interpolate(f, a, b, { ...clamp, ...(easing ? { easing } : {}) });
export const EO = Easing.out(Easing.cubic);
export const EIO = Easing.inOut(Easing.cubic);
export const EBACK = Easing.out(Easing.back(1.8));

/** spring estándar del canal: entra rápido, se asienta con un pique chico */
export const pop = (frame: number, fps: number, delay = 0, stiff = 180, damp = 14) =>
  spring({ frame: frame - delay, fps, config: { stiffness: stiff, damping: damp, mass: 0.9 } });

/** entrada/salida simétrica para cualquier pieza que dura `dur` cuadros */
export const inOut = (f: number, dur: number, fin = 8, fout = 8) =>
  Math.min(lin(f, [0, fin], [0, 1], EO), lin(f, [dur - fout, dur], [1, 0], EIO));

/** ruido determinista 0..1 (hash entero; nunca Math.random: el farm rinde en chunks paralelos) */
export const rnd = (s: number) => {
  let h = Math.imul((s * 1000) | 0, 2654435761) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 15), 2246822519); h ^= h >>> 13; h = Math.imul(h, 3266489917); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/** sombra de texto "de miniatura": contorno negro grueso + sombra blanda */
export const outline = (px: number, color = "#000") =>
  [`${px}px 0 ${color}`, `-${px}px 0 ${color}`, `0 ${px}px ${color}`, `0 -${px}px ${color}`, `${px * 0.7}px ${px * 0.7}px ${color}`,
   `-${px * 0.7}px ${px * 0.7}px ${color}`, `${px * 0.7}px -${px * 0.7}px ${color}`, `-${px * 0.7}px -${px * 0.7}px ${color}`, `0 ${px * 2}px ${px * 4}px rgba(0,0,0,0.5)`].join(",");

/** trazo a mano: devuelve un path "temblado" de elipse (para círculos de marcador) */
export const roughEllipse = (cx: number, cy: number, rx: number, ry: number, seed = 1, turns = 1.12) => {
  const n = 48; let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 * turns - 0.6;
    const k = 1 + (rnd(seed + i * 0.37) - 0.5) * 0.06 + (i / n) * 0.05;
    const x = cx + Math.cos(t) * rx * k, y = cy + Math.sin(t) * ry * k;
    d += (i ? " L " : "M ") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
};
