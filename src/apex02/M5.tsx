// apex02 · MINUTO 5 (262,17–335,19 s) — el agua (nunca bebe), la sal y la glándula delante del ojo ("llora sal"),
// la máquina de vivir y el menú: todo lo que se mueve, a cortes rápidos con la lista que crece. Tiempos ABSOLUTOS; OFF5 los pasa a locales.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, NoList } from "./comps";
import { SaltDrip, WordStack, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF5 = 262.17;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 262.17, b: 263.79, v: R + "c07", from: 6.0, out: { type: "whip", vx: 1 } },
  { a: 263.79, b: 266.11, v: P + "20487752", from: 2.0, k: "nodrink", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.55], out: { type: "cut" } },
  { a: 266.11, b: 268.43, v: P + "20487752", from: 4.32, k: "nodrink", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 268.43, b: 270.52, v: A + "r13_lizard", from: 1.0, out: { type: "cut" } },
  { a: 270.52, b: 272.61, v: A + "r13_lizard", from: 3.09, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 272.61, b: 274.67, v: R + "c01", from: 7.8, out: { type: "cut" } },
  { a: 274.67, b: 276.73, v: R + "c01", from: 9.86, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 276.73, b: 279.23, v: A + "r14_scorpion", from: 1.0, out: { type: "cut" } },
  { a: 279.23, b: 281.58, v: P + "7348458", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.45, 0.5], out: { type: "cut" } },
  { a: 281.58, b: 283.93, v: P + "7348458", from: 4.35, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 283.93, b: 285.68, v: A + "r10_eye", from: 5.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.45], out: { type: "cut" } },
  { a: 285.68, b: 287.43, v: A + "r10_eye", from: 6.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 287.43, b: 289.45, v: A + "r10_eye", from: 8.5, rate: 0.5, grade: "blur(4px) brightness(.45)", k: "salt", out: { type: "cut" } },
  { a: 289.45, b: 291.47, v: A + "r10_eye", from: 9.51, rate: 0.5, grade: "blur(4px) brightness(.45)", k: "salt", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 291.47, b: 293.49, v: A + "r10_eye", from: 10.52, rate: 0.5, grade: "blur(4px) brightness(.45)", k: "salt", out: { type: "flash" } },
  { a: 293.49, b: 295.62, v: A + "r64_perch", from: 0.5, rate: 0.75, out: { type: "cut" } },
  { a: 295.62, b: 297.75, v: A + "r64_perch", from: 2.1, rate: 0.75, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.35 } },
  { a: 297.75, b: 299.93, v: P + "28895658", from: 2.0, out: { type: "cut" } },
  { a: 299.93, b: 302.1, v: P + "28895658", from: 4.18, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 302.1, b: 304.61, v: P + "4361881", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 304.61, b: 307.11, v: P + "4361881", from: 4.51, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  // el menú: un plano por presa, cortes secos
  { a: 307.11, b: 308.03, v: P + "855484", from: 2.0, k: "menu", out: { type: "cut" } },
  { a: 308.03, b: 308.99, v: P + "20523581", from: 2.0, k: "menu", out: { type: "cut" } },
  { a: 308.99, b: 310.17, v: P + "1397052", from: 2.0, k: "menu", out: { type: "cut" } },
  { a: 310.17, b: 312.51, v: A + "r14_scorpion", from: 6.0, k: "menu", out: { type: "flash" } },
  { a: 312.51, b: 313.73, v: P + "5000135", from: 2.0, k: "menu", out: { type: "cut" } },
  { a: 313.73, b: 315.23, v: A + "r51_widow", from: 1.0, k: "menu", out: { type: "cut" } },
  { a: 315.23, b: 316.35, v: A + "r52_centipede", from: 1.0, k: "menu", out: { type: "cut" } },
  { a: 316.35, b: 318.95, v: A + "r13_lizard", from: 6.0, k: "menu", out: { type: "whip", vx: 1 } },
  { a: 318.95, b: 320.21, v: P + "2430298", from: 2.0, k: "menu", out: { type: "cut" } },
  { a: 320.21, b: 322.75, v: P + "4357029", from: 2.0, k: "menu", out: { type: "flash" } },
  { a: 322.75, b: 325.07, v: A + "r11_dragonfly", from: 1.0, out: { type: "cut" } },
  { a: 325.07, b: 326.27, v: P + "4709489", from: 2.0, out: { type: "cut" } },
  { a: 326.27, b: 328.89, v: P + "7961821", from: 2.0, out: { type: "whip", vx: -1 } },
  { a: 328.89, b: 331.11, v: P + "30848098", from: 2.0, out: { type: "cut" } },
  { a: 331.11, b: 333.15, v: A + "r12_feeder", from: 1.0, out: { type: "cut" } },
  { a: 333.15, b: 334.3, v: P + "4414504", from: 2.0, out: { type: "cut" } },
  { a: 334.3, b: 335.19, v: A + "r12_feeder", from: 7.0, out: { type: "flash" } },
];
export const SHOTS5: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF5, b: s.b - OFF5 }));
export const M5_END = 335.19;
export const M5_FRAMES = Math.round((M5_END - OFF5) * FPS);
const MENU = [
  { at: 307.15, text: "GRASSHOPPERS" }, { at: 308.05, text: "BEETLES" }, { at: 309.0, text: "CATERPILLARS" }, { at: 310.2, text: "SCORPIONS", hot: true },
  { at: 312.55, text: "TARANTULAS" }, { at: 313.75, text: "BLACK WIDOWS", hot: true }, { at: 315.25, text: "CENTIPEDES" }, { at: 316.4, text: "LIZARDS" },
  { at: 318.97, text: "MICE · RATS" }, { at: 320.6, text: "EGGS · CHICKS" },
];

