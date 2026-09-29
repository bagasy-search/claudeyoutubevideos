// Ancient Humans (piloto ahnight) — marca del canal: documental hiperreal de la prehistoria.
// Paleta de NOCHE AL FUEGO: negro cálido, ámbar de brasa, blanco hueso, azul luna.
import { loadFont as loadSans } from "@remotion/google-fonts/Oswald";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBig } from "@remotion/google-fonts/Anton";

export const SANS = loadSans("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;
export const SERIF = loadSerif("italic", { weights: ["600"], subsets: ["latin"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
export const BIG = loadBig("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const AH = {
  ink: "#0C0906",
  ink2: "#16100A",
  ember: "#FF8A2A",
  amber: "#F5B04A",
  flame: "#FFD27A",
  blood: "#C8452C",
  bone: "#EFE6D4",
  boneDim: "#B9AE98",
  moon: "#A9C2DA",
  moonDeep: "#2A3A4E",
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => { const x = clamp(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// sombra de texto legible sobre foto de fuego
export const TSH = "0 3px 18px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)";
