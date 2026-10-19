// apex03 · MINUTO 6 (378,5–457,25 s) — el prontuario de la orca: la ola que barre el témpano (Antártida), la playa a propósito
// (Argentina), el tiburón blanco que se va, la ballena azul de 2019, ciervos y alces nadando; "recordá eso" y la pregunta. OFF6.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { CheckList } from "./compsA";
import { R, P, A } from "./M1";

export const OFF6 = 378.5;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 378.5, b: 380.6, v: P + "6299771", from: 2.0, out: { type: "cut" } },
  { a: 380.6, b: 382.96, v: R + "e03", from: 12.1, rate: 0.8, out: { type: "cut" } },
  { a: 382.96, b: 384.73, v: A + "o18_wavewash", from: 1.0, out: { type: "cut" } },
  { a: 384.73, b: 386.5, v: A + "o18_wavewash", from: 2.77, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 386.5, b: 389.29, v: R + "e03", from: 14.0, k: "wave", out: { type: "cut" } },
  { a: 389.29, b: 392.08, v: R + "e03", from: 16.79, k: "wave", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 392.08, b: 394.19, v: A + "o19_beach", from: 1.0, out: { type: "cut" } },
  { a: 394.19, b: 396.3, v: A + "o19_beach", from: 3.11, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 396.3, b: 398.5, v: A + "o19_beach", from: 6.0, rate: 0.8, out: { type: "cut" } },
  { a: 398.5, b: 400.69, v: A + "o19_beach", from: 7.76, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 400.69, b: 402.69, v: A + "o20_shark_flee", from: 1.0, out: { type: "cut" } },
  { a: 402.69, b: 404.7, v: A + "o20_shark_flee", from: 3.0, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 404.7, b: 406.7, v: A + "o20_shark_flee", from: 5.01, out: { type: "cut" } },
  { a: 406.7, b: 409.09, v: P + "4009789", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 409.09, b: 411.48, v: P + "4009789", from: 4.39, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 411.48, b: 413.87, v: P + "4009789", from: 6.78, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 413.87, b: 416.03, v: R + "e06", from: 14.0, out: { type: "cut" } },
  { a: 416.03, b: 418.2, v: R + "e06", from: 16.16, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 418.2, b: 420.32, v: A + "o21_bluewhale", from: 5.5, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "list", out: { type: "cut" } },
  { a: 420.32, b: 422.43, v: A + "o21_bluewhale", from: 6.77, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "list", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 422.43, b: 424.55, v: A + "o21_bluewhale", from: 8.04, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "list", out: { type: "flash" } },
  { a: 424.55, b: 426.96, v: P + "6120351", from: 2.0, out: { type: "cut" } },
  { a: 426.96, b: 429.23, v: A + "o22_deer_swim", from: 1.0, out: { type: "cut" } },
  { a: 429.23, b: 431.5, v: A + "o22_deer_swim", from: 3.27, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 431.5, b: 433.95, v: A + "o50_moose_swim", from: 1.0, out: { type: "cut" } },
  { a: 433.95, b: 436.4, v: A + "o50_moose_swim", from: 3.45, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 436.4, b: 438.38, v: A + "o22_deer_swim", from: 6.0, rate: 0.7, out: { type: "cut" } },
  { a: 438.38, b: 440.35, v: A + "o22_deer_swim", from: 7.39, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 440.35, b: 441.44, v: A + "o01_bear_swim", from: 10.0, out: { type: "cut" } },
  { a: 441.44, b: 443.72, v: A + "o49_bear_from_below", from: 7.0, out: { type: "cut" } },
  { a: 443.72, b: 445.99, v: A + "o49_bear_from_below", from: 9.28, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 445.99, b: 448.81, v: A + "o43_bear_vs_orca_edge", from: 9.0, rate: 0.5, grade: "blur(4px) brightness(.45)", k: "list2", out: { type: "cut" } },
  { a: 448.81, b: 451.62, v: A + "o43_bear_vs_orca_edge", from: 10.41, rate: 0.5, grade: "blur(4px) brightness(.45)", k: "list2", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 451.62, b: 454.44, v: P + "6953063", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 454.44, b: 457.25, v: P + "6953063", from: 4.82, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
];
export const SHOTS6: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF6, b: s.b - OFF6 }));
export const M6_END = 457.25;
export const M6_FRAMES = Math.round((M6_END - OFF6) * FPS);

export const M6: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF6;
  const cur = SHOTS6.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS6.map((s, i) => <ShotLayer key={i} S={SHOTS6} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={378.8} b={382.8} text="ANTARCTICA" sub="seals resting on floating ice" />
        <BigWord t={ta} a={383.2} b={386.4} text="SIDE BY SIDE" />
        {cur?.k === "wave" && <Place t={ta} a={386.7} b={391.9} text="WAVE-WASHING" sub="a wave over the ice · the seal goes in the water" />}
        <Place t={ta} a={392.4} b={396.2} text="ARGENTINA" sub="orcas throw themselves onto the beach · on purpose" />
        <BigWord t={ta} a={397.6} b={400.5} text="THEN WRIGGLE BACK" />
        <Place t={ta} a={401.0} b={406.5} text="CALIFORNIA · SOUTH AFRICA" sub="great white sharks clear out" />
        <Place t={ta} a={407.0} b={413.7} text="NEAR SAN FRANCISCO" sub="the sharks left for the rest of the season" />
        <Place t={ta} a={414.2} b={418.0} text="WESTERN AUSTRALIA · 2019" sub="a pod vs an adult blue whale" />
        {cur?.k === "list" && <CheckList t={ta} a={418.3} b={424.4} title="ORCA PREY · DOCUMENTED" x={620} y={200} items={[
          { at: 418.4, text: "SEALS", ok: true }, { at: 418.6, text: "SEA LIONS", ok: true }, { at: 418.8, text: "GREAT WHITE SHARKS", ok: true },
          { at: 420.6, text: "BLUE WHALE · LARGEST ANIMAL EVER", ok: true }]} />}
        <BigWord t={ta} a={424.8} b={426.8} text="NOT ONLY SEA ANIMALS" />
        <Place t={ta} a={427.3} b={431.3} text="BRITISH COLUMBIA · ALASKA" sub="Bigg's killer whales vs swimming deer" />
        <BigWord t={ta} a={432.6} b={436.2} text="EVEN MOOSE" hot />
        <Place t={ta} a={436.7} b={440.2} text="LAND ANIMALS · CAUGHT IN THE WATER" sub="a long way from shore" />
        <BigWord t={ta} a={440.4} b={441.4} text="REMEMBER THAT" hot />
        <Place t={ta} a={441.8} b={445.8} text="A PREVIEW" sub="of what this story is really about" />
        {cur?.k === "list2" && <CheckList t={ta} a={446.0} b={451.5} title="SHARK · BLUE WHALE · AND..." x={620} y={260} items={[
          { at: 446.1, text: "GREAT WHITE SHARK", ok: true }, { at: 446.3, text: "BLUE WHALE", ok: true }, { at: 449.0, text: "POLAR BEAR ?", ok: false }]} />}
        <BigWord t={ta} a={452.0} b={457.1} text="WHY THEY ALMOST NEVER MET" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
