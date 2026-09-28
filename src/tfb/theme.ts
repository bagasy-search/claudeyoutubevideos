// theme.ts — identidad visual de The Free Builder / El Constructor Libre para los componentes `Tfb*`.
// La paleta sale de las MINIATURAS del canal: blanco con contorno oscuro, amarillo, rojo. Tipos: Anton (golpe),
// Inter (etiquetas), Caveat (anotación a mano). ⛔ Nada de fuentes de sistema.
import { Easing, interpolate, spring } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

export const ANTON = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const INTER = loadInter("normal", { weights: ["600", "800", "900"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const CAVEAT = loadCaveat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const TFB = {
  yellow: "#FFD21A",
  red: "#E2231A",
  white: "#FFFFFF",
  ink: "#101010",
  cream: "#F4EAD2",
  wood: "#C99A5B",
  woodDark: "#8A5A2B",
  glue: "#F2D58A",
  green: "#3DDC84",
};

/** Contorno de texto estilo miniatura (blanco con borde oscuro + sombra dura). */
export const strokeText = (px = 6, color = TFB.ink) =>
  ({ WebkitTextStroke: `${px}px ${color}`, paintOrder: "stroke fill", textShadow: `0 ${px}px 0 rgba(0,0,0,0.35)` }) as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Entrada con resorte (0→1) a partir de `delay` cuadros. */
export const pop = (frame: number, fps: number, delay = 0, damping = 13, mass = 0.7) =>
  spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 170 } });

/** Salida suave: 1 → 0 en los últimos `n` cuadros de `dur`. */
export const outro = (frame: number, dur: number, n = 8) => interpolate(frame, [dur - n, dur], [1, 0], clamp);

/** Temblor determinista (sin Math.random: el farm rinde en chunks y cada uno tiene que dar lo mismo). */
export const jitter = (frame: number, seed: number, amp: number) =>
  Math.sin(frame * 1.7 + seed * 12.3) * amp * 0.6 + Math.sin(frame * 3.1 + seed * 4.1) * amp * 0.4;
