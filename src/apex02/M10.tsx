// apex02 · MINUTO 10 (598,63–651,35 s) — la caza en pareja, "¿nunca?", nadie contó las derrotas, sin magia en la sangre,
// y los que sí la tienen: la zarigüeya (proteína antiveneno) y la ardilla terrestre de California. Tiempos ABSOLUTOS; OFF10.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { Telestrator, CaseFile } from "./compsA";
import { R, P, A } from "./M1";

export const OFF10 = 598.63;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 598.63, b: 600.62, v: A + "r22_pair", from: 1.0, out: { type: "cut" } },
  { a: 600.62, b: 602.6, v: A + "r22_pair", from: 2.99, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 602.6, b: 604.66, v: A + "r22_pair", from: 6.0, rate: 0.7, grade: "brightness(.5)", k: "pair", out: { type: "cut" } },
  { a: 604.66, b: 606.73, v: A + "r22_pair", from: 7.44, rate: 0.7, grade: "brightness(.5)", k: "pair", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 606.73, b: 609.49, v: P + "30341759", from: 8.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 609.49, b: 612.25, v: P + "30341759", from: 10.76, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
  { a: 612.25, b: 614.87, v: A + "r63_post", from: 6.0, cam: [1.1, 0.5, 0.4, 1.25, 0.5, 0.4], out: { type: "cut" } },
  { a: 614.87, b: 617.12, v: P + "9442581", from: 10.0, out: { type: "cut" } },
  { a: 617.12, b: 619.37, v: P + "9442581", from: 12.25, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 619.37, b: 622.09, v: R + "c08", from: 8.0, grade: "brightness(.75)", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 622.09, b: 624.81, v: R + "c08", from: 10.72, grade: "brightness(.75)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 624.81, b: 626.62, v: P + "2985896", from: 10.0, out: { type: "cut" } },
  { a: 626.62, b: 628.43, v: P + "2985896", from: 11.81, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 628.43, b: 630.48, v: R + "d09", from: 6.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 630.48, b: 632.52, v: R + "d09", from: 9.5, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 632.52, b: 634.57, v: R + "d09", from: 14.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "whip", vx: -1 } },
  { a: 634.57, b: 637.49, v: R + "d03", from: 2.0, k: "opo", out: { type: "cut" } },
  { a: 637.49, b: 640.41, v: R + "d03", from: 4.92, k: "opo", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 640.41, b: 643.04, v: A + "r35_opossum", from: 1.0, out: { type: "cut" } },
  { a: 643.04, b: 645.67, v: A + "r35_opossum", from: 3.63, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 645.67, b: 648.51, v: R + "d04", from: 2.0, k: "squ", out: { type: "cut" } },
  { a: 648.51, b: 651.35, v: R + "d04", from: 4.84, k: "squ", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
];
export const SHOTS10: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF10, b: s.b - OFF10 }));
export const M10_END = 651.35;
export const M10_FRAMES = Math.round((M10_END - OFF10) * FPS);

export const M10: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF10;
  const cur = SHOTS10.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS10.map((s, i) => <ShotLayer key={i} S={SHOTS10} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={599.0} b={602.5} text="TWO ROADRUNNERS" sub="one large snake" />
        {cur?.k === "pair" && <Telestrator t={ta} a={602.7} b={606.6} snake={[960, 620]} path={[[1500, 640], [1300, 630], [1140, 625]]}
          cone={{ at: 603.2, ang: 0, len: 380 }} label={{ at: 603.4, text: "ONE IN FRONT · ONE FROM THE SIDE", x: 400, y: 170 }} />}
        <Place t={ta} a={607.1} b={612.1} text="PARTNERS · OR JUST HUNGRY?" sub="either way, it works" />
        <BigWord t={ta} a={612.5} b={614.8} text="NEVER BITTEN?" hot />
        <BigWord t={ta} a={617.5} b={619.3} text="NATURE DOESN'T DO NEVER" />
        <Place t={ta} a={619.7} b={624.7} text="NO ONE HAS COUNTED" sub="some surely lose" />
        <BigWord t={ta} a={625.1} b={628.3} text="NO MAGIC IN ITS BLOOD" />
        <Place t={ta} a={629.0} b={634.4} text="SOME SNAKE FIGHTERS" sub="do have that magic" />
        {cur?.k === "opo" && <CaseFile t={ta} a={634.8} b={640.3} num="R-1" name="VIRGINIA OPOSSUM" latin="Didelphis virginiana"
          rows={[{ at: 636.6, k: "IN ITS BLOOD", v: "ANTI-VENOM PROTEIN", hot: true }, { at: 638.4, k: "RATTLESNAKE VENOM", v: "NEUTRALIZED" }]} />}
        <Place t={ta} a={640.8} b={645.5} text="A UNIVERSAL ANTIVENOM?" sub="scientists have studied it" />
        {cur?.k === "squ" && <CaseFile t={ta} a={645.9} b={651.2} num="R-2" name="CALIFORNIA GROUND SQUIRREL" latin="Otospermophilus beecheyi"
          rows={[{ at: 647.5, k: "BLOOD", v: "RESISTS VENOM", hot: true }, { at: 649.4, k: "WORKS AGAINST", v: "LOCAL RATTLESNAKES" }]} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
