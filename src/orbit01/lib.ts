// Orbit Dossier — orbit01 (Europa). Núcleo: tiempos, fuentes, colores.
import { staticFile, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: COND } = loadFont("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
export const FPS = 30;
export const sf = (p: string) => staticFile("orbit01/" + p);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const C = {
  bg: "#04070c",
  ink: "#eaf1f8",
  dim: "rgba(234,241,248,0.62)",
  cyan: "#6fd6ff",
  amber: "#ffb23e",
  red: "#ff6a4d",
  ice: "#f3efe4",
  ocean: "#0d4f8a",
  deep: "#06223f",
};
