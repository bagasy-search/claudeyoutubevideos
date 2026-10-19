// apex03 · MINUTO 2 (53,14–133,94 s) — el oso: peso, récord, altura de pie, olfato, patas-raqueta, piel negra y pelo hueco,
// presas (focas) y el primer método: esperar en el agujero de respiración y golpear. Tiempos ABSOLUTOS; OFF2.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter, Snow } from "./comps";
import { SpanMark } from "./comps4";
import { WeighIn, HollowHair, Lock } from "./compsA";
import { R, P, A } from "./M1";

export const OFF2 = 53.14;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 53.14, b: 54.68, v: A + "o11_bear_stand", from: 1.0, out: { type: "cut" } },
  { a: 54.68, b: 55.92, v: P + "26647326", from: 2.0, cam: [1.05, 0.55, 0.6, 1.2, 0.55, 0.6], out: { type: "cut" } },
  { a: 55.92, b: 57.16, v: P + "26647326", from: 3.24, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 57.16, b: 58.4, v: P + "26647326", from: 4.48, cam: [1.05, 0.55, 0.6, 1.2, 0.55, 0.6], out: { type: "whip", vx: 1 } },
  { a: 58.4, b: 59.91, v: A + "o26_bear_on_ice", from: 5.9, k: "weigh", out: { type: "cut" } },
  { a: 59.91, b: 61.42, v: A + "o26_bear_on_ice", from: 7.41, k: "weigh", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 61.42, b: 62.93, v: A + "o26_bear_on_ice", from: 8.92, k: "weigh", out: { type: "cut" } },
  { a: 62.93, b: 64.44, v: A + "o26_bear_on_ice", from: 10.43, k: "weigh", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 64.44, b: 67.0, v: R + "e05", from: 24.0, grade: "brightness(.7)", k: "record", out: { type: "cut" } },
  { a: 67.0, b: 69.56, v: R + "e05", from: 26.56, grade: "brightness(.7)", k: "record", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 69.56, b: 71.91, v: A + "o11_bear_stand", from: 5.0, cam: [1.0, 0.5, 0.6, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 71.91, b: 74.26, v: A + "o11_bear_stand", from: 7.35, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 74.26, b: 76.28, v: A + "o12_bear_sniff", from: 1.0, out: { type: "cut" } },
  { a: 76.28, b: 78.3, v: A + "o12_bear_sniff", from: 3.02, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 78.3, b: 80.37, v: A + "o12_bear_sniff", from: 6.5, cam: [1.1, 0.5, 0.5, 1.25, 0.45, 0.5], out: { type: "cut" } },
  { a: 80.37, b: 82.44, v: A + "o12_bear_sniff", from: 8.57, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 82.44, b: 84.42, v: A + "o09_bear_paw", from: 1.0, k: "paw", out: { type: "cut" } },
  { a: 84.42, b: 86.4, v: A + "o09_bear_paw", from: 2.98, k: "paw", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 86.4, b: 88.57, v: A + "o08_bear_dive", from: 1.0, out: { type: "cut" } },
  { a: 88.57, b: 90.74, v: A + "o08_bear_dive", from: 3.17, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 90.74, b: 92.67, v: A + "o10_bear_fur", from: 1.0, out: { type: "cut" } },
  { a: 92.67, b: 94.6, v: A + "o10_bear_fur", from: 2.93, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 94.6, b: 96.56, v: A + "o10_bear_fur", from: 5.5, cam: [1.1, 0.5, 0.5, 1.3, 0.5, 0.5], out: { type: "cut" } },
  { a: 96.56, b: 98.52, v: A + "o10_bear_fur", from: 7.46, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 98.52, b: 101.29, v: A + "o10_bear_fur", from: 9.5, rate: 0.4, grade: "blur(7px) brightness(.35)", k: "hair", out: { type: "cut" } },
  { a: 101.29, b: 104.06, v: A + "o10_bear_fur", from: 10.61, rate: 0.4, grade: "blur(7px) brightness(.35)", k: "hair", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 104.06, b: 105.95, v: P + "854332", from: 2.0, out: { type: "cut" } },
  { a: 105.95, b: 107.84, v: P + "854332", from: 3.89, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 107.84, b: 109.95, v: A + "o39_seal_floe", from: 1.0, out: { type: "cut" } },
  { a: 109.95, b: 112.06, v: A + "o39_seal_floe", from: 3.11, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 112.06, b: 114.54, v: P + "7042027", from: 2.0, out: { type: "dissolve", d: 0.35 } },
  { a: 114.54, b: 116.55, v: P + "6884650", from: 2.0, cam: [1.0, 0.5, 0.5, 1.2, 0.45, 0.5], out: { type: "cut" } },
  { a: 116.55, b: 118.55, v: P + "6884650", from: 4.01, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 118.55, b: 120.56, v: P + "6884650", from: 6.01, cam: [1.0, 0.5, 0.5, 1.2, 0.45, 0.5], out: { type: "cut" } },
  { a: 120.56, b: 122.28, v: A + "o04_bear_breath_hole", from: 1.0, out: { type: "cut" } },
  { a: 122.28, b: 124.0, v: A + "o04_bear_breath_hole", from: 2.72, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 124.0, b: 126.84, v: A + "o04_bear_breath_hole", from: 6.5, out: { type: "cut" } },
  { a: 126.84, b: 129.21, v: A + "o05_bear_strike", from: 0.5, rate: 0.8, out: { type: "cut" } },
  { a: 129.21, b: 131.57, v: A + "o05_bear_strike", from: 2.4, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 131.57, b: 133.94, v: A + "o05_bear_strike", from: 4.28, rate: 0.8, out: { type: "flash" } },
];
export const SHOTS2: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF2, b: s.b - OFF2 }));
export const M2_END = 133.94;
export const M2_FRAMES = Math.round((M2_END - OFF2) * FPS);

