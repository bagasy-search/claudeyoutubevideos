// apex03 · MINUTO 10 (642,78–674,96 s) — osos con collar en el mar de Beaufort: nados largos cada vez más comunes, algunos de días;
// madres con crías, el riesgo mayor; la hembra de los 687 km que perdió la cría; "imaginá el encuentro". OFF10.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Readout } from "./comps";
import { IceEtch } from "./comps3";
import { WordStack } from "./compsA";
import { R, P, A } from "./M1";

export const OFF10 = 642.78;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 642.78, b: 645.08, v: A + "o51_collar_bear", from: 1.0, rate: 0.9, k: "beau", out: { type: "cut" } },
  { a: 645.08, b: 647.37, v: A + "o51_collar_bear", from: 3.07, rate: 0.9, k: "beau", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 647.37, b: 649.66, v: A + "o51_collar_bear", from: 5.13, rate: 0.9, k: "beau", out: { type: "cut" } },
  { a: 649.66, b: 651.96, v: A + "o51_collar_bear", from: 7.19, rate: 0.9, k: "beau", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 651.96, b: 654.36, v: A + "o44_storm", from: 1.0, out: { type: "cut" } },
  { a: 654.36, b: 657.36, v: A + "o34_bear_cub_swim", from: 1.0, out: { type: "cut" } },
  { a: 657.36, b: 659.62, v: A + "o34_bear_cub_swim", from: 4.5, rate: 0.8, grade: "blur(3px) brightness(.5)", k: "cub", out: { type: "cut" } },
  { a: 659.62, b: 661.88, v: A + "o34_bear_cub_swim", from: 6.31, rate: 0.8, grade: "blur(3px) brightness(.5)", k: "cub", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 661.88, b: 663.96, v: P + "6744924", from: 2.0, grade: "brightness(.45)", k: "km", out: { type: "cut" } },
  { a: 663.96, b: 666.04, v: P + "6744924", from: 4.08, grade: "brightness(.45)", k: "km", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 666.04, b: 668.12, v: P + "6744924", from: 6.16, grade: "brightness(.45)", k: "km", out: { type: "cut" } },
  { a: 668.12, b: 669.71, v: A + "o35_floe_bear", from: 7.0, out: { type: "cut" } },
  { a: 669.71, b: 671.3, v: A + "o35_floe_bear", from: 8.59, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.4 } },
  { a: 671.3, b: 673.13, v: A + "o42_bear_tracks_ice", from: 1.0, out: { type: "cut" } },
  { a: 673.13, b: 674.96, v: A + "o42_bear_tracks_ice", from: 2.83, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS10: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF10, b: s.b - OFF10 }));
export const M10_END = 674.96;
export const M10_FRAMES = Math.round((M10_END - OFF10) * FPS);

export const M10: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF10;
  const cur = SHOTS10.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS10.map((s, i) => <ShotLayer key={i} S={SHOTS10} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={643.1} b={647.6} text="BEAUFORT SEA" sub="scientists tracking collared bears" />
        {cur?.k === "beau" && <Readout t={ta} a={647.2} b={651.8} x={1250} y={260} label="LONG-DISTANCE SWIMS" value="MORE COMMON" />}
        <BigWord t={ta} a={652.1} b={654.2} text="SOME LASTED FOR DAYS" hot />
        <Place t={ta} a={654.6} b={657.2} text="MOTHERS WITH YOUNG CUBS" sub="the most at risk" />
        {cur?.k === "cub" && <WordStack t={ta} a={657.4} b={661.8} words={[{ at: 657.6, text: "LESS FAT" }, { at: 658.9, text: "COLD FASTER" }, { at: 660.2, text: "CAN'T SWIM AS FAR", hot: true }]} x={120} y={240} size={120} />}
        {cur?.k === "km" && <IceEtch t={ta} a={662.0} b={668.0} x={960} y={430} text="687 KM" kicker="THE RECORD SWIM · WITH A YEARLING CUB" />}
        <BigWord t={ta} a={668.4} b={671.2} text="THE CUB WAS GONE" hot />
        <BigWord t={ta} a={671.5} b={674.8} text="PICTURE THE MEETING" sub="let's play it out honestly" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
