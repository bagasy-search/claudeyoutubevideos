// apex03 · MINUTO 3 (133,94–216,2 s) — segundo y tercer método (romper la cueva de nieve, el acecho acuático), todo depende
// del hielo, es mamífero marino, nada fuerte (la hembra del GPS: 9 días, 687 km) pero en el agua es viajero, no cazador. OFF3.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter, Snow } from "./comps";
import { SwimLog } from "./compsA";
import { R, P, A } from "./M1";

export const OFF3 = 133.94;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 133.94, b: 136.3, v: P + "6887987", from: 2.0, out: { type: "cut" } },
  { a: 136.3, b: 138.22, v: P + "36426745", from: 2.0, out: { type: "cut" } },
  { a: 138.22, b: 140.14, v: P + "36426745", from: 3.92, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 140.14, b: 142.07, v: A + "o06_bear_den_smash", from: 0.5, out: { type: "cut" } },
  { a: 142.07, b: 144.0, v: A + "o06_bear_den_smash", from: 2.43, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 144.0, b: 146.22, v: A + "o06_bear_den_smash", from: 5.5, rate: 0.8, out: { type: "cut" } },
  { a: 146.22, b: 148.44, v: A + "o06_bear_den_smash", from: 7.28, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 148.44, b: 150.03, v: P + "8016826", from: 2.0, out: { type: "cut" } },
  { a: 150.03, b: 151.62, v: P + "8016826", from: 3.59, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 151.62, b: 154.04, v: A + "o07_aquatic_stalk", from: 0.5, out: { type: "cut" } },
  { a: 154.04, b: 156.77, v: A + "o07_aquatic_stalk", from: 3.0, rate: 0.8, out: { type: "cut" } },
  { a: 156.77, b: 159.5, v: A + "o07_aquatic_stalk", from: 5.18, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 159.5, b: 162.14, v: A + "o39_seal_floe", from: 6.0, out: { type: "cut" } },
  { a: 162.14, b: 164.78, v: A + "o39_seal_floe", from: 8.64, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 164.78, b: 166.63, v: A + "o07_aquatic_stalk", from: 8.2, rate: 0.97, out: { type: "cut" } },
  { a: 166.63, b: 168.48, v: A + "o07_aquatic_stalk", from: 9.99, rate: 0.97, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 168.48, b: 171.24, v: P + "8318381", from: 2.0, out: { type: "cut" } },
  { a: 171.24, b: 173.86, v: A + "o05_bear_strike", from: 8.5, out: { type: "flash" } },
  { a: 173.86, b: 175.38, v: P + "8318605", from: 2.0, out: { type: "cut" } },
  { a: 175.38, b: 176.9, v: P + "8318605", from: 3.52, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 176.9, b: 179.31, v: P + "6884653", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 179.31, b: 181.72, v: P + "6884653", from: 4.41, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 181.72, b: 184.61, v: P + "6886131", from: 2.0, out: { type: "cut" } },
  { a: 184.61, b: 187.5, v: P + "6886131", from: 4.89, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 187.5, b: 189.05, v: A + "o45_bear_head_water", from: 8.85, rate: 0.97, out: { type: "cut" } },
  { a: 189.05, b: 190.6, v: A + "o45_bear_head_water", from: 10.35, rate: 0.97, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 190.6, b: 193.01, v: A + "o08_bear_dive", from: 5.4, rate: 0.74, k: "speed", out: { type: "cut" } },
  { a: 193.01, b: 195.42, v: A + "o08_bear_dive", from: 7.18, rate: 0.74, k: "speed", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 195.42, b: 197.92, v: P + "32226037", from: 2.0, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "gps", out: { type: "cut" } },
  { a: 197.92, b: 200.43, v: P + "32226037", from: 3.5, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "gps", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 200.43, b: 202.94, v: P + "32226037", from: 5.01, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "gps", out: { type: "cut" } },
  { a: 202.94, b: 205.44, v: P + "32226037", from: 6.51, rate: 0.6, grade: "blur(4px) brightness(.45)", k: "gps", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 205.44, b: 207.46, v: P + "32872801", from: 2.0, out: { type: "cut" } },
  { a: 207.46, b: 209.81, v: P + "34435179", from: 2.0, out: { type: "cut" } },
  { a: 209.81, b: 212.16, v: P + "34435179", from: 4.35, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 212.16, b: 214.18, v: A + "o08_bear_dive", from: 9.0, rate: 0.71, out: { type: "cut" } },
  { a: 214.18, b: 216.2, v: A + "o08_bear_dive", from: 10.43, rate: 0.71, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS3: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF3, b: s.b - OFF3 }));
export const M3_END = 216.2;
export const M3_FRAMES = Math.round((M3_END - OFF3) * FPS);

export const M3: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF3;
  const cur = SHOTS3.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS3.map((s, i) => <ShotLayer key={i} S={SHOTS3} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={134.2} b={136.2} text="METHOD 2 · SPRING" />
        <Place t={ta} a={136.6} b={140.0} text="SNOW CAVES ON THE ICE" sub="where seal mothers give birth" />
        <BigWord t={ta} a={144.3} b={148.3} text="ALL ITS WEIGHT BEHIND THE PAWS" hot />
        <Place t={ta} a={148.7} b={151.5} text="METHOD 3 · FROM THE WATER" />
        <BigWord t={ta} a={151.9} b={153.9} text="THE AQUATIC STALK" />
        <Place t={ta} a={154.4} b={159.3} text="MOSTLY UNDERWATER" sub="up only to breathe" />
        <Place t={ta} a={159.8} b={164.6} text="ICE CHUNKS AS COVER" />
        <BigWord t={ta} a={165.0} b={168.3} text="IT EXPLODES ONTO THE ICE" hot />
        <Place t={ta} a={168.7} b={171.1} text="HARD · OFTEN FAILS" />
        <BigWord t={ta} a={171.4} b={173.7} text="BUT IT WORKS" />
        <Place t={ta} a={174.1} b={175.8} text="NOTICE WHAT IT DEPENDS ON" />
        <BigWord t={ta} a={175.95} b={176.85} text="ICE." hot />
        <Place t={ta} a={177.2} b={181.6} text="ALMOST ALL ITS HUNTING" sub="from the frozen surface of the sea" />
        <Place t={ta} a={182.0} b={187.3} text="CLASSIFIED: MARINE MAMMAL" sub="more life on the sea than on land" />
        <Place t={ta} a={187.8} b={190.5} text="A STRONG SWIMMER" />
        {cur?.k === "speed" && <Counter t={ta} a={190.9} b={195.3} from={0} to={10} dur={1.2} digits={2} unit="KM/H" kicker="PADDLING WITH THE FRONT PAWS · AROUND" x={160} y={330} />}
        {cur?.k === "gps" && <SwimLog t={ta} a={195.5} b={205.3} days={9} km={687} dur={7.5} title="ONE FEMALE · GPS COLLAR · BEAUFORT SEA" />}
        <BigWord t={ta} a={205.6} b={207.4} text="SWIMMING IS NOT HUNTING" />
        <Place t={ta} a={207.8} b={212.0} text="A SEAL IN OPEN WATER" sub="faster and more agile than any bear" />
        <BigWord t={ta} a={212.4} b={216.0} text="A TRAVELER · NOT A PREDATOR" hot />
        {(cur?.v === P + "36426745" || cur?.v === P + "6887987") && <Snow t={ta} n={50} op={0.45} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
void R;
