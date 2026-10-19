// apex03 · MINUTO 9 (584,9–642,78 s) — los narvales con miedo (agua baja junto a la costa); el oso del otro lado del cambio:
// varado en tierra meses sin comer, la población del oeste de Hudson casi a la mitad desde los 80, y más nado justo por aguas de orcas. OFF9.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { WordStack } from "./compsA";
import { R, P, A } from "./M1";

export const OFF9 = 584.9;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 584.9, b: 587.36, v: A + "o32_narwhal_shallow", from: 1.0, out: { type: "cut" } },
  { a: 587.36, b: 589.75, v: A + "o32_narwhal_shallow", from: 4.0, rate: 0.9, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 589.75, b: 592.13, v: A + "o32_narwhal_shallow", from: 6.15, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 592.13, b: 594.52, v: A + "o32_narwhal_shallow", from: 8.29, rate: 0.9, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "flash" } },
  { a: 594.52, b: 596.72, v: A + "o29_bear_shore", from: 1.0, out: { type: "cut" } },
  { a: 596.72, b: 598.92, v: A + "o29_bear_shore", from: 3.2, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 598.92, b: 601.23, v: A + "o27_ice_breakup", from: 6.0, out: { type: "cut" } },
  { a: 601.23, b: 603.54, v: A + "o27_ice_breakup", from: 8.31, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 603.54, b: 605.77, v: A + "o55_bear_thin", from: 1.0, rate: 0.8, grade: "brightness(.6)", k: "fast", out: { type: "cut" } },
  { a: 605.77, b: 607.99, v: A + "o55_bear_thin", from: 2.78, rate: 0.8, grade: "brightness(.6)", k: "fast", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 607.99, b: 610.22, v: A + "o55_bear_thin", from: 4.56, rate: 0.8, grade: "brightness(.6)", k: "fast", out: { type: "cut" } },
  { a: 610.22, b: 612.4, v: P + "4565426", from: 2.0, rate: 0.9, out: { type: "cut" } },
  { a: 612.4, b: 614.58, v: P + "4565426", from: 3.96, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 614.58, b: 617.36, v: P + "8678956", from: 2.0, grade: "blur(3px) brightness(.45)", k: "pop", out: { type: "cut" } },
  { a: 617.36, b: 620.14, v: P + "8678956", from: 4.78, grade: "blur(3px) brightness(.45)", k: "pop", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 620.14, b: 622.34, v: A + "o29_bear_shore", from: 6.0, out: { type: "cut" } },
  { a: 622.34, b: 624.54, v: A + "o29_bear_shore", from: 8.2, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 624.54, b: 626.63, v: A + "o55_bear_thin", from: 7.0, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "fewer", out: { type: "cut" } },
  { a: 626.63, b: 628.71, v: A + "o55_bear_thin", from: 8.25, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "fewer", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 628.71, b: 630.8, v: A + "o55_bear_thin", from: 9.5, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "fewer", out: { type: "flash" } },
  { a: 630.8, b: 633.65, v: A + "o35_floe_bear", from: 1.0, out: { type: "cut" } },
  { a: 633.65, b: 636.5, v: A + "o35_floe_bear", from: 3.85, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 636.5, b: 638.05, v: A + "o34_bear_cub_swim", from: 9.0, rate: 0.95, out: { type: "cut" } },
  { a: 638.05, b: 639.6, v: A + "o34_bear_cub_swim", from: 10.47, rate: 0.95, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 639.6, b: 641.19, v: A + "o14_orca_breach", from: 6.0, out: { type: "cut" } },
  { a: 641.19, b: 642.78, v: A + "o14_orca_breach", from: 7.59, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS9: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF9, b: s.b - OFF9 }));
export const M9_END = 642.78;
export const M9_FRAMES = Math.round((M9_END - OFF9) * FPS);

export const M9: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF9;
  const cur = SHOTS9.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS9.map((s, i) => <ShotLayer key={i} S={SHOTS9} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={585.1} b={587.2} text="FEAR" hot />
        <Place t={ta} a={587.7} b={594.3} text="CROWDING INTO SHALLOW WATER" sub="as near to land as they can get" />
        <BigWord t={ta} a={594.9} b={598.8} text="THE BEARS · SAME CHANGE" sub="from the other side" />
        <Place t={ta} a={599.3} b={603.4} text="THE ICE MELTS" sub="the bears are forced ashore" />
        {cur?.k === "fast" && <Counter t={ta} a={604.0} b={610.0} from={0} to={4} dur={1.2} digits={1} unit="MONTHS" kicker="ON LAND · LIVING OFF FAT" x={160} y={330} />}
        <BigWord t={ta} a={610.5} b={614.4} text="EVERY WEEK WITHOUT ICE" sub="another week without seals" />
        {cur?.k === "pop" && <Counter t={ta} a={614.7} b={620.0} from={1200} to={620} dur={3.0} digits={4} unit="BEARS" kicker="WESTERN HUDSON BAY · 1980s → TODAY" x={160} y={330} hot comma />}
        <Place t={ta} a={620.5} b={624.4} text="LINKED TO THE SHORTER ICE SEASON" />
        {cur?.k === "fewer" && <WordStack t={ta} a={624.6} b={630.7} words={[{ at: 624.7, text: "FEWER WEEKS ON ICE" }, { at: 626.5, text: "FEWER SEALS" }, { at: 627.6, text: "THINNER BEARS" }, { at: 628.9, text: "FEWER CUBS SURVIVE", hot: true }]} x={120} y={220} size={100} />}
        <Place t={ta} a={631.2} b={636.3} text="ICE TO ICE · ICE TO SHORE" sub="more bears swim · longer · farther" />
        <BigWord t={ta} a={639.8} b={642.6} text="RIGHT THROUGH ORCA WATERS" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
