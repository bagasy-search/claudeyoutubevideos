// Yesterday's Classroom — marca del canal (nostalgia escolar EE.UU. 1950s-60s).
// Paleta Kodachrome cálida: pizarrón verde, papel crema, amarillo de micro escolar, rojo manzana.
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadSans } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/LibreBaskerville";

export const SERIF = loadSerif().fontFamily;
export const TYPE = loadType().fontFamily;
export const SANS = loadSans().fontFamily;
export const BODY = loadBody().fontFamily;

export const YC = {
  ink: "#0E0C0A",
  board: "#1E3328",
  boardDeep: "#12211A",
  paper: "#F3E9D2",
  paperDim: "#D9CBA8",
  bus: "#F2B705",
  busDeep: "#C98F00",
  apple: "#C8102E",
  chalk: "#F5F1E6",
  sepia: "#8A6A43",
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => { const x = clamp(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