export const M5: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF5;
  const cur = SHOTS5.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS5.map((s, i) => <ShotLayer key={i} S={SHOTS5} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={262.6} b={263.7} text="WATER" />
        {cur?.k === "nodrink" && <NoList t={ta} b={268.3} items={[{ at: 266.9, text: "NO PONDS" }, { at: 267.6, text: "NO STREAMS" }]} />}
        <Place t={ta} a={265.0} b={268.3} text="NEVER HAS TO DRINK" />
        <Place t={ta} a={269.2} b={272.5} text="WATER FROM ITS PREY" />
        <Place t={ta} a={273.0} b={276.6} text="RECYCLES ITS OWN WATER" sub="pulled back out of its waste" />
        <BigWord t={ta} a={277.9} b={279.1} text="SALT" hot />
        <Place t={ta} a={279.5} b={283.8} text="TOO MUCH SALT" sub="and no fresh water to wash it out" />
        {cur?.k === "salt" && <SaltDrip t={ta} a={287.5} b={293.4} x={760} y={440} dripAt={290.2} />}
        <BigWord t={ta} a={294.0} b={297.6} text="IT CRIES SALT" hot />
        <BigWord t={ta} a={298.2} b={302.0} text="A MACHINE FOR LIVING" />
        <BigWord t={ta} a={304.3} b={306.9} text="IT EATS ALMOST ANYTHING THAT MOVES" />
        {cur?.k === "menu" && <Dust t={ta} n={30} />}
        {cur?.k === "menu" && <WordStack t={ta} a={307.11} b={322.7} words={MENU} x={110} y={150} size={70} />}
        <Place t={ta} a={323.3} b={325.0} text="SNATCHED FROM THE AIR" />
        <BigWord t={ta} a={326.5} b={328.8} text="EVEN HUMMINGBIRDS" hot />
        <Place t={ta} a={329.2} b={331.0} text="DESERT TOWNS" sub="backyard feeders" />
        <BigWord t={ta} a={333.9} b={335.1} text="AND WAITS" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
