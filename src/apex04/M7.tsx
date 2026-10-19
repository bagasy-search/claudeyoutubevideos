// apex04 · MINUTO 7 (368,43–431,08 s) — la leyenda oscura (mata y no come), lo que dicen los científicos, las medidas estimadas.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, StrikeList, SpanMark, Counter, LifeBar, Stamp, Letterbox, CrocScale } from "./comps";

export const OFF7 = 368.43, END7 = 431.08;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 368.43, b: 370.6, v: R + "lake_29874204", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 370.6, b: 372.88, v: R + "lake_3558140", from: 1.0, out: { type: "cut" } },
  { a: 372.88, b: 375.2, v: R + "river_28779831", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 375.2, b: 377.5, v: T + "g21_night_wake", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 377.5, b: 380.44, v: R + "storm_10261073", from: 1.0, out: { type: "flash" } },
  { a: 380.44, b: 382.6, img: F + "croc_6d5e6cd3.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "cut" } },
  { a: 382.6, b: 384.79, v: R + "storm_5914483", from: 1.0, out: { type: "cut" } },
  { a: 384.79, b: 387.62, img: F + "hills_5421dc13.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.6], out: { type: "whip", vx: 1 } },
  { a: 387.62, b: 389.58, img: F + "croc_c3c54520.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 389.58, b: 392.6, v: R + "river_3994403", from: 1.0, k: "why", out: { type: "cut" } },
  { a: 392.6, b: 395.62, v: R + "river_5951412", from: 1.0, k: "why", out: { type: "dissolve", d: 0.4 } },
  { a: 395.62, b: 398.2, v: R + "storm_3052162", from: 1.0, grade: "brightness(1.7) contrast(1.1)", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.6], out: { type: "cut" } },
  { a: 398.2, b: 400.87, img: F + "hills_ad309e61.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.55], out: { type: "flash" } },
  { a: 400.87, b: 403.2, v: T + "g41_bask_dusk", from: 1.0, out: { type: "cut" } },
  { a: 403.2, b: 405.2, v: T + "g31_delta_aerial", from: 1.0, out: { type: "cut" } },
  { a: 405.2, b: 407.26, img: F + "croc_0ed90eb0.jpg", cam: [1.25, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "cut" } },
  { a: 407.26, b: 411.17, img: F + "croc_07d46510.jpg", k: "len", cam: [1.0, 0.5, 0.5, 1.06, 0.5, 0.5], out: { type: "cut" } },
  { a: 411.17, b: 413.3, img: F + "lake_d3dbbf1b.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "cut" } },
  { a: 413.3, b: 415.58, img: F + "lake_960c6463.jpg", cam: [1.2, 0.5, 0.55, 1.05, 0.5, 0.5], out: { type: "flash" } },
  { a: 415.58, b: 418.19, img: F + "croc_e487fb58.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 418.19, b: 422.08, v: R + "river_6843742", from: 1.0, k: "life", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 422.08, b: 424.6, img: F + "croc_d757184a.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 424.6, b: 427.19, img: F + "croc_7fb33809.jpg", cam: [1.2, 0.3, 0.6, 1.05, 0.4, 0.55], out: { type: "white", d: 0.3 } },
  { a: 427.19, b: 431.08, v: R + "croc_854156", from: 1.0, cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF7, b: s.b - OFF7 }));

export const M7: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF7;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={368.6} b={372.7} text="Reports" sub="from the river · from villages along the lakeshore" />
        <BigWord t={ta} a={377.7} b={380.35} text="UNEATEN" red size={230} />
        <BigWord t={ta} a={382.8} b={384.7} text="NOT HUNTING FOR FOOD?" size={130} />
        <Place t={ta} a={387.8} b={389.5} text="Scientists" sub="are more careful" />
        {cur?.k === "why" && <StrikeList t={ta} b={395.55} y={360} size={76} items={[{ at: 390.3, text: "STORED UNDERWATER FOR LATER" }, { at: 393.0, text: "ABANDONED WHEN DISTURBED" }]} />}
        <BigWord t={ta} a={401.0} b={403.1} text="THE ONE THEY COULD SEE" size={120} />
        <BigWord t={ta} a={405.4} b={407.2} text="IMPOSSIBLE TO MISS" red size={140} />
        {cur?.k === "len" && <SpanMark t={ta} a={407.4} b={411.1} x1={240} y1={700} x2={1680} y2={660} label="≈ 20 FT" sub="the witnesses' estimate" ticks={20} />}
        <CrocScale t={ta} a={411.25} b={415.5} growAt={412.3} />
        <Counter t={ta} a={415.8} b={418.1} to={2000} dur={1.2} digits={4} comma kicker="ESTIMATED WEIGHT" unit="LB" center y={330} size={220} />
        {cur?.k === "life" && <LifeBar t={ta} a={418.3} b={422.0} max={100} marks={[{ at: 419.0, v: 60, label: "GUSTAVE ≈ 60", red: true }]} />}
        <Stamp t={ta} a={422.4} b={427.1} text="ESTIMATE" sub="nobody ever measured him" />
        <BigWord t={ta} a={427.5} b={431.0} text="STILL A MONSTER" red size={170} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M7_FRAMES = Math.round((END7 - OFF7) * FPS);
