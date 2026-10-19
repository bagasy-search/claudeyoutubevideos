// apex03 · MINUTO 14 (850,73–906,66 s) — la plataforma helada: el oso la necesita, la orca necesita que desaparezca; el oso no
// necesita perder una pelea, sólo el hielo; vulnerable, en baja; la orca va para el otro lado; dos reinos, una línea de hielo que sube. OFF14.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { TaleTape, WordStack, PolarIce } from "./compsA";
import { R, P, A } from "./M1";

export const OFF14 = 850.73;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 850.73, b: 852.53, v: R + "e05", from: 16.0, out: { type: "cut" } },
  { a: 852.53, b: 854.33, v: R + "e05", from: 17.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 854.33, b: 855.85, v: A + "o47_ice_melt_drip", from: 5.0, out: { type: "cut" } },
  { a: 855.85, b: 857.37, v: A + "o47_ice_melt_drip", from: 6.52, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 857.37, b: 860.2, v: P + "29189058", from: 2.0, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 860.2, b: 863.04, v: P + "29189058", from: 4.83, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 863.04, b: 865.45, v: P + "28988888", from: 3.0, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 865.45, b: 867.86, v: P + "28988888", from: 5.41, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 867.86, b: 870.01, v: P + "6299771", from: 9.0, rate: 0.9, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 870.01, b: 872.15, v: P + "6299771", from: 10.93, rate: 0.9, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 872.15, b: 874.3, v: P + "6299771", from: 12.86, rate: 0.9, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "flash" } },
  { a: 874.3, b: 875.84, v: A + "o48_tundra_shore", from: 1.0, out: { type: "cut" } },
  { a: 875.84, b: 877.38, v: A + "o48_tundra_shore", from: 2.54, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 877.38, b: 880.22, v: P + "6878141", from: 2.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "cut" } },
  { a: 880.22, b: 883.06, v: P + "6878141", from: 4.84, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 883.06, b: 885.5, v: R + "e01", from: 7.3, out: { type: "cut" } },
  { a: 885.5, b: 887.94, v: R + "e01", from: 31.0, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 887.94, b: 890.38, v: R + "e01", from: 57.5, out: { type: "whip", vx: 1 } },
  { a: 890.38, b: 893.13, v: P + "7242211", from: 2.0, rate: 0.9, grade: "brightness(.55)", k: "kings", out: { type: "cut" } },
  { a: 893.13, b: 895.88, v: P + "7242211", from: 4.47, rate: 0.9, grade: "brightness(.55)", k: "kings", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 895.88, b: 898.63, v: P + "7242211", from: 6.95, rate: 0.9, grade: "brightness(.55)", k: "kings", out: { type: "cut" } },
  { a: 898.63, b: 901.38, v: P + "7242211", from: 9.43, rate: 0.9, grade: "brightness(.55)", k: "kings", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 901.38, b: 904.02, comp: "ice", out: { type: "cut" } },
  { a: 904.02, b: 906.66, comp: "ice", out: { type: "flash" } },
];
export const SHOTS14: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF14, b: s.b - OFF14 }));
export const M14_END = 906.66;
export const M14_FRAMES = Math.round((M14_END - OFF14) * FPS);

export const M14: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF14;
  const renderComp = (s: Shot) => {
    if (s.comp === "ice") return <PolarIce t={ta} a={901.38} b={906.66} y0={2015} y1={2024} from={0.23} to={0.2} dur={3.8} zoom={[1.2, 1.5, 0.5, 0.6]} />;
    return null;
  };
  const cur = SHOTS14.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS14.map((s, i) => <ShotLayer key={i} S={SHOTS14} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={851.0} b={854.2} text="THE BEAR'S WHOLE LIFE" sub="depends on a frozen platform" />
        <BigWord t={ta} a={854.5} b={857.2} text="THE ORCA'S · ON IT DISAPPEARING" hot />
        {cur?.k === "tape" && <TaleTape t={ta} a={857.4} b={874.2}
          left={{ name: "THE BEAR", rows: [{ at: 859.9, v: "DOESN'T NEED TO LOSE A FIGHT" }, { at: 863.1, v: "ONLY NEEDS TO LOSE THE ICE" }] }}
          right={{ name: "THE ORCA", rows: [{ at: 865.1, v: "DOESN'T NEED TO HUNT THE BEAR" }, { at: 868.0, v: "ONLY NEEDS ITS PREY FIRST" }] }} />}
        <Place t={ta} a={874.5} b={877.2} text="VULNERABLE" sub="the polar bear's official status" />
        <Place t={ta} a={877.6} b={882.9} text="NUMBERS EXPECTED TO KEEP FALLING" sub="as the ice keeps shrinking" />
        <BigWord t={ta} a={883.3} b={885.2} text="ORCAS · THE OTHER DIRECTION" hot />
        <Place t={ta} a={885.5} b={890.2} text="FURTHER NORTH" sub="more time to hunt every year" />
        {cur?.k === "kings" && <BigWord t={ta} a={890.6} b={895.0} text="TWO KINGDOMS · ONE LINE OF ICE" />}
        {cur?.k === "kings" && <WordStack t={ta} a={895.3} b={901.2} words={[{ at: 895.4, text: "STRONGEST ON LAND" }, { at: 898.0, text: "STRONGEST IN THE SEA", hot: true }]} x={120} y={300} size={120} />}
        {cur?.comp === "ice" && <Place t={ta} a={902.6} b={906.5} text="EVERY SUMMER · A LITTLE FURTHER NORTH" />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
