// theme.ts — paleta y tipografías del canal The Free Builder (misma gramática que las miniaturas:
// blanco / amarillo / rojo sobre el footage). Todo componente de src/tdc/ sale de acá.
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { Easing, interpolate, spring } from "remotion";

export const F_DISPLAY = loadAnton().fontFamily;
export const F_UI = loadManrope("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const F_HAND = loadCaveat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const C = {
  yellow: "#FFD21F",
  red: "#E32619",
  white: "#FFFFFF",
  ink: "#141414",
  cream: "#F1E4C9",
  espresso: "#2B1D14",
  rust: "#8B2D22",
  gold: "#B1832F",
  water: "#7FD3FF",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);

/** 0→1 de entrada y 1→0 de salida (cuadros), con curva suave */
export const inOut = (f: number, dur: number, a = 10, b = 10) =>
  Math.min(interpolate(f, [0, a], [0, 1], { ...clamp, easing: ease }), interpolate(f, [dur - b, dur], [1, 0], { ...clamp, easing: easeIn }));

export const pop = (f: number, fps: number, delay = 0, damping = 13) =>
  spring({ frame: f - delay, fps, config: { damping, stiffness: 170, mass: 0.7 } });

/** ruido determinístico suave (para temblores de mano / cámara) */
export const wobble = (f: number, seed: number, amp: number, speed = 0.18) =>
  amp * (Math.sin(f * speed + seed * 12.9898) * 0.6 + Math.sin(f * speed * 2.31 + seed * 78.233) * 0.4);

export const TEXT_SHADOW = "0 4px 0 rgba(0,0,0,0.55), 0 10px 28px rgba(0,0,0,0.55)";
