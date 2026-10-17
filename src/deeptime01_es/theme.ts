import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { Easing, interpolate } from "remotion";

export const SERIF = loadSerif("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const SANS = loadSans("normal", { weights: ["400", "600", "800"], subsets: ["latin"] }).fontFamily;

export const C = {
  ink: "#070b10",
  ocean: "#0c1824",
  ocean2: "#10212f",
  land: "#3a4650",
  landHi: "#566470",
  amber: "#f0a640",
  amberHot: "#ff7a2f",
  ice: "#dfe8ee",
  text: "#f3efe6",
  dim: "rgba(243,239,230,0.62)",
  teal: "#5cc8c0",
  red: "#e5533d",
};
export const FPS = 30;

export const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const ramp = (f: number, a: number, b: number, e = ease) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
