// apex03 · MINUTO 13 (789,34–850,73 s) — lo más raro: ningún caso confirmado de una orca matando a un oso polar. Ninguno. Todavía.
// Cada manada con su dieta; puede que lo ignore o que esté a una generación de aprenderlo. No es pelea: es competencia por las mismas presas. OFF13.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { IceEtch } from "./comps3";
import { CheckList, WordStack } from "./compsA";
import { R, P, A } from "./M1";

export const OFF13 = 789.34;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 789.34, b: 791.08, v: A + "o44_storm", from: 6.0, out: { type: "cut" } },
  { a: 791.08, b: 792.81, v: A + "o44_storm", from: 7.74, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 792.81, b: 795.56, v: P + "34942016", from: 2.0, grade: "blur(3px) brightness(.4)", k: "zero", out: { type: "cut" } },
  { a: 795.56, b: 798.32, v: P + "34942016", from: 4.75, grade: "blur(3px) brightness(.4)", k: "zero", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 798.32, b: 801.07, v: P + "34942016", from: 7.51, grade: "blur(3px) brightness(.4)", k: "zero", out: { type: "white", d: 0.3 } },
  { a: 801.07, b: 803.12, v: A + "o58_shared_water", from: 1.0, out: { type: "cut" } },
  { a: 803.12, b: 805.17, v: A + "o58_shared_water", from: 3.05, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 805.17, b: 806.86, v: P + "3858854", from: 1.0, rate: 0.7, out: { type: "cut" } },
  { a: 806.86, b: 808.55, v: P + "3858854", from: 2.18, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 808.55, b: 810.28, v: R + "e01", from: 54.0, grade: "brightness(.55)", k: "diet", out: { type: "cut" } },
  { a: 810.28, b: 812.01, v: R + "e01", from: 55.73, grade: "brightness(.55)", k: "diet", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 812.01, b: 814.65, v: P + "5607741", from: 2.0, out: { type: "cut" } },
  { a: 814.65, b: 817.29, v: P + "5607741", from: 4.64, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 817.29, b: 819.89, v: A + "o58_shared_water", from: 6.0, out: { type: "cut" } },
  { a: 819.89, b: 822.49, v: A + "o58_shared_water", from: 8.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 822.49, b: 825.37, v: P + "8318699", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 825.37, b: 828.25, v: P + "8318699", from: 4.88, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 828.25, b: 830.59, v: R + "e05", from: 2.0, rate: 0.9, grade: "blur(4px) brightness(.45)", k: "menu", out: { type: "cut" } },
  { a: 830.59, b: 832.93, v: R + "e05", from: 4.11, rate: 0.9, grade: "blur(4px) brightness(.45)", k: "menu", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 832.93, b: 835.27, v: R + "e05", from: 6.21, rate: 0.9, grade: "blur(4px) brightness(.45)", k: "menu", out: { type: "flash" } },
  { a: 835.27, b: 838.03, v: A + "o38_beluga_ambush", from: 1.0, rate: 0.9, out: { type: "cut" } },
  { a: 838.03, b: 840.79, v: A + "o38_beluga_ambush", from: 3.48, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 840.79, b: 843.55, v: A + "o38_beluga_ambush", from: 5.97, rate: 0.9, out: { type: "cut" } },
  { a: 843.55, b: 845.94, v: A + "o25_belugas", from: 7.0, rate: 0.6, out: { type: "cut" } },
  { a: 845.94, b: 848.34, v: A + "o25_belugas", from: 8.43, rate: 0.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 848.34, b: 850.73, v: A + "o25_belugas", from: 9.87, rate: 0.6, out: { type: "flash" } },
];
export const SHOTS13: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF13, b: s.b - OFF13 }));
export const M13_END = 850.73;
export const M13_FRAMES = Math.round((M13_END - OFF13) * FPS);

export const M13: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF13;
  const cur = SHOTS13.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS13.map((s, i) => <ShotLayer key={i} S={SHOTS13} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={789.5} b={792.7} text="THE STRANGEST PART" />
        {cur?.k === "zero" && <IceEtch t={ta} a={792.9} b={800.9} x={960} y={400} text="0" kicker="CONFIRMED CASES · ORCA KILLS POLAR BEAR" />}
        {cur?.k === "zero" && <BigWord t={ta} a={799.1} b={800.9} text="NONE · NOT YET" hot y={820} />}
        <Place t={ta} a={801.4} b={805.0} text="THE SAME WATER" sub="for longer every year" />
        <BigWord t={ta} a={805.3} b={808.4} text="DO ORCAS EVEN SEE BEARS AS PREY?" />
        {cur?.k === "diet" && <WordStack t={ta} a={808.6} b={811.9} words={[{ at: 808.7, text: "EACH POD" }, { at: 809.6, text: "ITS OWN DIET" }, { at: 810.6, text: "ITS OWN TRADITIONS", hot: true }]} x={120} y={260} size={110} />}
        <Place t={ta} a={812.3} b={817.1} text="A SEAL OR NARWHAL SPECIALIST" sub="might simply ignore a swimming bear" />
        <BigWord t={ta} a={817.5} b={822.3} text="OR ONE GENERATION AWAY" sub="from learning a bear in open water is easy food" hot />
        <BigWord t={ta} a={822.7} b={828.1} text="NOT A FIGHT · A COMPETITION" />
        {cur?.k === "menu" && <CheckList t={ta} a={828.3} b={835.1} title="SAME MENU" x={620} y={200} items={[
          { at: 829.6, text: "RINGED SEALS", ok: true }, { at: 830.4, text: "BEARDED SEALS", ok: true }, { at: 831.4, text: "BELUGAS", ok: true }, { at: 832.6, text: "EVEN NARWHALS", ok: true }]} />}
        <Place t={ta} a={835.6} b={843.3} text="BEARS AMBUSH BELUGAS" sub="trapped in shrinking holes in the ice" />
        <Place t={ta} a={843.8} b={847.6} text="THE ORCA HUNTS THEM IN OPEN WATER" />
        <BigWord t={ta} a={847.8} b={850.5} text="MORE OPEN WATER · LESS ICE" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
