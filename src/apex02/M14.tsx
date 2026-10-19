// apex02 · MINUTO 14 (848,15–923,58 s) — no es invencible: coyotes, halcones, saqueadores de nidos, el gato doméstico y la
// cascabel que también come pichones; las amenazas sin colmillos; y aun así se expande hacia el este. Tiempos ABSOLUTOS; OFF14.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { RangeMap } from "./RangeMap";
import { R, P, A } from "./M1";

export const OFF14 = 848.15;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 848.15, b: 850.63, v: P + "12639430", from: 5.5, out: { type: "cut" } },
  { a: 850.63, b: 853.12, v: P + "12639430", from: 7.98, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 853.12, b: 856.08, v: R + "d05", from: 2.0, out: { type: "cut" } },
  { a: 856.08, b: 857.91, v: A + "r28_hawk", from: 5.0, out: { type: "cut" } },
  { a: 857.91, b: 860.06, v: A + "r24_nest", from: 8.5, rate: 0.78, grade: "brightness(.6)", out: { type: "cut" } },
  { a: 860.06, b: 862.2, v: A + "r24_nest", from: 10.18, rate: 0.78, grade: "brightness(.6)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 862.2, b: 865.0, v: A + "r29_cat", from: 1.0, out: { type: "cut" } },
  { a: 865.0, b: 867.89, v: P + "4979401", from: 2.0, out: { type: "whip", vx: -1 } },
  { a: 867.89, b: 869.69, v: A + "r40_eggs", from: 1.0, out: { type: "cut" } },
  { a: 869.69, b: 871.5, v: A + "r40_eggs", from: 2.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 871.5, b: 873.25, v: A + "r40_eggs", from: 6.0, out: { type: "cut" } },
  { a: 873.25, b: 875.0, v: A + "r40_eggs", from: 7.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 875.0, b: 876.88, v: P + "4000749", from: 17.0, out: { type: "cut" } },
  { a: 876.88, b: 879.06, v: R + "c07", from: 50.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.55], out: { type: "cut" } },
  { a: 879.06, b: 881.25, v: R + "c07", from: 52.18, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 881.25, b: 883.43, v: R + "c07", from: 54.37, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.55], out: { type: "white", d: 0.35 } },
  { a: 883.43, b: 886.01, v: P + "30680390", from: 12.0, out: { type: "cut" } },
  { a: 886.01, b: 887.7, v: A + "r30_road", from: 4.4, rate: 0.75, out: { type: "cut" } },
  { a: 887.7, b: 889.39, v: A + "r30_road", from: 5.67, rate: 0.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 889.39, b: 892.29, v: A + "r31_clear", from: 1.0, out: { type: "cut" } },
  { a: 892.29, b: 894.0, v: P + "1138674", from: 2.0, grade: "saturate(.4) brightness(.7)", out: { type: "cut" } },
  { a: 894.0, b: 895.7, v: P + "1138674", from: 3.71, grade: "saturate(.4) brightness(.7)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 895.7, b: 897.48, v: A + "r32_drought", from: 1.0, out: { type: "cut" } },
  { a: 897.48, b: 899.25, v: A + "r32_drought", from: 2.78, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 899.25, b: 901.96, v: A + "r63_post", from: 9.5, out: { type: "sweep", d: 0.5 } },
  { a: 901.96, b: 904.33, comp: "range", out: { type: "cut" } },
  { a: 904.33, b: 906.69, comp: "range", out: { type: "cut" } },
  { a: 906.69, b: 909.06, comp: "range", out: { type: "cut" } },
  { a: 909.06, b: 911.43, comp: "range", out: { type: "flash" } },
  { a: 911.43, b: 914.43, v: P + "30848098", from: 8.0, out: { type: "cut" } },
  { a: 914.43, b: 917.43, v: P + "30848098", from: 11.0, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.5 } },
  { a: 917.43, b: 919.13, v: R + "c01", from: 47.3, rate: 0.75, out: { type: "cut" } },
  { a: 919.13, b: 920.84, v: R + "c01", from: 48.58, rate: 0.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 920.84, b: 923.58, v: R + "c01", from: 42.2, rate: 0.9, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "flash" } },
];
export const SHOTS14: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF14, b: s.b - OFF14 }));
export const M14_END = 923.58;
export const M14_FRAMES = Math.round((M14_END - OFF14) * FPS);
const HOME: [number, number] = [-108, 32.8];
const EAST = [{ at: 905.6, n: "ARKANSAS", ll: [-92.4, 34.8] as [number, number] }, { at: 906.6, n: "MISSOURI", ll: [-92.5, 37.6] as [number, number] }, { at: 907.8, n: "LOUISIANA", ll: [-92.3, 31.0] as [number, number] }];

export const M14: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF14;
  const L = (x: number) => x - OFF14;
  const renderComp = (s: Shot) => {
    if (s.comp === "range") return <RangeMap t0={L(901.96)} keys={[
      { at: 0, pos: [-6, 20, 18], look: [-5, 0, 1], fov: 34 },
      { at: 4.0, pos: [2, 26, 22], look: [2, 0, 0], fov: 34 },
      { at: 9.5, pos: [5, 24, 19], look: [5, 0, -0.5], fov: 34 },
    ]} pins={[{ at: 0.5, lon: HOME[0], lat: HOME[1], label: "THE CLASSIC DESERT", ring: true }, ...EAST.map((e) => ({ at: L(e.at) - L(901.96) + 0.5, lon: e.ll[0], lat: e.ll[1], label: e.n, ring: false }))]}
      routes={EAST.map((e) => ({ at: L(e.at) - L(901.96), from: HOME, to: e.ll, d: 0.8 }))} />;
    return null;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS14.map((s, i) => <ShotLayer key={i} S={SHOTS14} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={848.5} b={852.9} text="NOT UNBEATABLE" />
        <Place t={ta} a={853.4} b={855.9} text="COYOTES" sub="especially young birds" />
        <Place t={ta} a={856.2} b={857.8} text="HAWKS" sub="from the air" />
        <Place t={ta} a={858.2} b={862.0} text="NEST RAIDERS" sub="bobcats · raccoons · snakes" />
        <Place t={ta} a={862.5} b={867.7} text="THE HOUSE CAT" sub="one of the most efficient hunters in town" />
        <Place t={ta} a={868.2} b={874.8} text="EVEN RATTLESNAKES" sub="eggs and nestlings" />
        <BigWord t={ta} a={875.1} b={876.8} text="THE WAR GOES BOTH WAYS" hot />
        <Place t={ta} a={877.4} b={883.2} text="THIS MORNING'S MEAL" sub="last year's nest robber?" />
        <BigWord t={ta} a={883.6} b={885.9} text="THREATS WITH NO FANGS" />
        <Place t={ta} a={886.3} b={889.2} text="ROADS" />
        <Place t={ta} a={889.6} b={892.1} text="LAND CLEARED" sub="houses · farms" />
        <Place t={ta} a={892.5} b={895.5} text="PESTICIDES" sub="fewer insects to eat" />
        <Place t={ta} a={895.9} b={899.1} text="LONGER, HOTTER DROUGHTS" />
        <BigWord t={ta} a={899.5} b={901.8} text="AND STILL · HOLDING ON" hot />
        <Place t={ta} a={912.0} b={917.2} text="EVERYWHERE ELSE IS EASY" />
        <Place t={ta} a={917.7} b={920.7} text="LEAST CONCERN" sub="IUCN Red List" />
        <BigWord t={ta} a={921.0} b={923.4} text="THE GROUND CUCKOO IS WINNING" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
