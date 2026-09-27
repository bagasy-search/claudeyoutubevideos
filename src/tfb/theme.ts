// The Free Builder — sistema visual de la capa de motion graphics (frame a frame).
// Paleta de las miniaturas del canal: BLANCO / AMARILLO / ROJO sobre el footage. Tipos: Anton (impacto),
// Inter (etiquetas), Permanent Marker (anotación a mano). Sin fuentes de sistema.
import { Easing, interpolate, spring } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";

export const F = {
  impact: loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily,
  ui: loadInter("normal", { weights: ["600", "800", "900"], subsets: ["latin", "latin-ext"] }).fontFamily,
  hand: loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};
export const C = {
  white: "#FFFFFF",
  yellow: "#FFD21F",
  yellowDeep: "#F5B800",
  red: "#E0342A",
  green: "#2FBF5B",
  ink: "#111111",
  inkSoft: "rgba(10,10,10,0.72)",
  shadow: "0 6px 24px rgba(0,0,0,0.45)",
};
export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1); // salida suave (easeOutQuint-ish)
export const easeIn = Easing.bezier(0.64, 0, 0.78, 0);
/** 0→1 con spring amortiguado a partir de `delay` cuadros */
export const pop = (frame: number, fps: number, delay = 0, damping = 14, mass = 0.7) =>
  spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 170 } });
/** entrada/salida simétrica: 0→1 en `inF` cuadros, 1→0 en los últimos `outF` */
export const inOut = (frame: number, dur: number, inF = 8, outF = 8) =>
  Math.min(interpolate(frame, [0, inF], [0, 1], { ...clamp, easing: ease }), interpolate(frame, [dur - outF, dur], [1, 0], { ...clamp, easing: easeIn }));
/** ruido determinista barato (para temblor y trazos a mano) */
export const noise = (seed: number, t: number) => {
  const s = Math.sin(seed * 12.9898 + t * 0.37) * 43758.5453;
  const s2 = Math.sin(seed * 78.233 + t * 0.21) * 12543.1234;
  return ((s - Math.floor(s)) + (s2 - Math.floor(s2))) - 1; // −1..1
};
/** ruido suave (interpolado entre enteros) */
export const smooth = (seed: number, t: number) => {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return noise(seed, i) * (1 - u) + noise(seed, i + 1) * u;
};
export const textShadow = "0 3px 0 rgba(0,0,0,0.35), 0 6px 22px rgba(0,0,0,0.55)";
