// lenny01 · cámaras del mundo 3D (posición, a dónde mira, fov) y helper de 2 keyframes con arco opcional.
import { K } from "./pipe3d";
type C = { p: number[]; l: number[]; fov: number };
export const CAM: Record<string, C> = {
  wide: { p: [0.05, 0.8, 2.15], l: [-0.05, 0.55, 0], fov: 38 },
  wide2: { p: [-0.35, 0.72, 1.7], l: [-0.1, 0.52, 0], fov: 38 },
  basin: { p: [-0.16, 1.02, 0.66], l: [-0.25, 0.8, 0], fov: 38 },
  surf: { p: [-0.25, 0.93, 0.3], l: [-0.25, 0.72, 0], fov: 46 },
  drain: { p: [-0.22, 0.74, 0.22], l: [-0.25, 0.6, 0], fov: 44 },
  under: { p: [0.0, 0.5, 0.78], l: [0.0, 0.5, 0], fov: 40 },
  trap: { p: [-0.12, 0.45, 0.42], l: [-0.15, 0.42, 0], fov: 36 },
  trapL: { p: [-0.25, 0.44, 0.4], l: [-0.16, 0.42, 0], fov: 36 },
  bend: { p: [-0.19, 0.37, 0.19], l: [-0.19, 0.37, 0], fov: 36 },
  nut: { p: [-0.22, 0.45, 0.17], l: [-0.25, 0.43, 0], fov: 36 },
  arm: { p: [0.12, 0.5, 0.3], l: [0.1, 0.48, 0], fov: 36 },
  right: { p: [0.05, 0.62, 0.55], l: [0.0, 0.58, 0], fov: 40 },
  stack: { p: [1.0, -0.9, 2.7], l: [0.55, -1.25, 0], fov: 40 },
  base: { p: [1.4, -2.0, 1.5], l: [0.8, -2.45, 0], fov: 40 },
  main: { p: [6.5, -1.0, 7.5], l: [6.5, -1.5, 0], fov: 42 },
  house: { p: [4.2, 0.6, 12.5], l: [5.2, -0.9, 0], fov: 44 },
  roots: { p: [8.1, -2.45, 0.9], l: [8.3, -2.6, 0], fov: 36 },
  rootsW: { p: [8.4, -1.5, 3.2], l: [8.4, -1.6, 0], fov: 40 },
};
export const kf = (a: number, b: number, from: C, to: C = from, arc = 0): K[] => [{ t: a, ...from }, { t: b, ...to, arc }];
export const kf3 = (a: number, b: number, c: number, A: C, B: C, Cc: C, arc = 0): K[] => [{ t: a, ...A }, { t: b, ...B, arc }, { t: c, ...Cc }];
