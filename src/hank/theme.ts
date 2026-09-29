// Hank Out Back — marca del canal (fauna con urgencia de noticia, explorador casero).
// Paleta de pantano: verde musgo, agua de bayou, naranja "diente de nutria" como acento, blanco hueso.
import { loadFont as loadSans } from "@remotion/google-fonts/Oswald";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

export const SANS = loadSans().fontFamily;
export const SERIF = loadSerif().fontFamily;
export const MONO = loadMono().fontFamily;
export const HAND = loadHand().fontFamily;

export const HK = {
  ink: "#0B0F0C",
  moss: "#2F4A2C",
  bayou: "#1C3A3C",
  mud: "#6B4A2B",
  bone: "#F1EBDD",
  orange: "#FF7A1A",
  red: "#D7263D",
  gold: "#F2C14E",
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => { const x = clamp(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
