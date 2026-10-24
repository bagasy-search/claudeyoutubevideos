// prueba del mundo: cada segundo una pose + un estado del maniquí (sólo para stills locales)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World, makeCam, BUST0, type BustSt, type WorldState, type Key } from "./cuello3d";
type V3 = [number, number, number];
const B = (o: Partial<BustSt>): BustSt => ({ ...BUST0, ...o });
const S: { p: V3; l: V3; fov: number; b?: Partial<BustSt>; w?: Partial<WorldState> }[] = [
  { p: [-0.5, 3.4, 9.5], l: [-0.5, 1.0, -1.0], fov: 46 },                       // 0 la casa entera
  { p: [-3.0, 1.75, 1.4], l: [-3.0, 1.45, -0.7], fov: 34 },                      // 1 maniquí de frente
  { p: [-3.0, 1.7, 0.9], l: [-3.0, 1.35, -0.7], fov: 30, b: { towel: 1, steam: 1 } },
  { p: [-1.9, 1.6, 0.6], l: [-3.0, 1.35, -0.7], fov: 30, b: { pitch: -0.7, fold: 1, phone: 1, phoneH: 0 } }, // 3 perfil celular abajo
  { p: [-3.0, 1.7, 0.9], l: [-3.0, 1.35, -0.7], fov: 30, b: { arrows: 1 } },
  { p: [-3.0, 1.7, 0.9], l: [-3.0, 1.3, -0.7], fov: 30, b: { zone: 1 } },
  { p: [-1.9, 1.6, 0.6], l: [-3.0, 1.45, -0.7], fov: 32, b: { pitch: 0.55, kiss: 1 } },
  { p: [-3.0, 1.8, -2.0], l: [-3.0, 1.35, -0.7], fov: 34, b: { kimono: 1, string: 1 } }, // 7 de atrás
  { p: [-3.0, 1.7, 1.0], l: [-3.0, 1.35, -0.7], fov: 32, b: { sun: 1 } },
  { p: [3.3, 0.9, -1.2], l: [4.8, 0.3, -1.5], fov: 34, w: { pillow: 1 }, b: { pitch: -0.6, fold: 1 } }, // 9 almohada alta
  { p: [-7.5, 1.9, 1.3], l: [-7.5, 1.1, -1.2], fov: 36, b: { towel: 1, steam: 1 }, w: { memory: 1, warm: 1 } }, // 10 salón
  { p: [0.9, 1.5, 0.8], l: [1.2, 0.7, -1.5], fov: 40, w: { kettle: 1 } },        // 11 cocina
];
export const TEST_N = S.length;
export const Test: React.FC = () => {
  const i = Math.min(S.length - 1, Math.floor(useCurrentFrame() / 30)), q = S[i], t = i + 0.5;
  const K: Key[] = [{ t: 0, p: q.p, l: q.l, fov: q.fov }];
  const cam = makeCam(K);
  const lyingPitch = q.w?.pillow ? -0.6 : 0;
  const st: WorldState = { day: 1, sun: q.b?.sun ?? 0, warm: 0, memory: 0, kettle: 0, pillow: 0, roll: 0, glow: {}, bust: B(i === 9 ? {} : q.b ?? {}), salon: B(i === 10 ? q.b ?? {} : {}), lying: B({ pitch: lyingPitch, fold: i === 9 ? 1 : 0 }), ...q.w };
  return <AbsoluteFill><World t={t} camAt={cam.camAt} st={st} /></AbsoluteFill>;
};
