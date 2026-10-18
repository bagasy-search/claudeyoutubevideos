// oldtech01v2 · MINUTO 3 (137,16–200,07 s) — Vitruvio y la receta: piso inclinado, la pelota, pilae, tejas, hormigón, mosaico.
// El hipocausto 3D se CONSTRUYE capa por capa (Fase.pil/tile/conc/mos/slope/ball) entre clips de obra.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, k01, ease } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { Hypo3D, Fase, HypoKey, HypoLabel, HypoDim, X0 } from "./Hypo3D";
import { Place, ThermalDefs, Embers, Readout, Letterbox } from "./comps";
import { Term } from "./comps2";
import { Scroll } from "./comps3";

export const OFF3 = 137.16;
const T = "oldtech01v2/t2v/";
type S3 = Shot & { k?: string };
const ABS: S3[] = [
  { a: 137.16, b: 139.7, v: T + "w01_vitruvius", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 139.7, b: 142.02, v: T + "w01_vitruvius", from: 3.6, cam: [1.1, 0.5, 0.5, 1.3, 0.55, 0.6], out: { type: "dissolve", d: 0.45 } },
  { a: 142.02, b: 148.6, v: T + "w01_vitruvius", from: 6.8, grade: "blur(10px) brightness(.45)", cam: [1.15, 0.5, 0.5, 1.22, 0.5, 0.5], k: "scroll", out: { type: "sweep", d: 0.55 } },
  { a: 148.6, b: 151.2, comp: "recipe", out: { type: "whip", vx: 1 } },
  { a: 151.2, b: 153.7, v: T + "w02_slope", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.7 } },
  { a: 153.7, b: 158.04, comp: "floor", out: { type: "flash" } },
  { a: 158.04, b: 160.8, v: T + "w02_slope", from: 5.0, out: { type: "whip", vx: -1 } },
  { a: 160.8, b: 166.47, comp: "ball", out: { type: "zoom", fx: 0.2, fy: 0.6 } },
  { a: 166.47, b: 169.3, v: T + "o05_gasflow", from: 6.0, out: { type: "dissolve", d: 0.4 } },
  { a: 169.3, b: 172.33, comp: "gas", out: { type: "whip", vx: 1 } },
  { a: 172.33, b: 174.7, v: T + "w03_stacks", from: 0, out: { type: "flash" } },
  { a: 174.7, b: 178.0, comp: "pil", out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 178.0, b: 180.9, v: T + "w04_forest", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 180.9, b: 184.2, comp: "forest", out: { type: "whip", vx: -1 } },
  { a: 184.2, b: 187.97, v: T + "w03_stacks", from: 6.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.55], out: { type: "flash" } },
  { a: 187.97, b: 190.6, v: T + "w05_tiles", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 190.6, b: 194.07, comp: "tiles", out: { type: "whip", vy: 1 } },
  { a: 194.07, b: 196.6, v: T + "w06_concrete", from: 0, out: { type: "whip", vx: 1 } },
  { a: 196.6, b: 198.4, v: T + "w07_mosaicmaking", from: 0, out: { type: "dissolve", d: 0.4 } },
  { a: 198.4, b: 200.07, comp: "final" },
];
export const SHOTS3: S3[] = ABS.map((s) => ({ ...s, a: s.a - OFF3, b: s.b - OFF3 }));
export const M3_FRAMES = Math.round((200.07 - OFF3) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, pil: 1, tile: 1, conc: 1, mos: 1, wall: 1, ...o });
const EMPTY = { pil: 0, tile: 0, conc: 0, mos: 0, wall: 0 };

