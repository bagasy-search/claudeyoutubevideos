// prueba del mundo: cada segundo un estado distinto (sólo para stills locales)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World, WorldProps, PT, setKeys, V } from "./kitchen3d";
const S: { p: V; l: V; fov: number; w: Partial<WorldProps> }[] = [
  { p: [0.9, 1.75, 1.7], l: [-0.2, 1.1, -2.0], fov: 44, w: { fire: 0.4, arroz: { rice: 0.8 }, tickets: 7 } },
  { p: [WOKX(0.15), 1.45, -1.35], l: PT.wok, fov: 40, w: { fire: 1, smoke: 0.8, hei: 1, arroz: { rice: 1, brown: 0.8, toss: 0.5 } } },
  { p: [-0.8, 1.35, -1.2], l: PT.polvos, fov: 38, w: { glowPolvo: 4, glowSoja: 3 } },
  { p: [-2.4, 1.5, -0.4], l: PT.casa, fov: 40, w: { homeFire: 1, casaRice: 0.8 } },
  { p: [1.9, 1.5, 0.2], l: PT.bandejas, fov: 42, w: { frio: 1, trays: 6 } },
  { p: [24, 1.45, 1.6], l: PT.macro, fov: 34, w: { macro: { on: 1, wet: 1, split: 0 } } },
  { p: [24, 1.45, 1.6], l: PT.macro, fov: 34, w: { macro: { on: 1, wet: 0, split: 1, crystal: 1 } } },
  { p: [WOKX(0.1), 1.4, -1.45], l: PT.wok, fov: 38, w: { fire: 0.6, arroz: { rice: 1, clump: 1, wet: 1 }, egg: 0, soyPour: 1, soyDark: 1, soyEdge: 1 } },
  { p: [WOKX(0.1), 1.4, -1.45], l: PT.wok, fov: 38, w: { fire: 0.8, arroz: { rice: 1, brown: 1 }, egg: 1, eggBrown: 0.3, peas: 1, greens: 1 } },
];
function WOKX(d: number) { return PT.wok[0] + d; }
S.forEach((s, i) => setKeys([{ t: i, p: s.p, l: s.l, fov: s.fov }, { t: i + 0.999, p: s.p, l: s.l, fov: s.fov }]));
export const Test: React.FC = () => { const f = useCurrentFrame(), i = Math.min(S.length - 1, Math.floor(f / 30)); return <AbsoluteFill style={{ background: "#000" }}><World t={f / 30} {...S[i].w} /></AbsoluteFill>; };
export const TEST_FRAMES = S.length * 30;
