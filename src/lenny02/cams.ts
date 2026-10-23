// lenny02 · cámaras del mundo 3D del inodoro (posición, a dónde mira, fov) y helpers de keyframes.
import { K } from "./toilet3d";
type C = { p: number[]; l: number[]; fov: number };
export const CAM: Record<string, C> = {
  wide: { p: [-0.05, 0.5, 1.7], l: [-0.03, 0.36, 0], fov: 38 },
  wide2: { p: [-0.45, 0.62, 1.45], l: [-0.08, 0.38, 0], fov: 38 },
  room: { p: [0.15, 0.7, 2.6], l: [0.0, 0.42, 0], fov: 40 },
  bowl: { p: [-0.12, 0.44, 0.8], l: [-0.15, 0.3, 0], fov: 38 },
  rim: { p: [-0.2, 0.47, 0.42], l: [-0.2, 0.37, 0], fov: 40 },
  trap: { p: [-0.1, 0.27, 0.62], l: [-0.08, 0.24, 0], fov: 38 },
  crest: { p: [0.02, 0.3, 0.36], l: [0.04, 0.27, 0], fov: 38 },
  floor: { p: [0.2, 0.05, 0.6], l: [0.12, -0.05, 0], fov: 38 },
  under: { p: [-0.22, 0.31, 0.06], l: [-0.05, 0.37, -0.1], fov: 50 },
  tank: { p: [0.16, 0.62, 0.6], l: [0.16, 0.6, 0], fov: 38 },
  tankW: { p: [0.05, 0.6, 1.05], l: [0.08, 0.52, 0], fov: 38 },
  valve: { p: [0.22, 0.2, 0.45], l: [0.27, 0.16, 0], fov: 38 },
  jetc: { p: [-0.26, 0.24, 0.32], l: [-0.18, 0.19, 0], fov: 40 },
  drainP: { p: [0.55, -0.15, 0.95], l: [0.45, -0.3, 0], fov: 40 },
  main: { p: [1.4, -0.2, 1.7], l: [1.2, -0.35, 0], fov: 42 },
};
export const kf = (a: number, b: number, from: C, to: C = from, arc = 0): K[] => [{ t: a, ...from }, { t: b, ...to, arc }];
export const kf3 = (a: number, b: number, c: number, A: C, B: C, Cc: C, arc = 0): K[] => [{ t: a, ...A }, { t: b, ...B, arc }, { t: c, ...Cc }];
