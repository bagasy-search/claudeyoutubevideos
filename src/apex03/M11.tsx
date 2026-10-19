// apex03 · MINUTO 11 (674,96–750,52 s) — escenario 1: oso en el hielo, orca en el agua (el oso tiene casi todas las cartas;
// el comodín es la ola antártica); escenario 2: oso en el agua: deja de ser pelea (velocidad, aire, armas sin apoyo). OFF11.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { TaleTape } from "./compsA";
import { R, P, A } from "./M1";

export const OFF11 = 674.96;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 674.96, b: 677.51, v: P + "26647326", from: 15.0, rate: 0.8, out: { type: "cut" } },
  { a: 677.51, b: 680.06, v: P + "26647326", from: 17.04, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 680.06, b: 682.59, v: R + "e05", from: 37.0, rate: 1.0, out: { type: "cut" } },
  { a: 682.59, b: 685.12, v: R + "e05", from: 39.53, rate: 1.0, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 685.12, b: 687.79, v: A + "o42_bear_tracks_ice", from: 6.0, rate: 0.8, out: { type: "cut" } },
  { a: 687.79, b: 690.46, v: A + "o42_bear_tracks_ice", from: 8.14, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 690.46, b: 692.36, v: A + "o18_wavewash", from: 6.0, out: { type: "cut" } },
  { a: 692.36, b: 694.26, v: A + "o18_wavewash", from: 7.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 694.26, b: 697.23, v: R + "e03", from: 19.6, rate: 0.45, out: { type: "cut" } },
  { a: 697.23, b: 700.21, v: R + "e03", from: 20.94, rate: 0.45, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 700.21, b: 703.18, v: R + "e03", from: 22.28, rate: 0.45, out: { type: "dissolve", d: 0.4 } },
  { a: 703.18, b: 705.43, v: A + "o56_bear_small_floe", from: 1.0, rate: 0.8, out: { type: "cut" } },
  { a: 705.43, b: 707.69, v: A + "o56_bear_small_floe", from: 2.8, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 707.69, b: 709.95, v: A + "o56_bear_small_floe", from: 4.61, rate: 0.8, out: { type: "cut" } },
  { a: 709.95, b: 712.2, v: A + "o56_bear_small_floe", from: 6.42, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 712.2, b: 714.9, v: A + "o57_orca_below_bear", from: 1.0, rate: 0.9, out: { type: "cut" } },
  { a: 714.9, b: 717.61, v: A + "o57_orca_below_bear", from: 3.43, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 717.61, b: 720.38, v: A + "o57_orca_below_bear", from: 7.0, out: { type: "white", d: 0.3 } },
  { a: 720.38, b: 722.67, v: P + "5607993", from: 15.0, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 722.67, b: 724.97, v: P + "5607993", from: 16.6, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 724.97, b: 727.26, v: P + "5607993", from: 18.21, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 727.26, b: 729.59, v: A + "o40_orca_echo", from: 9.0, rate: 0.3, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 729.59, b: 731.92, v: A + "o40_orca_echo", from: 9.7, rate: 0.3, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 731.92, b: 734.25, v: A + "o40_orca_echo", from: 10.4, rate: 0.3, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 734.25, b: 736.58, v: A + "o40_orca_echo", from: 11.1, rate: 0.3, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 736.58, b: 738.97, v: A + "o09_bear_paw", from: 5.0, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 738.97, b: 741.37, v: A + "o09_bear_paw", from: 6.43, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 741.37, b: 743.76, v: A + "o09_bear_paw", from: 7.87, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "flash" } },
  { a: 743.76, b: 746.01, v: A + "o36_ram", from: 1.0, rate: 0.9, out: { type: "cut" } },
  { a: 746.01, b: 748.27, v: A + "o36_ram", from: 3.02, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 748.27, b: 750.52, v: A + "o36_ram", from: 5.06, rate: 0.9, out: { type: "flash" } },
];
export const SHOTS11: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF11, b: s.b - OFF11 }));
export const M11_END = 750.52;
export const M11_FRAMES = Math.round((M11_END - OFF11) * FPS);

export const M11: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF11;
  const cur = SHOTS11.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS11.map((s, i) => <ShotLayer key={i} S={SHOTS11} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={675.1} b={679.9} text="SCENARIO 1" sub="the bear on the ice · the orca in the water" />
        <Place t={ta} a={680.3} b={684.9} text="THE BEAR HOLDS ALMOST EVERY CARD" sub="the orca cannot climb onto the ice" />
        <Place t={ta} a={685.4} b={690.3} text="IT JUST WALKS AWAY FROM THE EDGE" />
        <BigWord t={ta} a={690.6} b={692.3} text="ONE WILD CARD" hot />
        <Place t={ta} a={692.5} b={694.1} text="THE ANTARCTIC WAVE TRICK" />
        <Place t={ta} a={694.6} b={703.0} text="WORKS ON ANYTHING" sub="resting on a small piece of floating ice" />
        <Place t={ta} a={703.5} b={708.4} text="NEVER SEEN TRIED ON A BEAR" sub="a bear weighs far more than a seal" />
        <BigWord t={ta} a={708.6} b={712.0} text="NOT A SAFE PLACE TO STAND" hot />
        <BigWord t={ta} a={712.4} b={717.4} text="SCENARIO 2" sub="the bear in the water · the orca finds it" />
        <BigWord t={ta} a={717.8} b={720.2} text="IT STOPS BEING A FIGHT" hot />
        {cur?.k === "tape" && <TaleTape t={ta} a={720.4} b={743.6}
          left={{ name: "POLAR BEAR", rows: [{ at: 720.6, v: "SWIMS ~10 KM/H" }, { at: 727.4, v: "A FEW MINUTES OF AIR" }, { at: 736.8, v: "CLAWS · JAWS · NEED SOLID GROUND" }] }}
          right={{ name: "ORCA", rows: [{ at: 724.2, v: "MORE THAN 5× FASTER" }, { at: 730.4, v: "DIVES FOR MANY MINUTES" }, { at: 733.0, v: "ATTACKS FROM BELOW" }] }} />}
        <Place t={ta} a={744.0} b={747.0} text="NOTHING TO PUSH AGAINST" />
        <BigWord t={ta} a={747.3} b={750.3} text="ORCAS KNOW HOW TO KILL BIG ANIMALS" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
