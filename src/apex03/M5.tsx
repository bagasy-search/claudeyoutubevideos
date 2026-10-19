// apex03 · MINUTO 5 (299,43–378,5 s) — ve con sonido (ecolocación), escucha a lo que chapotea, el secreto es el equipo:
// manadas, cultura, residentes (pescado, ruidosas) contra orcas de Bigg (mamíferos, en silencio). Tiempos ABSOLUTOS; OFF5.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { Sonar, WordStack, TaleTape } from "./compsA";
import { R, P, A } from "./M1";

export const OFF5 = 299.43;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 299.43, b: 302.12, v: A + "o40_orca_echo", from: 1.0, out: { type: "flash" } },
  { a: 302.12, b: 304.83, v: A + "o40_orca_echo", from: 4.0, rate: 0.6, grade: "brightness(.45)", k: "sonar", out: { type: "cut" } },
  { a: 304.83, b: 307.54, v: A + "o40_orca_echo", from: 5.63, rate: 0.6, grade: "brightness(.45)", k: "sonar", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 307.54, b: 310.25, v: A + "o40_orca_echo", from: 7.25, rate: 0.6, grade: "brightness(.45)", k: "sonar", out: { type: "cut" } },
  { a: 310.25, b: 311.67, v: R + "e01", from: 10.0, out: { type: "cut" } },
  { a: 311.67, b: 314.03, v: A + "o49_bear_from_below", from: 1.0, rate: 0.8, grade: "brightness(.6)", k: "listen", out: { type: "cut" } },
  { a: 314.03, b: 316.4, v: A + "o49_bear_from_below", from: 2.89, rate: 0.8, grade: "brightness(.6)", k: "listen", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 316.4, b: 318.76, v: A + "o49_bear_from_below", from: 4.78, rate: 0.8, grade: "brightness(.6)", k: "listen", out: { type: "flash" } },
  { a: 318.76, b: 321.11, v: A + "o14_orca_breach", from: 1.0, rate: 0.8, out: { type: "cut" } },
  { a: 321.11, b: 323.46, v: A + "o14_orca_breach", from: 2.88, rate: 0.8, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 323.46, b: 324.79, v: R + "e01", from: 25.2, rate: 0.6, out: { type: "cut" } },
  { a: 324.79, b: 327.29, v: P + "5607993", from: 10.0, out: { type: "cut" } },
  { a: 327.29, b: 329.79, v: P + "5607993", from: 12.5, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 329.79, b: 332.4, v: R + "e01", from: 26.0, rate: 0.6, grade: "brightness(.6)", k: "culture", out: { type: "cut" } },
  { a: 332.4, b: 335.0, v: R + "e01", from: 27.57, rate: 0.6, grade: "brightness(.6)", k: "culture", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 335.0, b: 337.61, v: R + "e01", from: 29.13, rate: 0.6, grade: "brightness(.6)", k: "culture", out: { type: "cut" } },
  { a: 337.61, b: 339.88, v: R + "e01", from: 21.0, rate: 0.44, out: { type: "flash" } },
  { a: 339.88, b: 342.33, v: R + "e01", from: 46.0, out: { type: "cut" } },
  { a: 342.33, b: 344.78, v: R + "e01", from: 48.45, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 344.78, b: 347.23, v: R + "e01", from: 50.9, out: { type: "whip", vx: 1 } },
  { a: 347.23, b: 349.42, v: R + "e01", from: 40.0, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 349.42, b: 351.6, v: R + "e01", from: 41.53, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 351.6, b: 353.79, v: R + "e01", from: 43.06, rate: 0.7, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 353.79, b: 356.19, v: A + "o46_fins_closer", from: 4.0, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 356.19, b: 358.6, v: A + "o46_fins_closer", from: 5.44, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 358.6, b: 361.0, v: A + "o46_fins_closer", from: 6.89, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 361.0, b: 363.85, v: P + "34435179", from: 8.0, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 363.85, b: 366.71, v: P + "34435179", from: 9.71, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 366.71, b: 369.56, v: P + "34435179", from: 11.43, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 369.56, b: 371.96, v: A + "o02_fins_behind", from: 5.0, rate: 0.8, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 371.96, b: 374.35, v: A + "o02_fins_behind", from: 6.92, rate: 0.8, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 374.35, b: 376.43, v: A + "o46_fins_closer", from: 9.0, rate: 0.7, out: { type: "cut" } },
  { a: 376.43, b: 378.5, v: A + "o46_fins_closer", from: 10.46, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS5: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF5, b: s.b - OFF5 }));
export const M5_END = 378.5;
export const M5_FRAMES = Math.round((M5_END - OFF5) * FPS);

export const M5: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF5;
  const cur = SHOTS5.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS5.map((s, i) => <ShotLayer key={i} S={SHOTS5} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={299.7} b={302.0} text="IT SEES WITH SOUND" />
        {cur?.k === "sonar" && <Sonar t={ta} a={302.2} b={310.1} x={520} y={600} title="CLICKS OUT · ECHOES BACK"
          targets={[{ x: 1250, y: 420, at: 304.0, label: "SEAL" }, { x: 1460, y: 760, at: 305.6, label: "ROCK" }, { x: 980, y: 860, at: 307.2, label: "FISH" }]} />}
        <BigWord t={ta} a={310.4} b={311.6} text="IT LISTENS" />
        {cur?.k === "listen" && <Sonar t={ta} a={311.8} b={318.6} x={960} y={160} listen title="SPLASHING CARRIES FAR UNDERWATER" targets={[]} />}
        <BigWord t={ta} a={319.0} b={323.3} text="NOT SIZE · NOT TEETH" />
        <BigWord t={ta} a={323.5} b={324.75} text="TEAMWORK" hot />
        <Place t={ta} a={325.1} b={329.6} text="PODS" sub="family groups · often led by an old female" />
        {cur?.k === "culture" && <WordStack t={ta} a={330.0} b={337.5} words={[{ at: 330.9, text: "OWN CALLS" }, { at: 331.9, text: "OWN PREY" }, { at: 333.1, text: "OWN TECHNIQUES" }, { at: 335.5, text: "TAUGHT TO THE YOUNG", hot: true }]} x={120} y={220} size={110} />}
        <BigWord t={ta} a={337.8} b={339.8} text="CULTURE" hot />
        <Place t={ta} a={340.2} b={347.1} text="NORTHEASTERN PACIFIC" sub="different types side by side · they almost never mix" />
        {cur?.k === "tape" && <TaleTape t={ta} a={347.3} b={374.25}
          left={{ name: "RESIDENTS", rows: [{ at: 347.6, v: "FISH · MOSTLY SALMON" }, { at: 350.6, v: "NOISY · ALWAYS CALLING" }] }}
          right={{ name: "BIGG'S", rows: [{ at: 354.2, v: "a.k.a. TRANSIENTS" }, { at: 358.0, v: "WARM-BLOODED PREY" }, { at: 366.4, v: "HUNT IN SILENCE" }, { at: 370.6, v: "CALL ONLY AFTER THE KILL" }] }} />}
        <BigWord t={ta} a={374.6} b={378.3} text="MAMMAL HUNTERS" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
