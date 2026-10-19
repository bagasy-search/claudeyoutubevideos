// apex02 · MINUTO 8 (467,04–527,26 s) — la pelea en cámara lenta: elige serpientes chicas, rodea a saltos,
// el golpe es rápido pero apuntado, la capa de torero (alas y cola abiertas) y el golpe que muerde plumas. Tiempos ABSOLUTOS; OFF8.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { SpanMark } from "./comps4";
import { Telestrator, Dust } from "./compsA";
import { R, P, A } from "./M1";

export const OFF8 = 467.04;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 467.04, b: 469.12, v: R + "c01", from: 41.1, rate: 0.5, out: { type: "white", d: 0.3 } },
  { a: 469.12, b: 471.02, v: R + "c13", from: 6.8, grade: "brightness(.8)", out: { type: "cut" } },
  { a: 471.02, b: 472.92, v: R + "c13", from: 8.7, grade: "brightness(.8)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 472.92, b: 474.97, v: R + "c11", from: 2.0, k: "small", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.55], out: { type: "cut" } },
  { a: 474.97, b: 477.01, v: R + "c11", from: 4.05, k: "small", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 477.01, b: 479.06, v: R + "c11", from: 6.09, k: "small", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.55], out: { type: "whip", vx: 1 } },
  { a: 479.06, b: 482.02, v: R + "c04", from: 0.3, out: { type: "cut" } },
  { a: 482.02, b: 484.18, v: R + "c04", from: 4.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "flash" } },
  { a: 484.18, b: 487.18, v: A + "r15_circle", from: 3.5, out: { type: "cut" } },
  { a: 487.18, b: 489.8, v: A + "r15_circle", from: 6.55, rate: 0.68, grade: "blur(5px) brightness(.45)", k: "zig", out: { type: "cut" } },
  { a: 489.8, b: 492.42, v: A + "r15_circle", from: 8.33, rate: 0.68, grade: "blur(5px) brightness(.45)", k: "zig", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 492.42, b: 495.04, v: A + "r15_circle", from: 10.11, rate: 0.68, grade: "blur(5px) brightness(.45)", k: "zig", out: { type: "flash" } },
  { a: 495.04, b: 497.5, v: A + "r01_coiled_dawn", from: 9.2, out: { type: "cut" } },
  { a: 497.5, b: 499.98, v: P + "4000749", from: 13.0, out: { type: "cut" } },
  { a: 499.98, b: 502.44, v: A + "r17_miss", from: 0.0, rate: 0.4, grade: "blur(5px) brightness(.45)", k: "aim", out: { type: "cut" } },
  { a: 502.44, b: 504.9, v: A + "r17_miss", from: 0.98, rate: 0.4, grade: "blur(5px) brightness(.45)", k: "aim", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 504.9, b: 507.28, v: A + "r16_cape", from: 0.0, out: { type: "cut" } },
  { a: 507.28, b: 508.88, v: A + "r16_cape", from: 4.1, out: { type: "cut" } },
  { a: 508.88, b: 510.48, v: A + "r16_cape", from: 5.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 510.48, b: 512.03, v: A + "r16_cape", from: 7.5, rate: 0.7, out: { type: "cut" } },
  { a: 512.03, b: 513.58, v: A + "r16_cape", from: 8.58, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 513.58, b: 515.91, v: A + "r23_court", from: 1.0, rate: 0.6, grade: "blur(5px) brightness(.45)", k: "cape", out: { type: "cut" } },
  { a: 515.91, b: 518.25, v: A + "r23_court", from: 2.4, rate: 0.6, grade: "blur(5px) brightness(.45)", k: "cape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 518.25, b: 520.58, v: A + "r23_court", from: 3.8, rate: 0.6, grade: "blur(5px) brightness(.45)", k: "cape", out: { type: "cut" } },
  { a: 520.58, b: 523.44, v: A + "r17_miss", from: 9.0, rate: 0.6, out: { type: "white", d: 0.25 } },
  { a: 523.44, b: 524.48, v: A + "r42_glide", from: 9.5, out: { type: "cut" } },
  { a: 524.48, b: 527.26, v: A + "r02_walk_toward", from: 3.0, grade: "brightness(.6) contrast(1.15)", out: { type: "flash" } },
];
export const SHOTS8: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF8, b: s.b - OFF8 }));
export const M8_END = 527.26;
export const M8_FRAMES = Math.round((M8_END - OFF8) * FPS);
const ZIG: [number, number][] = [[300, 820], [420, 640], [540, 760], [640, 520], [780, 640], [900, 360], [1060, 470], [1200, 330], [1330, 520], [1500, 420], [1610, 640], [1480, 800]];

export const M8: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF8;
  const cur = SHOTS8.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS8.map((s, i) => <ShotLayer key={i} S={SHOTS8} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={467.2} b={469.0} text="SLOW IT DOWN" />
        <Place t={ta} a={469.4} b={472.8} text="NOT THE BIG ONES" sub="never the biggest, oldest snakes" />
        {cur?.k === "small" && <SpanMark t={ta} a={473.6} b={478.9} x1={560} y={880} x2={1360} label="ARM-LENGTH OR LESS" sub="young, small snakes" />}
        <Place t={ta} a={479.3} b={481.9} text="NOT COWARDICE" />
        <BigWord t={ta} a={482.2} b={484.1} text="JUDGMENT" hot />
        <Place t={ta} a={484.5} b={487.0} text="IT CIRCLES" />
        {cur?.k === "zig" && <Telestrator t={ta} a={487.3} b={494.9} snake={[960, 600]} path={ZIG} label={{ at: 489.5, text: "NEVER STILL · NEVER A CLEAN TARGET", x: 420, y: 170 }} />}
        <BigWord t={ta} a={495.3} b={497.4} text="THE SNAKE HAS A PROBLEM" />
        <Place t={ta} a={497.7} b={499.9} text="FAST · BUT AIMED" />
        {cur?.k === "aim" && <Telestrator t={ta} a={500.1} b={504.8} snake={[520, 640]} cone={{ at: 500.6, ang: -8, len: 620 }} miss={{ at: 503.2, x: 1060, y: 560 }}
          label={{ at: 501.4, text: "COMMITS TO A POINT · TARGET MOVES", x: 380, y: 170 }} />}
        {cur?.k === "aim" && <Dust t={ta} n={20} op={0.3} />}
        <BigWord t={ta} a={505.2} b={507.2} text="SOMETHING STRANGE" />
        <Place t={ta} a={507.6} b={510.4} text="WINGS SPREAD · TAIL FANNED" />
        <Place t={ta} a={510.8} b={513.5} text="A BULLFIGHTER'S CAPE" />
        {cur?.k === "cape" && <Telestrator t={ta} a={513.7} b={520.5} snake={[460, 660]} cone={{ at: 514.6, ang: -14, len: 760 }} miss={{ at: 518.6, x: 1180, y: 480 }}
          label={{ at: 515.4, text: "THE TARGET IS FEATHERS · NOT THE BIRD", x: 360, y: 170 }} />}
        <BigWord t={ta} a={521.0} b={523.3} text="IT HITS FEATHERS" hot />
        <BigWord t={ta} a={523.5} b={524.4} text="OR AIR." />
        <BigWord t={ta} a={524.7} b={527.1} text="THE PART THAT DECIDES EVERYTHING" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
