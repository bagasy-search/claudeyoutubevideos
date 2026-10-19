// apex02 · MINUTO 6 (335,19–405,21 s) — cómo mata (golpe contra la piedra, entero y de cabeza), los venenos que ignora,
// y la vuelta a la cascabel: ficha, fosetas de calor, visión infrarroja y la mordida medida con cámara rápida. Tiempos ABSOLUTOS; OFF6.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { SpanMark } from "./comps4";
import { CaseFile, CheckList, Lock, WordStack, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF6 = 335.19;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 335.19, b: 336.92, v: R + "c01", from: 15.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 336.92, b: 338.65, v: R + "c01", from: 16.73, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 338.65, b: 341.11, v: A + "r04_slam", from: 2.4, out: { type: "cut" } },
  { a: 341.11, b: 344.0, v: A + "r04_slam", from: 8.5, k: "slam", out: { type: "flash" } },
  { a: 344.0, b: 346.97, v: P + "5862024", from: 2.0, grade: "brightness(.7) saturate(.8)", out: { type: "whip", vx: -1 } },
  { a: 346.97, b: 348.53, v: A + "r44_swallow", from: 4.5, out: { type: "cut" } },
  { a: 348.53, b: 350.09, v: A + "r44_swallow", from: 6.06, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 350.09, b: 351.45, v: A + "r14_scorpion", from: 9.0, k: "check", out: { type: "cut" } },
  { a: 351.45, b: 352.65, v: P + "2631159", from: 2.0, k: "check", out: { type: "cut" } },
  { a: 352.65, b: 354.13, v: P + "17875473", from: 2.0, k: "check", out: { type: "cut" } },
  { a: 354.13, b: 356.14, v: R + "c01", from: 33.0, k: "check", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 356.14, b: 358.15, v: R + "c01", from: 35.01, k: "check", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.5 } },
  { a: 358.15, b: 360.08, v: R + "c08", from: 2.0, grade: "brightness(.75)", cam: [1.1, 0.5, 0.5, 1.35, 0.5, 0.55], out: { type: "cut" } },
  { a: 360.08, b: 362.01, v: R + "c08", from: 3.93, grade: "brightness(.75)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 362.01, b: 364.07, v: P + "28288550", from: 0.9, k: "file", out: { type: "cut" } },
  { a: 364.07, b: 366.13, v: P + "28288550", from: 2.96, k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 366.13, b: 367.88, v: P + "4000749", from: 8.0, k: "file", out: { type: "cut" } },
  { a: 367.88, b: 369.63, v: P + "4000749", from: 9.75, k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 369.63, b: 371.62, v: R + "c06", from: 3.5, grade: "brightness(.5) saturate(.7)", k: "file", cam: [1.15, 0.45, 0.7, 1.3, 0.45, 0.72], out: { type: "cut" } },
  { a: 371.62, b: 373.61, v: R + "c06", from: 5.49, grade: "brightness(.5) saturate(.7)", k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 373.61, b: 375.33, v: A + "r18_pits", from: 4.0, out: { type: "cut" } },
  { a: 375.33, b: 377.05, v: A + "r18_pits", from: 5.72, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 377.05, b: 379.04, v: A + "r18_pits", from: 7.5, k: "pits", cam: [1.0, 0.5, 0.5, 1.25, 0.45, 0.5], out: { type: "cut" } },
  { a: 379.04, b: 381.03, v: A + "r18_pits", from: 9.49, k: "pits", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 381.03, b: 382.71, v: A + "r19_thermal", from: 0.3, out: { type: "cut" } },
  { a: 382.71, b: 385.08, v: A + "r19_thermal", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 385.08, b: 387.44, v: A + "r19_thermal", from: 4.37, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 387.44, b: 389.81, v: A + "r19_thermal", from: 6.73, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "white", d: 0.35 } },
  { a: 389.81, b: 392.12, v: A + "r48_strike_side", from: 9.0, rate: 0.625, out: { type: "cut" } },
  { a: 392.12, b: 394.43, v: A + "r48_strike_side", from: 10.44, rate: 0.625, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 394.43, b: 397.22, v: R + "c09", from: 3.5, rate: 0.5, k: "lab", out: { type: "cut" } },
  { a: 397.22, b: 400.01, v: R + "c09", from: 4.9, rate: 0.5, k: "lab", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 400.01, b: 402.61, v: A + "r20_krat", from: 1.0, rate: 0.8, out: { type: "cut" } },
  { a: 402.61, b: 405.21, v: A + "r20_krat", from: 3.08, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS6: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF6, b: s.b - OFF6 }));
export const M6_END = 405.21;
export const M6_FRAMES = Math.round((M6_END - OFF6) * FPS);

export const M6: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF6;
  const cur = SHOTS6.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS6.map((s, i) => <ShotLayer key={i} S={SHOTS6} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={335.5} b={338.5} text="SAME WAY · EVERY TIME" />
        <WordStack t={ta} a={340.6} b={343.9} words={[{ at: 340.67, text: "SLAM" }, { at: 341.37, text: "SLAM" }, { at: 342.07, text: "SLAM", hot: true }]} x={1250} y={250} size={130} />
        <Place t={ta} a={344.6} b={346.8} text="UNTIL IT GOES LIMP" />
        <Place t={ta} a={347.4} b={349.9} text="SWALLOWED WHOLE" sub="head first" />
        {cur?.k === "check" && <CheckList t={ta} a={350.1} b={358.05} title="SMALL INCONVENIENCES" items={[{ at: 350.3, text: "SCORPION STING", ok: true }, { at: 351.6, text: "LIZARD BITE", ok: true }, { at: 352.9, text: "SPIDER VENOM", ok: true }]} />}
        <Place t={ta} a={358.5} b={361.8} text="BACK UNDER THE CREOSOTE" />
        {cur?.k === "file" && <CaseFile t={ta} a={362.1} b={373.5} num="02-B" name="WESTERN DIAMONDBACK" latin="Crotalus atrox · one of the largest rattlesnakes"
          rows={[{ at: 366.4, k: "TYPICAL ADULT", v: "~1.2 M · 4 FT" }, { at: 370.4, k: "RECORD", v: "7+ FT", hot: true }, { at: 371.6, k: "SENSES", v: "EYES + HEAT PITS" }, { at: 372.4, k: "STRIKE", v: "< 1/10 S", hot: true }]} />}
        {cur?.k === "pits" && <Lock t={ta} a={377.3} b={380.9} x={700} y={360} w={520} h={320} label="HEAT PITS" sub="between eye and nostril" red />}
        <BigWord t={ta} a={381.2} b={382.6} text="THEY SENSE HEAT" hot />
        <Place t={ta} a={383.3} b={389.6} text="PAINTED IN INFRARED" sub="a warm mouse on cold ground" />
        <BigWord t={ta} a={390.2} b={394.2} text="FASTER THAN ALMOST ANYTHING" />
        {cur?.k === "lab" && <Place t={ta} a={394.7} b={399.9} text="HIGH-SPEED CAMERA · IN THE WILD" sub="rattlesnakes vs kangaroo rats" />}
        {cur?.k === "lab" && <Dust t={ta} n={25} op={0.3} />}
        <BigWord t={ta} a={402.3} b={405.1} text="UNDER 1/10 OF A SECOND" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
void SpanMark;
