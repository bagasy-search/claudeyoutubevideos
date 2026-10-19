// apex02 · MINUTO 11 (651,35–697,44 s) — la cola caliente de la ardilla (aviso en infrarrojo), la culebra real, mangosta y
// ratel; el tablero de inmunes donde el correcaminos queda en cruz; "velocidad, plumas, momento" y la cuarta cosa. Tiempos ABSOLUTOS; OFF11.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { CheckList, WordStack } from "./compsA";
import { R, P, A } from "./M1";

export const OFF11 = 651.35;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 651.35, b: 653.59, v: R + "d04", from: 12.0, out: { type: "cut" } },
  { a: 653.59, b: 655.39, v: A + "r36_squirrel", from: 1.0, out: { type: "cut" } },
  { a: 655.39, b: 657.2, v: A + "r36_squirrel", from: 2.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 657.2, b: 659.75, v: A + "r36_squirrel", from: 5.0, grade: "url(#thermal)", out: { type: "cut" } },
  { a: 659.75, b: 662.29, v: A + "r36_squirrel", from: 7.55, grade: "url(#thermal)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 662.29, b: 665.3, v: A + "r34_king", from: 1.0, out: { type: "cut" } },
  { a: 665.3, b: 667.12, v: A + "r34_king", from: 6.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 667.12, b: 668.93, v: A + "r34_king", from: 7.82, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 668.93, b: 671.2, v: R + "d09", from: 2.0, out: { type: "cut" } },
  { a: 671.2, b: 672.9, v: A + "r37_mongoose", from: 1.0, out: { type: "cut" } },
  { a: 672.9, b: 674.6, v: A + "r37_mongoose", from: 2.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 674.6, b: 676.32, v: A + "r38_badger", from: 1.0, out: { type: "cut" } },
  { a: 676.32, b: 678.04, v: A + "r38_badger", from: 2.72, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 678.04, b: 680.91, v: P + "28895658", from: 8.0, rate: 0.5, grade: "blur(5px) brightness(.45)", k: "board", out: { type: "cut" } },
  { a: 680.91, b: 683.79, v: P + "28895658", from: 9.44, rate: 0.5, grade: "blur(5px) brightness(.45)", k: "board", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 683.79, b: 686.66, v: P + "28895658", from: 10.88, rate: 0.5, grade: "blur(5px) brightness(.45)", k: "board", out: { type: "flash" } },
  { a: 686.66, b: 689.66, v: A + "r42_glide", from: 3.5, rate: 0.82, out: { type: "cut" } },
  { a: 689.66, b: 692.44, v: A + "r30_road", from: 7.0, grade: "brightness(.5)", out: { type: "white", d: 0.3 } },
  { a: 692.44, b: 694.0, v: P + "9010511", from: 6.0, out: { type: "cut" } },
  { a: 694.0, b: 695.56, v: P + "9010511", from: 7.56, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 695.56, b: 697.44, v: R + "c02", from: 10.1, rate: 0.6, out: { type: "flash" } },
];
export const SHOTS11: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF11, b: s.b - OFF11 }));
export const M11_END = 697.44;
export const M11_FRAMES = Math.round((M11_END - OFF11) * FPS);

export const M11: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF11;
  const cur = SHOTS11.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS11.map((s, i) => <ShotLayer key={i} S={SHOTS11} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={651.7} b={653.5} text="EVEN STRANGER" />
        <Place t={ta} a={654.0} b={657.0} text="FACE TO FACE" sub="squirrel vs rattlesnake" />
        <Place t={ta} a={657.5} b={662.1} text="A HOT TAIL" sub="a warning written in infrared" />
        <Place t={ta} a={662.6} b={668.8} text="KINGSNAKE" sub="eats rattlesnakes for a living · highly resistant" />
        <Place t={ta} a={669.2} b={674.4} text="ANOTHER CONTINENT · MONGOOSE" sub="nerve receptors cobra venom can't grip" />
        <Place t={ta} a={674.9} b={677.9} text="HONEY BADGER" sub="same trick" />
        {cur?.k === "board" && <CheckList t={ta} a={678.1} b={686.5} title="BUILT-IN VENOM RESISTANCE" x={560} y={190} items={[
          { at: 678.15, text: "OPOSSUM", ok: true }, { at: 678.3, text: "GROUND SQUIRREL", ok: true }, { at: 678.45, text: "KINGSNAKE", ok: true },
          { at: 678.6, text: "MONGOOSE · HONEY BADGER", ok: true }, { at: 679.2, text: "ROADRUNNER", ok: false }]} />}
        <BigWord t={ta} a={686.9} b={689.5} text="THREE THINGS" />
        <WordStack t={ta} a={689.66} b={692.35} words={[{ at: 689.7, text: "SPEED" }, { at: 690.6, text: "FEATHERS" }, { at: 691.4, text: "TIMING", hot: true }]} x={720} y={240} size={150} />
        <BigWord t={ta} a={692.7} b={695.4} text="AND A FOURTH" hot />
        <Place t={ta} a={695.7} b={697.3} text="THE SOLAR PANEL" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
