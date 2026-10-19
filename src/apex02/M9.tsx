// apex02 · MINUTO 9 (527,26–598,63 s) — la ventana después del golpe, el pico detrás de la cabeza, los golpes contra el suelo,
// tragar de cabeza, la serpiente que no entra y el pájaro que camina horas con la cola colgando. Tiempos ABSOLUTOS; OFF9.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { RecoilWindow, SizeMatch, Lock, WordStack, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF9 = 527.26;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 527.26, b: 529.13, v: R + "c10", from: 2.0, out: { type: "cut" } },
  { a: 529.13, b: 531.0, v: R + "c10", from: 3.87, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 531.0, b: 533.38, v: R + "c13", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 533.38, b: 535.76, v: R + "c13", from: 4.38, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 535.76, b: 538.44, v: A + "r17_miss", from: 2.9, rate: 0.38, grade: "blur(6px) brightness(.4)", k: "window", out: { type: "cut" } },
  { a: 538.44, b: 541.13, v: A + "r17_miss", from: 3.92, rate: 0.38, grade: "blur(6px) brightness(.4)", k: "window", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 541.13, b: 542.83, v: R + "c01", from: 24.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 542.83, b: 544.53, v: R + "c01", from: 25.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 544.53, b: 546.37, v: A + "r53_clamp", from: 0.5, out: { type: "cut" } },
  { a: 546.37, b: 548.2, v: A + "r53_clamp", from: 2.34, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 548.2, b: 549.96, v: A + "r53_clamp", from: 5.0, rate: 0.7, k: "clamp", out: { type: "cut" } },
  { a: 549.96, b: 551.71, v: A + "r53_clamp", from: 6.23, rate: 0.7, k: "clamp", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 551.71, b: 554.11, v: A + "r54_lift_slam", from: 0.5, out: { type: "cut" } },
  { a: 554.11, b: 556.5, v: A + "r54_lift_slam", from: 2.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 556.5, b: 559.04, v: A + "r54_lift_slam", from: 6.0, out: { type: "cut" } },
  { a: 559.04, b: 561.57, v: A + "r54_lift_slam", from: 8.54, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vy: 1 } },
  { a: 561.57, b: 564.01, v: A + "r55_turn_swallow", from: 0.5, out: { type: "cut" } },
  { a: 564.01, b: 566.45, v: A + "r55_turn_swallow", from: 2.94, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 566.45, b: 568.86, v: A + "r55_turn_swallow", from: 6.0, cam: [1.05, 0.5, 0.45, 1.2, 0.5, 0.45], out: { type: "cut" } },
  { a: 568.86, b: 571.27, v: A + "r55_turn_swallow", from: 8.41, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 571.27, b: 573.8, v: P + "13778952", from: 8.0, grade: "blur(6px) brightness(.4)", k: "size", out: { type: "cut" } },
  { a: 573.8, b: 576.33, v: P + "13778952", from: 10.53, grade: "blur(6px) brightness(.4)", k: "size", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 576.33, b: 578.21, v: A + "r05_tail_hang", from: 3.0, rate: 0.91, out: { type: "cut" } },
  { a: 578.21, b: 580.09, v: A + "r05_tail_hang", from: 4.71, rate: 0.91, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 580.09, b: 582.1, v: A + "r56_hang_walk", from: 0.5, out: { type: "cut" } },
  { a: 582.1, b: 584.12, v: A + "r56_hang_walk", from: 2.51, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 584.12, b: 586.13, v: A + "r56_hang_walk", from: 4.53, out: { type: "cut" } },
  { a: 586.13, b: 588.15, v: A + "r56_hang_walk", from: 7.0, cam: [1.1, 0.5, 0.45, 1.25, 0.5, 0.45], out: { type: "cut" } },
  { a: 588.15, b: 590.17, v: A + "r56_hang_walk", from: 9.02, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 590.17, b: 592.09, v: A + "r25_feed", from: 1.0, out: { type: "cut" } },
  { a: 592.09, b: 594.0, v: A + "r25_feed", from: 2.92, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 594.0, b: 596.32, v: A + "r05_tail_hang", from: 9.0, rate: 0.6, out: { type: "cut" } },
  { a: 596.32, b: 598.63, v: A + "r05_tail_hang", from: 10.39, rate: 0.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS9: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF9, b: s.b - OFF9 }));
export const M9_END = 598.63;
export const M9_FRAMES = Math.round((M9_END - OFF9) * FPS);

export const M9: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF9;
  const cur = SHOTS9.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS9.map((s, i) => <ShotLayer key={i} S={SHOTS9} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={527.6} b={530.9} text="FAST GOING OUT" />
        <Place t={ta} a={531.3} b={535.6} text="SLOW COMING BACK" sub="pull the head back · coil again" />
        {cur?.k === "window" && <RecoilWindow t={ta} a={535.8} b={541.0} winAt={537.6} />}
        <BigWord t={ta} a={541.4} b={544.4} text="THE WHOLE PLAN" hot />
        <BigWord t={ta} a={545.0} b={548.0} text="IT DARTS IN" />
        {cur?.k === "clamp" && <Lock t={ta} a={548.4} b={551.6} x={640} y={300} w={640} h={420} label="BEHIND THE HEAD" sub="the fangs can't turn around" red />}
        <WordStack t={ta} a={553.0} b={556.4} words={[{ at: 553.2, text: "LIFT" }, { at: 554.0, text: "SLAM" }, { at: 555.2, text: "AGAIN", hot: true }]} x={1300} y={260} size={120} />
        <Place t={ta} a={557.0} b={561.4} text="SAME MOVE AS A LIZARD" sub="only now with more at stake" />
        <Place t={ta} a={562.2} b={566.3} text="WHEN IT STOPS MOVING" />
        <Place t={ta} a={566.7} b={571.1} text="HEAD FIRST · ALWAYS" sub="so the scales slide down smoothly" />
        {cur?.k === "size" && <SizeMatch t={ta} a={571.4} b={576.2} />}
        <BigWord t={ta} a={576.6} b={580.0} text="WHAT NO OTHER PREDATOR WOULD DARE" />
        {cur?.v === A + "r56_hang_walk" && <Dust t={ta} n={30} op={0.35} />}
        <Place t={ta} a={581.0} b={585.9} text="THE REST HANGS OUT" sub="of its beak" />
        <Place t={ta} a={586.4} b={590.0} text="DIGEST · SWALLOW A LITTLE MORE" />
        <Place t={ta} a={590.5} b={593.9} text="EVEN FEEDS ITS CHICKS" />
        <BigWord t={ta} a={594.3} b={598.5} text="FOR HOURS" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