export const M2: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF2;
  const cur = SHOTS2.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS2.map((s, i) => <ShotLayer key={i} S={SHOTS2} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={53.3} b={54.6} text="THE BEAR" />
        <Place t={ta} a={55.0} b={58.3} text="LARGEST CARNIVORE ON LAND" sub="Ursus maritimus" />
        {cur?.k === "weigh" && <WeighIn t={ta} a={58.6} b={64.3} from={350} to={700} unit="kg" caption="BIG ADULT MALE" sub="usually" />}
        {cur?.k === "record" && <Counter t={ta} a={64.8} b={69.4} from={0} to={1000} dur={1.6} unit="KG" kicker="HEAVIEST EVER RECORDED · AROUND" comma x={160} y={330} hot />}
        <BigWord t={ta} a={70.0} b={74.1} text="OVER 3 M ON ITS HIND LEGS" />
        <Place t={ta} a={74.6} b={78.2} text="SMELLS A SEAL" sub="from almost a mile away" />
        <Place t={ta} a={78.6} b={82.3} text="UNDER ~1 M OF SNOW" sub="it still finds the den" />
        {cur?.k === "paw" && <SpanMark t={ta} a={82.7} b={86.3} x1={620} x2={1300} y={900} label="UP TO 30 CM" sub="across" />}
        <Place t={ta} a={86.7} b={90.6} text="SNOWSHOES · PADDLES" />
        <Lock t={ta} a={91.2} b={94.5} x={620} y={300} w={680} h={460} label="BLACK SKIN" sub="soaks up the weak Arctic sun" red />
        <BigWord t={ta} a={95.0} b={98.4} text="THE FUR ISN'T WHITE" hot />
        {cur?.k === "hair" && <HollowHair t={ta} a={98.6} b={103.9} skinAt={101.8} />}
        <BigWord t={ta} a={104.3} b={107.7} text="BUILT FOR ONE JOB: SEALS" />
        <Place t={ta} a={108.1} b={111.9} text="RINGED SEALS · BEARDED SEALS" sub="hunted from the ice" />
        <Place t={ta} a={112.3} b={114.4} text="METHOD 1 · PATIENCE" />
        <Place t={ta} a={115.0} b={120.4} text="BREATHING HOLES" sub="kept open all winter" />
        <Place t={ta} a={121.0} b={126.7} text="IT LIES DOWN · AND WAITS" sub="sometimes for hours" />
        <BigWord t={ta} a={127.6} b={130.6} text="STRIKE" hot />
        {(cur?.v === P + "854332" || cur?.v === P + "7042027") && <Snow t={ta} n={60} op={0.5} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
