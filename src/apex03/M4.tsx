// apex03 · MINUTO 4 (216,2–299,43 s) — el buceo (récord 3 min 10 s), en el hielo casi nada lo enfrenta salvo la morsa,
// y entra el otro: la orca (delfín más grande, 8 m, 6 t, aleta de 2 m, 40–56 dientes, 50 km/h, cerebro de 5–6 kg). OFF4.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { CaseFile } from "./compsA";
import { R, P, A } from "./M1";

export const OFF4 = 216.2;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 216.2, b: 218.88, v: A + "o49_bear_from_below", from: 12.0, grade: "brightness(.6)", out: { type: "cut" } },
  { a: 218.88, b: 220.74, v: A + "o03_under_bear", from: 4.5, out: { type: "cut" } },
  { a: 220.74, b: 222.6, v: A + "o03_under_bear", from: 6.36, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 222.6, b: 224.95, v: A + "o03_under_bear", from: 8.3, rate: 0.38, grade: "brightness(.5)", k: "dive", out: { type: "cut" } },
  { a: 224.95, b: 227.31, v: A + "o03_under_bear", from: 9.19, rate: 0.38, grade: "brightness(.5)", k: "dive", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 227.31, b: 229.67, v: A + "o03_under_bear", from: 10.09, rate: 0.38, grade: "brightness(.5)", k: "dive", out: { type: "cut" } },
  { a: 229.67, b: 232.02, v: A + "o03_under_bear", from: 10.99, rate: 0.38, grade: "brightness(.5)", k: "dive", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 232.02, b: 234.02, v: P + "2498966", from: 2.0, out: { type: "cut" } },
  { a: 234.02, b: 236.98, v: P + "26647326", from: 8.0, out: { type: "whip", vx: 1 } },
  { a: 236.98, b: 239.45, v: A + "o13_walrus", from: 1.0, out: { type: "cut" } },
  { a: 239.45, b: 241.93, v: A + "o13_walrus", from: 3.47, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 241.93, b: 244.76, v: A + "o13_walrus", from: 6.0, grade: "brightness(.6)", k: "walrus", out: { type: "cut" } },
  { a: 244.76, b: 247.6, v: A + "o13_walrus", from: 8.83, grade: "brightness(.6)", k: "walrus", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 247.6, b: 250.05, v: P + "1628215", from: 3.0, cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 250.05, b: 252.5, v: P + "1628215", from: 5.45, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 252.5, b: 254.25, v: P + "1628215", from: 12.0, out: { type: "cut" } },
  { a: 254.25, b: 256.0, v: P + "1628215", from: 13.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 256.0, b: 257.75, v: P + "30119094", from: 2.0, out: { type: "cut" } },
  { a: 257.75, b: 259.5, v: P + "30119094", from: 3.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 259.5, b: 261.5, v: A + "o37_shallow", from: 1.0, out: { type: "cut" } },
  { a: 261.5, b: 263.5, v: A + "o37_shallow", from: 3.0, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 263.5, b: 266.1, v: R + "e01", from: 2.0, out: { type: "cut" } },
  { a: 266.1, b: 268.69, v: R + "e01", from: 4.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 268.69, b: 271.44, v: P + "5607993", from: 6.0, out: { type: "cut" } },
  { a: 271.44, b: 274.0, v: A + "o15_orca_under", from: 4.5, rate: 0.95, grade: "brightness(.65)", k: "file", out: { type: "cut" } },
  { a: 274.0, b: 276.56, v: A + "o15_orca_under", from: 6.93, rate: 0.95, grade: "brightness(.65)", k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 276.56, b: 279.12, v: A + "o15_orca_under", from: 9.36, rate: 0.95, grade: "brightness(.65)", k: "file", out: { type: "flash" } },
  { a: 279.12, b: 281.38, v: R + "e01", from: 11.4, rate: 0.6, out: { type: "cut" } },
  { a: 281.38, b: 283.64, v: R + "e01", from: 44.6, rate: 0.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 283.64, b: 286.05, v: A + "o16_teeth", from: 1.0, rate: 0.8, k: "teeth", out: { type: "cut" } },
  { a: 286.05, b: 288.47, v: A + "o16_teeth", from: 2.93, rate: 0.8, k: "teeth", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 288.47, b: 290.88, v: A + "o16_teeth", from: 4.86, rate: 0.8, k: "teeth", out: { type: "flash" } },
  { a: 290.88, b: 293.19, v: R + "e01", from: 22.0, rate: 0.7, k: "speed", out: { type: "cut" } },
  { a: 293.19, b: 295.5, v: R + "e01", from: 23.62, rate: 0.7, k: "speed", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 295.5, b: 297.47, v: A + "o41_orca_eye", from: 1.0, out: { type: "cut" } },
  { a: 297.47, b: 299.43, v: A + "o41_orca_eye", from: 2.97, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS4: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF4, b: s.b - OFF4 }));
