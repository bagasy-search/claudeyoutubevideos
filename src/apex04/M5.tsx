// apex04 · MINUTO 5 (244,56–307,58 s) — el golpe, la mordida medida, el giro de la muerte, las cifras del IUCN.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Gauge, Counter, SourceCard, Fraction, Letterbox } from "./comps";

export const OFF5 = 244.56, END5 = 307.58;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 244.56, b: 247.0, v: T + "g39_tail", from: 1.0, out: { type: "cut" } },
  { a: 247.0, b: 250.06, v: R + "croc_32747323", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "flash" } },
  { a: 250.06, b: 252.4, img: F + "croc_6c3909dd.jpg", cam: [1.3, 0.45, 0.55, 1.05, 0.5, 0.5], out: { type: "cut" } },
  { a: 252.4, b: 254.91, img: F + "croc_d714ea51.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 254.91, b: 258.0, v: R + "croc_20798092", from: 1.0, k: "gauge", cam: [1.05, 0.45, 0.5, 1.15, 0.45, 0.5], out: { type: "cut" } },
  { a: 258.0, b: 261.2, v: R + "croc_10041465", from: 0.5, k: "gauge", cam: [1.05, 0.4, 0.5, 1.15, 0.4, 0.5], out: { type: "cut" } },
  { a: 261.2, b: 264.35, img: F + "croc_92c5b21d.jpg", k: "gauge", cam: [1.05, 0.4, 0.5, 1.15, 0.35, 0.5], out: { type: "flash" } },
  { a: 264.35, b: 266.3, v: R + "anim_26730259", from: 1.0, out: { type: "cut" } },
  { a: 266.3, b: 268.12, v: R + "anim_11025401", from: 1.0, out: { type: "cut" } },
  { a: 268.12, b: 270.79, v: R + "croc_2885406", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 270.79, b: 272.5, img: F + "croc_35246e83.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "flash" } },
  { a: 272.5, b: 274.11, v: T + "g10_death_roll", from: 1.5, out: { type: "cut" } },
  { a: 274.11, b: 276.6, v: R + "croc_6216873", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 276.6, b: 278.8, img: F + "croc_98f3e234.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.55], out: { type: "cut" } },
  { a: 278.8, b: 280.9, v: R + "river_2328749", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 280.9, b: 283.2, img: F + "croc_6bb9fb17.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 283.2, b: 286.32, v: R + "anim_5146599", from: 1.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "flash" } },
  { a: 286.32, b: 289.0, v: R + "croc_35076399", from: 1.0, out: { type: "cut" } },
  { a: 289.0, b: 292.49, v: R + "croc_11179194", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.45, 0.5], out: { type: "sweep", d: 0.5 } },
  { a: 292.49, b: 295.6, v: R + "croc_11179212", from: 1.0, k: "iucn", out: { type: "cut" } },
  { a: 295.6, b: 298.4, v: R + "croc_11179213", from: 1.0, k: "iucn", out: { type: "cut" } },
  { a: 298.4, b: 301.23, v: R + "croc_17239219", from: 1.0, k: "iucn", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "flash" } },
  { a: 301.23, b: 304.4, v: R + "croc_20600433", from: 1.0, k: "frac", cam: [1.05, 0.3, 0.5, 1.12, 0.3, 0.5], out: { type: "cut" } },
  { a: 304.4, b: 307.58, img: F + "croc_0247d9d3.jpg", k: "frac", cam: [1.05, 0.3, 0.5, 1.15, 0.3, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF5, b: s.b - OFF5 }));

export const M5: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF5;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={247.2} b={249.95} text="FASTER THAN YOU" sub="can react" red size={170} />
        {cur?.k === "gauge" && <Gauge t={ta} a={255.0} b={264.3} value={3700} max={4000} unit="LB" caption="BITE FORCE · saltwater crocodile, measured" />}
        <Place t={ta} a={264.5} b={268.0} text="Large prey" sub="zebra · wildebeest · buffalo" />
        <BigWord t={ta} a={268.3} b={270.7} text="NO FIGHT" size={210} />
        <BigWord t={ta} a={274.3} b={278.7} text="THE DEATH ROLL" red size={170} />
        <Place t={ta} a={281.1} b={286.2} text="Far heavier than a person" sub="and still taken" />
        <BigWord t={ta} a={289.2} b={292.4} text="AFRICA'S #1" sub="wild killer of people" red size={190} />
        {cur?.k === "iucn" && <SourceCard t={ta} a={292.7} b={301.1} kicker="IUCN · CROCODILE SPECIALIST GROUP" title="Nile crocodile attacks" sub="since 2000" x={120} y={240} />}
        {cur?.k === "iucn" && <Counter t={ta} a={296.0} b={301.1} to={300} dur={1.6} kicker="MORE THAN" unit="ATTACKS / YEAR" red x={820} y={520} size={200} />}
        {cur?.k === "frac" && <Fraction t={ta} a={301.4} b={307.5} n={3} red={2} label="ATTACKS THAT WERE FATAL · mainland Africa" />}
        <Place t={ta} a={305.6} b={307.5} text="Many never reported" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M5_FRAMES = Math.round((END5 - OFF5) * FPS);
