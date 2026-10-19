// apex02 · MINUTO 3 (123,43–186,25 s) — las patas en X, el rastro que no dice hacia dónde, los pueblos del suroeste,
// Nuevo México 1949, el dibujito contra el pájaro real, quién se lo come y la pregunta que abre el desierto.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { Term } from "./comps2";
import { XTracks, TaleTape, Dust } from "./compsA";
import { DesertMap } from "./DesertMap";
import { R, P, A } from "./M1";

export const OFF3 = 123.43;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 123.43, b: 124.69, v: A + "r46_feet", from: 6.0, out: { type: "cut" } },
  { a: 124.69, b: 126.28, v: A + "r46_feet", from: 9.0, rate: 0.9, cam: [1.1, 0.5, 0.6, 1.3, 0.5, 0.65], out: { type: "cut" } },
  { a: 126.28, b: 127.87, v: A + "r46_feet", from: 10.43, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 127.87, b: 130.03, v: A + "r08_tracks", from: 6.0, grade: "brightness(.6)", out: { type: "dissolve", d: 0.35 } },
  { a: 130.03, b: 132.37, v: P + "856683", from: 1.0, grade: "brightness(.62) contrast(1.1)", k: "x", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 132.37, b: 134.71, v: P + "856683", from: 3.34, grade: "brightness(.62) contrast(1.1)", k: "x", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 134.71, b: 137.05, v: P + "856683", from: 5.68, grade: "brightness(.62) contrast(1.1)", k: "x", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "flash" } },
  { a: 137.05, b: 139.59, v: A + "r09_petro", from: 1.0, out: { type: "cut" } },
  { a: 139.59, b: 142.13, v: A + "r09_petro", from: 3.54, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 142.13, b: 144.31, v: A + "r09_petro", from: 6.5, cam: [1.05, 0.5, 0.5, 1.3, 0.45, 0.5], out: { type: "cut" } },
  { a: 144.31, b: 146.5, v: A + "r09_petro", from: 8.68, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.5 } },
  { a: 146.5, b: 148.55, v: P + "28866513", from: 1.0, grade: "brightness(.7) saturate(.85)", out: { type: "cut" } },
  { a: 148.55, b: 150.6, v: P + "28866513", from: 3.05, grade: "brightness(.7) saturate(.85)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "sweep", d: 0.5 } },
  { a: 150.6, b: 152.75, comp: "nm", out: { type: "cut" } },
  { a: 152.75, b: 154.89, comp: "nm", out: { type: "flash" } },
  { a: 154.89, b: 156.94, v: P + "856593", from: 2.0, out: { type: "cut" } },
  { a: 156.94, b: 159.0, v: P + "856593", from: 4.05, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 159.0, b: 161.12, v: P + "1908630", from: 0.5, rate: 0.8, out: { type: "cut" } },
  { a: 161.12, b: 163.23, v: P + "1908630", from: 2.2, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 163.23, b: 164.87, v: A + "r43_clatter", from: 1.0, grade: "brightness(.55)", k: "tape", out: { type: "cut" } },
  { a: 164.87, b: 166.51, v: A + "r43_clatter", from: 2.64, grade: "brightness(.55)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 166.51, b: 168.2, v: A + "r43_clatter", from: 5.5, grade: "brightness(.55)", k: "tape", out: { type: "cut" } },
  { a: 168.2, b: 169.9, v: A + "r43_clatter", from: 7.19, grade: "brightness(.55)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 169.9, b: 171.69, v: R + "c01", from: 20.0, grade: "brightness(.55)", k: "tape", out: { type: "cut" } },
  { a: 171.69, b: 173.49, v: R + "c01", from: 21.79, grade: "brightness(.55)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 173.49, b: 175.77, v: R + "c14", from: 20.0, cam: [1.25, 0.5, 0.42, 1.32, 0.5, 0.42], out: { type: "cut" } },
  { a: 175.77, b: 177.7, v: A + "r27_coyote", from: 1.0, out: { type: "cut" } },
  { a: 177.7, b: 179.63, v: A + "r27_coyote", from: 2.93, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 179.63, b: 180.91, v: A + "r28_hawk", from: 2.0, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 180.91, b: 183.5, v: P + "3574265", from: 2.0, out: { type: "dissolve", d: 0.4 } },
  { a: 183.5, b: 186.25, v: P + "20709625", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "flash" } },
];
export const SHOTS3: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF3, b: s.b - OFF3 }));
export const M3_END = 186.25;
export const M3_FRAMES = Math.round((M3_END - OFF3) * FPS);
const NM: [number, number][] = [[-109.05, 37], [-103.0, 37], [-103.0, 32.0], [-106.62, 32.0], [-106.53, 31.78], [-108.21, 31.78], [-108.21, 31.33], [-109.05, 31.33]];

export const M3: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF3;
  const L = (x: number) => x - OFF3;
  const renderComp = (s: Shot) => {
    if (s.comp === "nm") return <DesertMap t0={L(150.3)} keys={[
      { at: 0, pos: [-2, 30, 26], look: [-1, 0, 1], fov: 34 },
      { at: 2.2, pos: [9, 16, 7], look: [9, 0, -4.5], fov: 34 },
      { at: 4.8, pos: [10, 13, 5], look: [9.5, 0, -4.8], fov: 34 },
    ]} regions={[{ at: 1.6, poly: NM }]} pins={[{ at: 2.4, lon: -106.6, lat: 35.1, label: "NEW MEXICO", sub: "state bird · 1949", ring: false }]} />;
    return null;
  };
  const cur = SHOTS3.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS3.map((s, i) => <ShotLayer key={i} S={SHOTS3} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v === P + "856683" && <Dust t={ta} n={50} />}
        <Place t={ta} a={124.9} b={127.7} text="2 FORWARD · 2 BACK" sub="toes like an X" />
        <Term t={ta} a={128.0} b={130.0} words={[{ la: "ZYGO", en: "YOKED", at: 128.6 }, { la: "DACTYL", en: "TOES", at: 129.1 }]} y={150} />
        {cur?.k === "x" && <XTracks t={ta} a={130.2} b={136.95} qAt={133.9} />}
        <Place t={ta} a={137.4} b={141.9} text="PUEBLO PEOPLES" sub="American Southwest" />
        <BigWord t={ta} a={146.8} b={150.3} text="SO THE SPIRITS GET LOST" />
        <Place t={ta} a={155.2} b={158.8} text="SAME YEAR · 1949" sub="a cartoon is born" />
        <BigWord t={ta} a={160.3} b={163.0} text="MEEP MEEP" hot />
        {cur?.k === "tape" && <TaleTape t={ta} a={163.3} b={173.4}
          left={{ name: "THE CARTOON", rows: [{ at: 163.6, v: "“MEEP MEEP”" }, { at: 165.0, v: "BEATS THE COYOTE" }] }}
          right={{ name: "THE REAL BIRD", rows: [{ at: 166.8, v: "LOW, DOVE-LIKE COO" }, { at: 169.6, v: "CLATTERS ITS BILL" }] }} />}
        <BigWord t={ta} a={173.7} b={175.6} text="NOT A JOKE" hot />
        <Place t={ta} a={176.1} b={179.4} text="PREDATOR #1 · COYOTE" />
        <Place t={ta} a={179.7} b={180.9} text="PREDATOR #2 · RED-TAILED HAWK" />
        <BigWord t={ta} a={183.7} b={186.1} text="HOW DOES IT SURVIVE?" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