export const M3: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF3;
  const L = (x: number) => x - OFF3;
  const H3 = (t0abs: number, keys: HypoKey[], fase: (u: number) => Fase, labels: HypoLabel[] = [], dims: HypoDim[] = [], title?: string) =>
    <Hypo3D t0={L(t0abs)} keys={keys} fase={fase} labels={labels} dims={dims} title={title} titleAt={0.2} />;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "recipe": return H3(148.4, [K(0, [0, 17, 11], [-0.5, 0, 0], 38), K(3.0, [4, 13, 13], [-0.5, 0, 0], 38)], () => base(EMPTY),
        [{ at: 0.5, out: 2.9, x: -6.0, y: 0.6, z: 0.4, text: "THE FURNACE", sub: "outside the room", side: "r" }], [], "VITRUVIUS · BOOK V");
      case "floor": return H3(153.5, [K(0, [6, 5, 11], [-1, 0, 0], 40), K(4.6, [3, 3.2, 9], [-2, 0, 0], 40)], (u) => base({ ...EMPTY, slope: ease(k01(u, 0.5, 1.9)) }),
        [{ at: 2.0, out: 4.5, x: -5.4, y: 0.25, z: 2.4, text: "SLOPES TO THE FURNACE", side: "r" }],
        [{ at: 0.6, out: 4.5, a: [-1.2, 0.08, 3.45], b: [0.3, 0.08, 3.45], text: "1½ FT" }], "THE BASE FLOOR");
      case "ball": return H3(160.6, [K(0, [6.5, 1.5, 5.2], [3.5, 0.1, 1.6], 34), K(5.6, [-2.5, 1.3, 5.4], [-5, 0.1, 1.6], 34)],
        (u) => base({ ...EMPTY, slope: 1, ball: k01(u, 0.5, 5.0) * 0.999 + 0.0005 }),
        [{ at: 3.4, out: 5.8, x: X0 + 0.25, y: 0.3, z: 1.6, text: "BACK TO THE FURNACE", sub: "it never stops rolling", side: "r" }], [], "THE BALL TEST");
      case "gas": return H3(169.1, [K(0, [4, 6, 10], [-1, 0.2, 0], 40), K(3.3, [1, 4.5, 9], [-1, 0.2, 0], 40)],
        () => base({ ...EMPTY, slope: 1, gas: 1, glow: 0.6 }),
        [{ at: 0.6, out: 3.2, x: 3.5, y: 0.4, z: 1.5, text: "ALWAYS FLOWING", sub: "never pooling in a corner", side: "r" }]);
      case "pil": return H3(174.5, [K(0, [3.2, 1.6, 6.2], [-0.6, 0.5, 2.6], 42), K(3.6, [1.8, 1.2, 5.4], [-0.6, 0.5, 2.6], 42)],
        (u) => base({ tile: 0, conc: 0, mos: 0, wall: 0, slope: 1, pil: k01(u, 0.2, 2.6) }), [],
        [{ at: 2.3, out: 3.6, a: [-0.72, 0.86, 2.71], b: [-0.46, 0.86, 2.71], text: "8 IN" }, { at: 2.7, out: 3.6, a: [-0.38, 0, 2.71], b: [-0.38, 0.8, 2.71], text: "2 FT" }]);
      case "forest": return H3(180.7, [K(0, [5.4, 0.42, 2.27], [-6, 0.42, 2.27], 56), K(3.6, [1.2, 0.46, 2.27], [-6, 0.4, 2.0], 56)],
        () => base({ tile: 0, conc: 0, mos: 0, wall: 0, slope: 1 }));
      case "tiles": return H3(190.4, [K(0, [7, 6, 10], [0, 0.8, 0], 40), K(3.7, [5, 5, 9], [0, 0.8, 0], 40)],
        (u) => base({ conc: 0, mos: 0, wall: 0, slope: 1, tile: k01(u, 0.2, 3.0) }), [],
        [{ at: 2.4, out: 3.7, a: [X0 + 0.63 * 9, 0.97, 3.45], b: [X0 + 0.63 * 10, 0.97, 3.45], text: "2 FT" }], "BRIDGING TILES");
      case "final": return H3(198.2, [K(0, [5, 4, 8], [0, 0.8, 0], 40), K(2.0, [8, 7, 12], [0, 0.8, 0], 40)],
        (u) => base({ wall: 0, slope: 1, mos: Math.max(0.001, k01(u, 0.1, 1.3)) }),
        [{ at: 0.4, out: 2.0, x: 5.8, y: 1.15, z: 3.3, text: "CONCRETE", side: "r" }, { at: 0.9, out: 2.0, x: 2.0, y: 1.25, z: 3.3, text: "MOSAIC", side: "r" }]);
    }
    return null;
  };
  const cur = SHOTS3.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS3.map((s, i) => <ShotLayer key={i} S={SHOTS3} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v === T + "w01_vitruvius" && cur.k !== "scroll" && <Embers t={t} n={18} op={0.5} />}
        <Place t={ta} a={139.9} b={141.9} text="A ROMAN ARCHITECT" sub="wrote the instructions down" />
        {cur?.k === "scroll" && <Scroll t={ta} a={142.1} b={148.55} title="DE ARCHITECTURA" sub="VITRUVIUS · c. 25 BC" books={{ at: 145.6, n: 10, hi: 5 }} />}
        <Term t={ta} a={178.2} b={180.8} words={[{ la: "PILAE", en: "STACKS", at: 179.4 }]} y={150} />
        <Readout t={ta} a={185.6} b={187.9} x={1180} y={640} label="MORTAR" value="CLAY + HAIR" hot={false} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
