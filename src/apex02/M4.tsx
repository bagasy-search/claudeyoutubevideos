// apex02 · MINUTO 4 (186,25–262,17 s) — el desierto que quiere matar a los dos: 60 °C, meses sin lluvia, noches heladas,
// el letargo nocturno (se "apaga") y el parche de piel negra que funciona como panel solar. Tiempos ABSOLUTOS; OFF4 los pasa a locales.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, TempTag, HeatUp } from "./comps";
import { HeatBar, Lock, SolarPatch, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF4 = 186.25;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 186.25, b: 187.93, v: P + "13778952", from: 2.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "cut" } },
  { a: 187.93, b: 189.6, v: P + "13778952", from: 3.68, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 189.6, b: 191.5, v: P + "14579929", from: 1.0, out: { type: "cut" } },
  { a: 191.5, b: 193.39, v: P + "14579929", from: 2.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
  { a: 193.39, b: 195.0, v: P + "2711147", from: 2.0, k: "heat", out: { type: "cut" } },
  { a: 195.0, b: 196.6, v: P + "2711147", from: 3.61, k: "heat", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 196.6, b: 198.36, v: P + "5358448", from: 2.0, k: "heat", cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.6], out: { type: "cut" } },
  { a: 198.36, b: 200.11, v: P + "5358448", from: 3.76, k: "heat", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 200.11, b: 201.86, v: P + "7895634", from: 2.0, out: { type: "cut" } },
  { a: 201.86, b: 203.61, v: P + "7895634", from: 3.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.5 } },
  { a: 203.61, b: 206.03, v: P + "30910240", from: 2.0, grade: "brightness(.6) saturate(.7) hue-rotate(-10deg)", k: "cold", out: { type: "cut" } },
  { a: 206.03, b: 208.45, v: P + "30910240", from: 4.42, grade: "brightness(.6) saturate(.7) hue-rotate(-10deg)", k: "cold", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 208.45, b: 210.57, v: R + "c01", from: 50.0, cam: [1.05, 0.5, 0.5, 1.2, 0.55, 0.5], out: { type: "cut" } },
  { a: 210.57, b: 212.69, v: R + "c01", from: 52.12, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 212.69, b: 215.2, v: P + "12639430", from: 2.0, k: "hot", out: { type: "whip", vx: 1 } },
  { a: 215.2, b: 217.95, v: P + "9442581", from: 3.0, grade: "brightness(.7)", out: { type: "dissolve", d: 0.5 } },
  { a: 217.95, b: 220.83, v: A + "r07_torpor", from: 0.5, grade: "brightness(.75)", out: { type: "flash" } },
  { a: 220.83, b: 223.42, v: A + "r07_torpor", from: 3.4, rate: 0.82, grade: "url(#thermal)", k: "torpor", out: { type: "cut" } },
  { a: 223.42, b: 226.0, v: A + "r07_torpor", from: 5.52, rate: 0.82, grade: "url(#thermal)", k: "torpor", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 226.0, b: 228.24, v: A + "r07_torpor", from: 7.7, rate: 0.9, grade: "url(#thermal) brightness(.8)", k: "torpor", cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 228.24, b: 230.47, v: A + "r07_torpor", from: 9.72, rate: 0.9, grade: "url(#thermal) brightness(.8)", k: "torpor", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.4 } },
  { a: 230.47, b: 232.03, v: P + "9010511", from: 2.0, out: { type: "cut" } },
  { a: 232.03, b: 233.6, v: P + "9010511", from: 3.56, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 233.6, b: 235.22, v: R + "c03", from: 0.0, rate: 0.6, cam: [1.15, 0.5, 0.45, 1.3, 0.5, 0.45], out: { type: "cut" } },
  { a: 235.22, b: 236.85, v: R + "c03", from: 0.97, rate: 0.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 236.85, b: 238.88, v: A + "r06_sunbathe", from: 0.5, out: { type: "cut" } },
  { a: 238.88, b: 240.9, v: A + "r06_sunbathe", from: 2.53, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 240.9, b: 243.12, v: A + "r06_sunbathe", from: 5.0, cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "cut" } },
  { a: 243.12, b: 245.33, v: A + "r06_sunbathe", from: 7.22, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 245.33, b: 247.12, v: R + "c02", from: 6.5, cam: [1.2, 0.5, 0.45, 1.35, 0.5, 0.45], out: { type: "cut" } },
  { a: 247.12, b: 248.91, v: R + "c02", from: 8.29, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 248.91, b: 251.56, v: A + "r06_sunbathe", from: 9.5, rate: 0.22, grade: "blur(5px) brightness(.5)", k: "solar", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 251.56, b: 254.2, v: A + "r06_sunbathe", from: 10.08, rate: 0.22, grade: "blur(5px) brightness(.5)", k: "solar", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 254.2, b: 256.85, v: A + "r06_sunbathe", from: 10.66, rate: 0.22, grade: "blur(5px) brightness(.5)", k: "solar", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 256.85, b: 259.49, v: A + "r06_sunbathe", from: 11.25, rate: 0.22, grade: "blur(5px) brightness(.5)", k: "solar", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 259.49, b: 262.17, v: P + "17207183", from: 2.0, out: { type: "whip", vx: 1 } },
];
export const SHOTS4: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF4, b: s.b - OFF4 }));
export const M4_END = 262.17;
export const M4_FRAMES = Math.round((M4_END - OFF4) * FPS);

export const M4: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF4;
  const cur = SHOTS4.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS4.map((s, i) => <ShotLayer key={i} S={SHOTS4} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {(cur?.k === "heat" || cur?.k === "hot") && <Dust t={ta} n={50} warm />}
        <BigWord t={ta} a={189.9} b={193.2} text="THE DESERT WANTS BOTH OF THEM DEAD" />
        {cur?.k === "heat" && <HeatBar t={ta} a={193.6} b={200.0} c={60} f={140} />}
        <Place t={ta} a={200.4} b={203.5} text="MONTHS WITHOUT RAIN" />
        {cur?.k === "cold" && <TempTag t={ta} a={204.0} b={208.3} x={1180} y={380} kicker="WINTER NIGHT" value={0} to={20} cold />}
        <Place t={ta} a={208.8} b={212.5} text="SMALL · WARM-BLOODED" sub="a brutal combination" />
        {cur?.k === "hot" && <HeatUp t={ta} a={212.8} b={215.1} label="OVERHEATS" />}
        <Place t={ta} a={215.5} b={217.8} text="BURNS FUEL TO STAY WARM" />
        <BigWord t={ta} a={218.2} b={220.7} text="ITS ANSWER IS SURPRISING" />
        {cur?.k === "torpor" && <TempTag t={ta} a={221.2} b={230.3} x={1240} y={300} kicker="BODY TEMP · NIGHT" value={35} to={39} cold />}
        <Place t={ta} a={223.5} b={230.2} text="CONTROLLED TORPOR" sub="a short, shallow hibernation" />
        <BigWord t={ta} a={231.0} b={233.5} text="TURNED DOWN" />
        <BigWord t={ta} a={233.8} b={236.7} text="TURNED BACK ON" hot />
        <Place t={ta} a={237.2} b={240.8} text="BACK TO THE SUN" sub="feathers lifted" />
        <Lock t={ta} a={245.6} b={248.8} x={620} y={300} w={680} h={420} label="BLACK SKIN" sub="hidden between the wings" red />
        {cur?.k === "solar" && <SolarPatch t={ta} a={249.1} b={259.4} x={760} y={600} heatAt={252.6} />}
        <BigWord t={ta} a={259.7} b={262.0} text="HOLD ON TO THAT DETAIL" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