export const M4_END = 299.43;
export const M4_FRAMES = Math.round((M4_END - OFF4) * FPS);

export const M4: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF4;
  const cur = SHOTS4.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS4.map((s, i) => <ShotLayer key={i} S={SHOTS4} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={216.5} b={218.8} text="IT CAN DIVE" sub="but not for long" />
        <Place t={ta} a={219.2} b={222.5} text="NOSTRILS CLOSED · EYES OPEN" />
        {cur?.k === "dive" && <Place t={ta} a={222.9} b={231.9} text="HUDSON BAY · 2015" sub="the longest polar bear dive ever recorded" />}
        {cur?.k === "dive" && <BigWord t={ta} a={226.6} b={231.9} text="3 MIN 10 S" hot y={380} />}
        <Place t={ta} a={232.3} b={233.9} text="MOST DIVES · FAR SHORTER" />
        <BigWord t={ta} a={234.3} b={236.8} text="ON THE ICE · ALMOST NOTHING STANDS UP TO IT" />
        <Place t={ta} a={237.4} b={241.8} text="ONE EXCEPTION" sub="the walrus" />
        {cur?.k === "walrus" && <CaseFile t={ta} a={242.0} b={247.5} num="03-W" name="WALRUS" latin="Odobenus rosmarus"
          rows={[{ at: 243.6, k: "ADULT WEIGHT", v: "WELL OVER 1 TON" }, { at: 245.4, k: "TUSKS", v: "UP TO 1 M", hot: true }]} />}
        <Place t={ta} a={248.0} b={252.4} text="CALVES · WEAK ANIMALS" sub="charge the herd on land" />
        <Place t={ta} a={252.7} b={255.9} text="STAMPEDE" sub="the young get left behind" />
        <Place t={ta} a={256.3} b={259.4} text="A HEALTHY BULL IN THE WATER" sub="a fight most bears avoid" />
        <BigWord t={ta} a={260.2} b={263.4} text="WHERE THE OTHER ONE LIVES" hot />
        <BigWord t={ta} a={263.8} b={268.5} text="THE ORCA" />
        <Place t={ta} a={268.9} b={271.3} text="THE LARGEST DOLPHIN" sub="not a whale the way most people imagine" />
        {cur?.k === "file" && <CaseFile t={ta} a={271.6} b={279.0} num="03-B" name="ORCA" latin="Orcinus orca · killer whale"
          rows={[{ at: 272.6, k: "ADULT MALE", v: "~8 M" }, { at: 274.6, k: "WEIGHT", v: "~6 TONS" }, { at: 276.6, k: "VS A BIG BEAR", v: "×10", hot: true }]} />}
        <Place t={ta} a={279.4} b={283.5} text="DORSAL FIN" sub="almost 2 m tall on an adult male" />
        {cur?.k === "teeth" && <Counter t={ta} a={284.0} b={290.7} from={0} to={56} dur={1.6} digits={2} unit="TEETH" kicker="40 TO 56 · INTERLOCKING CONES" x={160} y={330} />}
        {cur?.k === "speed" && <Counter t={ta} a={291.1} b={295.4} from={0} to={50} dur={1.2} digits={2} unit="KM/H+" kicker="BURSTS OF OVER" x={160} y={330} hot />}
        <Place t={ta} a={295.8} b={299.3} text="BRAIN: 5–6 KG" sub="one of the largest on the planet" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
