// apex02 · MINUTO 2 (56,13–123,43 s) — el nombre (cuco de tierra), el primo europeo, el tamaño, el peso, vuela poco,
// el motor en las patas (20 mph) y la cola-timón. Tiempos ABSOLUTOS de la voz; OFF2 los pasa a locales.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { Term } from "./comps2";
import { SpanMark } from "./comps4";
import { Lock, RadarGun, Dust, RudderTurn } from "./compsA";
import { R, P, A } from "./M1";

export const OFF2 = 56.13;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 56.13, b: 57.52, v: R + "c03", from: 6.0, cam: [1.05, 0.5, 0.5, 1.15, 0.45, 0.55], out: { type: "cut" } },
  { a: 57.52, b: 58.9, v: R + "c03", from: 7.39, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 58.9, b: 60.27, v: A + "r10_eye", from: 1.0, out: { type: "cut" } },
  { a: 60.27, b: 61.65, v: A + "r10_eye", from: 2.37, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 61.65, b: 63.28, v: A + "r49_cuckoo", from: 1.0, out: { type: "cut" } },
  { a: 63.28, b: 64.9, v: A + "r49_cuckoo", from: 2.63, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 64.9, b: 66.52, v: P + "17342972", from: 2.0, out: { type: "cut" } },
  { a: 66.52, b: 68.13, v: P + "17342972", from: 3.62, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 68.13, b: 70.6, v: A + "r42_glide", from: 1.0, out: { type: "cut" } },
  { a: 70.6, b: 73.31, v: A + "r03_sprint", from: 4.0, out: { type: "flash" } },
  { a: 73.31, b: 76.0, v: R + "c01", from: 28.0, k: "span", out: { type: "whip", vx: 1 } },
  { a: 76.0, b: 78.7, v: A + "r63_post", from: 3.0, out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 78.7, b: 81.21, v: R + "c03", from: 10.0, out: { type: "cut" } },
  { a: 81.21, b: 83.35, v: A + "r50_bird_hold", from: 1.0, out: { type: "cut" } },
  { a: 83.35, b: 85.5, v: A + "r50_bird_hold", from: 3.14, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 85.5, b: 87.69, v: R + "c02", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.45], out: { type: "cut" } },
  { a: 87.69, b: 89.87, v: R + "c02", from: 3.19, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 89.87, b: 92.85, v: A + "r41_post", from: 1.0, out: { type: "cut" } },
  { a: 92.85, b: 95.6, v: A + "r41_post", from: 6.5, out: { type: "whip", vy: 1 } },
  { a: 95.6, b: 98.09, v: A + "r42_glide", from: 6.0, out: { type: "zoom", fx: 0.5, fy: 0.7 } },
  { a: 98.09, b: 99.72, v: A + "r03_sprint", from: 7.5, cam: [1.25, 0.5, 0.8, 1.4, 0.5, 0.85], out: { type: "cut" } },
  { a: 99.72, b: 101.35, v: A + "r03_sprint", from: 9.13, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 101.35, b: 102.97, v: A + "r30_road", from: 1.0, k: "radar", out: { type: "cut" } },
  { a: 102.97, b: 104.6, v: A + "r30_road", from: 2.62, k: "radar", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 104.6, b: 106.17, v: A + "r65_run_flat", from: 2.0, k: "radar", out: { type: "cut" } },
  { a: 106.17, b: 107.75, v: A + "r65_run_flat", from: 3.57, k: "radar", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 107.75, b: 110.0, v: R + "c01", from: 45.0, out: { type: "cut" } },
  { a: 110.0, b: 112.25, v: R + "c03", from: 12.5, cam: [1.1, 0.4, 0.5, 1.25, 0.4, 0.55], out: { type: "whip", vx: -1 } },
  { a: 112.25, b: 114.83, v: A + "r45_rudder", from: 0.5, out: { type: "cut" } },
  { a: 114.83, b: 117.4, v: A + "r45_rudder", from: 3.08, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 117.4, b: 119.41, v: A + "r45_rudder", from: 5.7, rate: 0.78, grade: "blur(6px) brightness(.45) saturate(.8)", k: "rudder", cam: [1.08, 0.5, 0.5, 1.14, 0.5, 0.5], out: { type: "cut" } },
  { a: 119.41, b: 121.42, v: A + "r45_rudder", from: 7.27, rate: 0.78, grade: "blur(6px) brightness(.45) saturate(.8)", k: "rudder", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 121.42, b: 123.43, v: A + "r45_rudder", from: 8.84, rate: 0.78, grade: "blur(6px) brightness(.45) saturate(.8)", k: "rudder", cam: [1.08, 0.5, 0.5, 1.14, 0.5, 0.5], out: { type: "flash" } },
];
export const SHOTS2: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF2, b: s.b - OFF2 }));
export const M2_END = 123.43;
export const M2_FRAMES = Math.round((M2_END - OFF2) * FPS);
const DUSTY = new Set([A + "r42_glide", A + "r03_sprint", A + "r30_road"]);

export const M2: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF2;
  const cur = SHOTS2.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS2.map((s, i) => <ShotLayer key={i} S={SHOTS2} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && DUSTY.has(cur.v) && <Dust t={ta} n={60} />}
        <Term t={ta} a={56.4} b={61.5} words={[{ la: "GEO", en: "GROUND", at: 58.3 }, { la: "COCCYX", en: "CUCKOO", at: 59.4 }]} y={140} />
        <Place t={ta} a={62.0} b={64.8} text="COMMON CUCKOO" sub="its cousin · European forests" />
        <BigWord t={ta} a={68.6} b={70.5} text="CAME DOWN TO THE GROUND" />
        <BigWord t={ta} a={71.2} b={73.2} text="AND RAN" hot />
        {cur?.k === "span" && <SpanMark t={ta} a={73.5} b={75.95} x1={420} x2={1500} y={900} label="50–60 CM" sub="bill to tail · about 2 ft" />}
        <BigWord t={ta} a={78.9} b={81.1} text="HALF OF IT IS TAIL" />
        <Lock t={ta} a={81.6} b={85.4} x={560} y={260} w={800} h={600} label="220–540 G" sub="the whole bird" red />
        <Place t={ta} a={85.9} b={89.6} text="SMALLER THAN IT LOOKS" sub="all feathers and tail" />
        <Place t={ta} a={90.1} b={92.7} text="IT CAN FLY" sub="it rarely bothers" />
        <BigWord t={ta} a={98.4} b={101.2} text="THE ENGINE IS IN THE LEGS" />
        {cur?.k === "radar" && <RadarGun t={ta} a={101.5} b={107.6} mph={20} />}
        <BigWord t={ta} a={108.0} b={109.9} text="FASTER THAN YOU" hot />
        <Place t={ta} a={110.2} b={112.1} text="FITS IN ONE HAND" />
        {cur?.k === "rudder" && <RudderTurn t={ta} a={117.5} b={123.3} turnAt={119.6} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
