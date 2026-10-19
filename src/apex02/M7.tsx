// apex02 · MINUTO 7 (405,21–467,04 s) — la mordida contra un parpadeo, el veneno hemotóxico, las cifras de EE.UU.,
// la rata que corre y muere, y "el problema en números": serpiente contra pájaro, cara a cara. Tiempos ABSOLUTOS; OFF7.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { Term } from "./comps2";
import { BlinkRace, CheckList, TaleTape } from "./compsA";
import { R, P, A } from "./M1";

export const OFF7 = 405.21;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 405.21, b: 407.48, v: A + "r48_strike_side", from: 0.2, rate: 0.3, grade: "blur(6px) brightness(.4)", k: "blink", out: { type: "cut" } },
  { a: 407.48, b: 409.75, v: A + "r48_strike_side", from: 0.88, rate: 0.3, grade: "blur(6px) brightness(.4)", k: "blink", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 409.75, b: 412.55, v: A + "r17_miss", from: 5.0, rate: 0.625, out: { type: "cut" } },
  { a: 412.55, b: 415.35, v: A + "r17_miss", from: 6.75, rate: 0.625, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 415.35, b: 416.91, v: P + "7963035", from: 12.0, out: { type: "cut" } },
  { a: 416.91, b: 419.63, v: A + "r21_rattle", from: 6.0, grade: "brightness(.6)", out: { type: "cut" } },
  { a: 419.63, b: 422.24, v: R + "c10", from: 14.5, grade: "blur(5px) brightness(.45)", k: "venom", cam: [1.05, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 422.24, b: 424.85, v: R + "c10", from: 17.11, grade: "blur(5px) brightness(.45)", k: "venom", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 424.85, b: 427.08, v: P + "30680390", from: 2.0, grade: "brightness(.6)", k: "bites", out: { type: "cut" } },
  { a: 427.08, b: 429.32, v: P + "30680390", from: 4.23, grade: "brightness(.6)", k: "bites", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 429.32, b: 431.55, v: P + "30680390", from: 6.47, grade: "brightness(.6)", k: "bites", out: { type: "whip", vx: 1 } },
  { a: 431.55, b: 433.22, v: P + "17039762", from: 2.0, grade: "brightness(.7)", out: { type: "cut" } },
  { a: 433.22, b: 434.89, v: P + "17039762", from: 3.67, grade: "brightness(.7)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 434.89, b: 436.94, v: P + "1494252", from: 2.0, grade: "brightness(.7)", out: { type: "cut" } },
  { a: 436.94, b: 438.99, v: P + "1494252", from: 4.05, grade: "brightness(.7)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 438.99, b: 441.29, v: P + "854528", from: 2.0, out: { type: "cut" } },
  { a: 441.29, b: 443.83, v: A + "r20_krat", from: 6.0, out: { type: "cut" } },
  { a: 443.83, b: 445.45, v: A + "r47_scent", from: 5.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 445.45, b: 447.07, v: A + "r47_scent", from: 6.62, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 447.07, b: 449.55, v: P + "1575764", from: 2.0, grade: "brightness(.55)", out: { type: "sweep", d: 0.5 } },
  { a: 449.55, b: 451.96, v: A + "r01_coiled_dawn", from: 4.0, rate: 0.4, grade: "brightness(.45) saturate(.8)", k: "tape", out: { type: "cut" } },
  { a: 451.96, b: 454.36, v: A + "r01_coiled_dawn", from: 4.96, rate: 0.4, grade: "brightness(.45) saturate(.8)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 454.36, b: 456.77, v: A + "r01_coiled_dawn", from: 5.92, rate: 0.4, grade: "brightness(.45) saturate(.8)", k: "tape", out: { type: "whip", vx: 1 } },
  { a: 456.77, b: 459.74, v: A + "r02_walk_toward", from: 9.0, rate: 0.48, grade: "brightness(.45) saturate(.8)", k: "tape", out: { type: "cut" } },
  { a: 459.74, b: 462.7, v: A + "r02_walk_toward", from: 10.43, rate: 0.48, grade: "brightness(.45) saturate(.8)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 462.7, b: 464.87, v: A + "r44_swallow", from: 7.6, out: { type: "cut" } },
  { a: 464.87, b: 467.04, v: A + "r44_swallow", from: 9.77, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
];
export const SHOTS7: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF7, b: s.b - OFF7 }));
export const M7_END = 467.04;
export const M7_FRAMES = Math.round((M7_END - OFF7) * FPS);

export const M7: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF7;
  const cur = SHOTS7.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS7.map((s, i) => <ShotLayer key={i} S={SHOTS7} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "blink" && <BlinkRace t={ta} a={405.3} b={409.7} runA={406.2} runB={408.9} />}
        <BigWord t={ta} a={411.5} b={415.2} text="OVER BEFORE YOUR EYES CLOSE" hot />
        <Place t={ta} a={415.6} b={416.8} text="AND THEN · THE VENOM" />
        <Term t={ta} a={417.1} b={419.5} words={[{ la: "HEMO", en: "BLOOD", at: 418.3 }, { la: "TOXIC", en: "POISON", at: 418.8 }]} y={150} />
        {cur?.k === "venom" && <CheckList t={ta} a={419.7} b={424.7} title="WHAT IT DOES" x={560} y={300} items={[{ at: 419.8, text: "DESTROYS TISSUE", ok: false }, { at: 421.1, text: "BREAKS DOWN BLOOD VESSELS", ok: false }, { at: 422.7, text: "STOPS BLOOD CLOTTING", ok: false }]} />}
        {cur?.k === "bites" && <Counter t={ta} a={426.2} b={431.4} from={0} to={8000} dur={2.2} comma kicker="VENOMOUS SNAKEBITES · USA · EVERY YEAR" unit="" />}
        {cur?.k === "bites" && <Place t={ta} a={428.2} b={431.4} text="7,000 – 8,000 PEOPLE" />}
        <BigWord t={ta} a={432.9} b={434.8} text="ABOUT 5 DIE" />
        <Place t={ta} a={435.1} b={438.8} text="WEEKS OF TREATMENT" sub="permanent damage" />
        <BigWord t={ta} a={439.2} b={441.2} text="SMALL ANIMALS DON'T GET WEEKS" hot />
        <Place t={ta} a={441.5} b={443.7} text="A FEW METERS · THEN DEAD" />
        <Place t={ta} a={444.3} b={446.9} text="FOLLOWS THE SCENT" sub="at leisure" />
        <BigWord t={ta} a={447.2} b={449.4} text="THE PROBLEM IN NUMBERS" />
        {cur?.k === "tape" && <TaleTape t={ta} a={449.6} b={462.6}
          left={{ name: "THE SNAKE", rows: [{ at: 451.4, v: "OVER 1 METER" }, { at: 453.1, v: "STRIKES FASTER THAN A BLINK" }, { at: 455.1, v: "VENOM THAT DISSOLVES FLESH" }] }}
          right={{ name: "THE BIRD", rows: [{ at: 458.4, v: "UNDER 1 POUND" }, { at: 460.2, v: "NO IMMUNITY AT ALL" }] }} />}
        <BigWord t={ta} a={463.8} b={466.9} text="THE SNAKE GETS EATEN" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
void R;
