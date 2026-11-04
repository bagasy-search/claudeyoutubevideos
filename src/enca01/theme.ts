// Chief Aurelio · mundo visual "Bitácora de máquinas" (04-nov-2026, sesión aurelio-a).
// Paleta: casco de noche + latón del telégrafo + rojo de señal + papel del libro de guardias.
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { interpolate, Easing } from "remotion";

export const FONT = {
  plate: loadBarlow("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily, // placas de máquina, títulos
  mono: loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily, // números, manómetros, libro de guardias
  hand: loadCaveat("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily, // letra de Aurelio (cartas, notas)
  serif: loadSerif("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily, // citas (Svensson, Dahl)
};

export const C = {
  ink: "#0B1620", // casco de noche
  steel: "#1C2A35", // chapa de la sala de máquinas
  steel2: "#2B3D4A",
  line: "#5E7686", // trazo técnico
  brass: "#C8A250", // latón del telégrafo
  brassHi: "#E9CD82",
  brassLo: "#7A5F27",
  signal: "#C7352B", // rojo de señal / alarma
  cream: "#EFE6D2", // papel del libro de guardias
  paperLine: "#B9A98A",
  sea: "#2F6475",
  seaHi: "#5FA3B5",
  heat: "#E0742A",
  white: "#F4F1EA",
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
// 0→1 entre a y b (frames), con easing
export const k = (f: number, a: number, b: number, e = ease) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
// entrada y salida de un overlay: sube en `inF` frames, baja los últimos `outF`
export const io = (f: number, dur: number, inF = 12, outF = 10) =>
  Math.min(k(f, 0, inF), 1 - k(f, dur - outF, dur));

export const shadow = "0 10px 40px rgba(0,0,0,0.55)";
export const plateStyle: React.CSSProperties = {
  background: `linear-gradient(180deg, ${C.brassHi} 0%, ${C.brass} 45%, ${C.brassLo} 100%)`,
  color: C.ink,
  fontFamily: FONT.plate,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  borderRadius: 6,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.35), ${shadow}`,
};
