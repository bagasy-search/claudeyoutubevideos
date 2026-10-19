// apex04 · MINUTO 4 (185,56–244,56 s) — sensores de presión, la paciencia, la rutina de la víctima, el golpe en menos de un segundo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Sensors, Counter, StrikeList, Letterbox } from "./comps";

export const OFF4 = 185.56, END4 = 244.56;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 185.56, b: 188.84, img: F + "croc_335434d9.jpg", k: "sens", cam: [1.0, 0.5, 0.5, 1.08, 0.45, 0.55], out: { type: "cut" } },
  { a: 188.84, b: 191.4, v: T + "g16_drop", from: 1.0, out: { type: "cut" } },
  { a: 191.4, b: 193.6, v: R + "croc_39018596", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.6, 0.55], out: { type: "cut" } },
  { a: 193.6, b: 196.4, v: R + "croc_30288431", from: 1.0, cam: [1.1, 0.4, 0.5, 1.22, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 196.4, b: 199.2, v: R + "croc_10041467", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 199.2, b: 200.72, v: R + "croc_4996609", from: 1.0, cam: [1.15, 0.55, 0.55, 1.3, 0.55, 0.6], out: { type: "flash" } },
  { a: 200.72, b: 203.4, v: T + "g17_underwater", from: 1.0, out: { type: "cut" } },
  { a: 203.4, b: 206.62, v: R + "croc_27588714", from: 3.0, cam: [1.05, 0.4, 0.6, 1.2, 0.4, 0.65], out: { type: "whip", vx: 1 } },
  { a: 206.62, b: 209.24, v: R + "croc_29700257", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 209.24, b: 211.9, v: R + "croc_30026544", from: 1.0, out: { type: "cut" } },
  { a: 211.9, b: 214.2, v: R + "croc_27588718", from: 1.0, cam: [1.1, 0.5, 0.5, 1.3, 0.5, 0.5], out: { type: "flash" } },
  { a: 214.2, b: 216.2, img: F + "lake_4bad26e8.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.45, 0.55], out: { type: "cut" } },
  { a: 216.2, b: 218.16, img: F + "lake_d4600227.jpg", cam: [1.18, 0.5, 0.45, 1.04, 0.5, 0.5], out: { type: "cut" } },
  { a: 218.16, b: 220.4, v: R + "lake_35562931", from: 1.0, out: { type: "cut" } },
  { a: 220.4, b: 222.6, v: R + "anim_6381862", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 222.6, b: 225.04, img: F + "lake_07ae3745.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.6, 0.6], out: { type: "whip", vx: -1 } },
  { a: 225.04, b: 226.28, v: R + "lake_39385209", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 226.28, b: 227.54, v: T + "g35_fence", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 227.54, b: 228.92, v: R + "lake_39181268", from: 1.0, k: "list", cam: [1.1, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 228.92, b: 231.34, v: R + "river_28603093", from: 1.0, k: "list", out: { type: "flash" } },
  { a: 231.34, b: 233.84, v: R + "croc_37659259", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.4, 0.5], out: { type: "cut" } },
  { a: 233.84, b: 236.4, v: R + "croc_4185628", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 236.4, b: 238.8, v: T + "g23_cattle", from: 1.0, out: { type: "cut" } },
  { a: 238.8, b: 240.99, v: R + "lake_4248047", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 240.99, b: 242.6, v: T + "g40_jaws", from: 1.0, out: { type: "flash" } },
  { a: 242.6, b: 244.56, img: F + "croc_2218fdf4.jpg", cam: [1.25, 0.3, 0.5, 1.05, 0.4, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF4, b: s.b - OFF4 }));

export const M4: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF4;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "sens" && <Sensors t={ta} a={185.7} b={188.8} cx={860} cy={560} rx={520} ry={110} n={140} label="PRESSURE SENSORS" />}
        <Place t={ta} a={191.6} b={196.3} text="Integumentary sense organs" sub="feel one drop on the surface" />
        <BigWord t={ta} a={199.3} b={200.68} text="IT FEELS YOU" red size={170} />
        <Counter t={ta} a={203.5} b={206.5} to={60} dur={1.4} digits={2} kicker="UNDERWATER AT REST" unit="MIN +" center y={330} size={230} />
        <Place t={ta} a={206.8} b={209.1} text="Same spot" sub="for days" />
        <BigWord t={ta} a={209.5} b={211.8} text="MONTHS" sub="without eating" size={210} />
        <BigWord t={ta} a={212.1} b={214.15} text="PATIENCE" red size={220} />
        <Place t={ta} a={214.4} b={218.0} text="The attack studies" sub="the same pattern, again and again" />
        <StrikeList t={ta} b={231.3} items={[{ at: 225.36, text: "FETCHING WATER" }, { at: 226.28, text: "WASHING CLOTHES" }, { at: 227.54, text: "FISHING FROM THE BANK" }, { at: 228.92, text: "CROSSING AT THE USUAL SPOT" }]} />
        <Place t={ta} a={239.0} b={240.9} text="Same place · same time" sub="again and again" />
        <BigWord t={ta} a={241.1} b={242.55} text="< 1 SECOND" red size={200} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M4_FRAMES = Math.round((END4 - OFF4) * FPS);
