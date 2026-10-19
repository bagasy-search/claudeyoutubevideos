// apex03 · MINUTO 7 (457,25–521,02 s) — por qué casi nunca se cruzaron: el hielo del Ártico es un muro para la orca
// (tiene que respirar, la aleta alta estorba, quedar atrapada = ahogarse); narvales y belugas sin aleta; dos reinos con frontera congelada. OFF7.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, Counter } from "./comps";
import { CheckList, TaleTape } from "./compsA";
import { R, P, A } from "./M1";

export const OFF7 = 457.25;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 457.25, b: 458.93, v: P + "8016835", from: 2.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "cut" } },
  { a: 458.93, b: 460.61, v: P + "8016835", from: 3.68, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 460.61, b: 462.38, v: P + "6255492", from: 2.0, grade: "brightness(.6)", k: "area", out: { type: "cut" } },
  { a: 462.38, b: 464.14, v: P + "6255492", from: 3.77, grade: "brightness(.6)", k: "area", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 464.14, b: 466.76, v: A + "o23_ice_wall", from: 1.0, out: { type: "cut" } },
  { a: 466.76, b: 469.0, v: A + "o23_ice_wall", from: 4.0, rate: 0.7, grade: "brightness(.7)", out: { type: "cut" } },
  { a: 469.0, b: 471.25, v: A + "o23_ice_wall", from: 5.57, rate: 0.7, grade: "brightness(.7)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 471.25, b: 473.49, v: A + "o23_ice_wall", from: 7.14, rate: 0.7, grade: "brightness(.7)", out: { type: "whip", vx: 1 } },
  { a: 473.49, b: 476.3, v: R + "e01", from: 13.0, out: { type: "cut" } },
  { a: 476.3, b: 479.11, v: R + "e01", from: 15.81, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 479.11, b: 481.59, v: A + "o23_ice_wall", from: 8.75, rate: 0.6, grade: "brightness(.5)", out: { type: "cut" } },
  { a: 481.59, b: 484.07, v: A + "o23_ice_wall", from: 10.24, rate: 0.6, grade: "brightness(.5)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 484.07, b: 486.26, v: P + "8318373", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 486.26, b: 488.44, v: P + "8318373", from: 4.19, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 488.44, b: 490.63, v: P + "8318373", from: 6.37, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 490.63, b: 492.24, v: P + "8318601", from: 2.0, out: { type: "cut" } },
  { a: 492.24, b: 493.85, v: P + "8318601", from: 3.61, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 493.85, b: 495.93, v: A + "o24_narwhal_crack", from: 1.0, out: { type: "cut" } },
  { a: 495.93, b: 498.0, v: A + "o24_narwhal_crack", from: 3.08, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 498.0, b: 500.65, v: A + "o25_belugas", from: 1.0, rate: 0.8, grade: "brightness(.6)", k: "nofin", out: { type: "cut" } },
  { a: 500.65, b: 503.31, v: A + "o25_belugas", from: 3.12, rate: 0.8, grade: "brightness(.6)", k: "nofin", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 503.31, b: 505.0, v: A + "o24_narwhal_crack", from: 6.0, out: { type: "cut" } },
  { a: 505.0, b: 506.69, v: A + "o24_narwhal_crack", from: 7.69, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 506.69, b: 509.55, v: A + "o04_bear_breath_hole", from: 9.5, rate: 0.8, out: { type: "flash" } },
  { a: 509.55, b: 512.27, v: P + "6887983", from: 2.0, rate: 0.8, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "cut" } },
  { a: 512.27, b: 515.0, v: P + "6887983", from: 4.18, rate: 0.8, grade: "blur(3px) brightness(.45)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 515.0, b: 517.6, v: A + "o11_bear_stand", from: 9.8, rate: 0.6, grade: "blur(3px) brightness(.45)", k: "tape", out: { type: "flash" } },
  { a: 517.6, b: 519.31, v: P + "8318643", from: 2.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 519.31, b: 521.02, v: P + "8318643", from: 3.71, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
];
export const SHOTS7: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF7, b: s.b - OFF7 }));
export const M7_END = 521.02;
export const M7_FRAMES = Math.round((M7_END - OFF7) * FPS);

export const M7: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF7;
  const cur = SHOTS7.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS7.map((s, i) => <ShotLayer key={i} S={SHOTS7} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={457.6} b={460.5} text="THE ARCTIC OCEAN" sub="always covered by sea ice" />
        {cur?.k === "area" && <Counter t={ta} a={460.7} b={464.0} from={0} to={14} dur={1.4} digits={2} unit="MILLION KM²" kicker="WINTER SEA ICE · ROUGHLY" x={160} y={330} />}
        <BigWord t={ta} a={464.5} b={466.6} text="FOR AN ORCA · A WALL" hot />
        <Place t={ta} a={467.0} b={473.3} text="IT HAS TO SURFACE TO BREATHE" sub="and it can't break thick ice like some Arctic whales" />
        <Place t={ta} a={473.8} b={478.9} text="THE TALL DORSAL FIN" sub="perfect in open water · a problem under the ice" />
        <BigWord t={ta} a={479.6} b={483.9} text="TRAPPED = DROWNED" hot />
        <Place t={ta} a={484.4} b={490.4} text="OPEN SEA · ICE EDGES" sub="out of the frozen heart of the Arctic" />
        <BigWord t={ta} a={491.5} b={493.7} text="THE LOCALS KNOW" />
        <Place t={ta} a={494.1} b={497.9} text="NARWHALS · BELUGAS" sub="the whales of the high Arctic" />
        {cur?.k === "nofin" && <CheckList t={ta} a={498.1} b={503.2} title="CAN TRAVEL UNDER THE ICE" x={1080} y={220} items={[
          { at: 498.2, text: "NARWHAL · NO DORSAL FIN", ok: true }, { at: 498.5, text: "BELUGA · NO DORSAL FIN", ok: true }, { at: 500.4, text: "ORCA", ok: false }]} />}
        <BigWord t={ta} a={504.2} b={506.5} text="THE ICE IS A SHELTER" />
        <BigWord t={ta} a={507.0} b={509.4} text="FOR THE BEAR · HOME" hot />
        {cur?.k === "tape" && <TaleTape t={ta} a={509.6} b={517.5}
          left={{ name: "ON THE ICE", rows: [{ at: 512.9, v: "THE BEAR" }] }}
          right={{ name: "OPEN OCEAN", rows: [{ at: 515.2, v: "THE ORCA" }] }} />}
        <BigWord t={ta} a={517.8} b={520.9} text="THE BORDER · FROZEN SOLID" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
