// apex04 · MINUTO 11 (629,23–689,41 s) — la última semana: la cabra, la tormenta, la jaula hundida, ninguna imagen; el documental y la leyenda global.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, IRCam, StrikeList, SourceCard, Rain, Flash, Letterbox } from "./comps";

export const OFF11 = 629.23, END11 = 689.41;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 629.23, b: 631.8, img: F + "hills_e2ee0283.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 631.8, b: 634.89, img: F + "city_e22438f4.jpg", grade: "brightness(.8) saturate(.7)", cam: [1.15, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "flash" } },
  { a: 634.89, b: 636.69, v: R + "lake_12285436", from: 1.0, out: { type: "cut" } },
  { a: 636.69, b: 639.17, v: R + "anim_5930404", from: 1.0, out: { type: "cut" } },
  { a: 639.17, b: 640.59, v: T + "g04_cage_night", from: 1.0, k: "ir1", out: { type: "cut" } },
  { a: 640.59, b: 642.53, v: R + "lake_18626418", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 642.53, b: 644.3, v: T + "g05_storm_cage", from: 1.0, out: { type: "cut" } },
  { a: 644.3, b: 645.91, v: R + "storm_856429", from: 1.0, out: { type: "cut" } },
  { a: 645.91, b: 647.85, v: R + "storm_3999405", from: 1.0, k: "ir2", grade: "grayscale(1) contrast(1.4) brightness(1.1)", out: { type: "cut" } },
  { a: 647.85, b: 650.2, v: T + "g06_cage_flooded", from: 1.0, out: { type: "cut" } },
  { a: 650.2, b: 652.41, v: R + "storm_4169231", from: 1.0, out: { type: "cut" } },
  { a: 652.41, b: 654.55, img: F + "ruzizi_d4985d4e.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 654.55, b: 655.97, v: R + "otros_3223854", from: 1.0, out: { type: "cut" } },
  { a: 655.97, b: 657.51, v: R + "river_3978650", from: 1.0, out: { type: "cut" } },
  { a: 657.51, b: 660.25, v: R + "lake_8295430", from: 1.0, out: { type: "flash" } },
  { a: 660.25, b: 663.61, v: R + "anim_6520473", from: 1.0, k: "th", out: { type: "cut" } },
  { a: 663.61, b: 665.15, v: R + "anim_29061305", from: 1.0, k: "th", out: { type: "cut" } },
  { a: 665.15, b: 667.4, img: F + "croc_7ae2f530.jpg", k: "th", cam: [1.05, 0.5, 0.5, 1.2, 0.4, 0.5], out: { type: "cut" } },
  { a: 667.4, b: 669.6, v: R + "croc_26347901", from: 1.0, k: "th", cam: [1.2, 0.5, 0.5, 1.3, 0.5, 0.45], out: { type: "cut" } },
  { a: 669.6, b: 671.61, v: R + "lake_4978267", from: 1.0, k: "th", out: { type: "flash" } },
  { a: 671.61, b: 673.59, v: R + "lake_10789868", from: 1.0, out: { type: "cut" } },
  { a: 673.59, b: 675.01, img: F + "lake_db883da9.jpg", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 675.01, b: 677.4, v: R + "otros_856593", from: 1.0, k: "pbs", out: { type: "cut" } },
  { a: 677.4, b: 679.3, v: R + "otros_1908630", from: 1.0, k: "pbs", out: { type: "cut" } },
  { a: 679.3, b: 681.25, v: R + "otros_7233533", from: 1.0, k: "pbs", out: { type: "cut" } },
  { a: 681.25, b: 685.25, v: R + "otros_7233574", from: 1.0, k: "pbs", out: { type: "flash" } },
  { a: 685.25, b: 687.4, v: R + "lake_4124205", from: 1.0, out: { type: "cut" } },
  { a: 687.4, b: 689.41, v: R + "croc_27064128", from: 1.0, cam: [1.25, 0.6, 0.5, 1.35, 0.6, 0.45] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF11, b: s.b - OFF11 }));

export const M11: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF11;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Stamp t={ta} a={629.6} b={634.8} text="FINAL WEEK" sub="the team must leave the country" size={140} />
        <BigWord t={ta} a={635.0} b={636.6} text="ONE LAST CHANCE" size={160} />
        <Place t={ta} a={636.9} b={639.1} text="A live goat" sub="inside the cage" />
        {cur?.k === "ir1" && <IRCam t={ta} a={639.17} b={640.59} cam="CAGE CAM · IR" date="2004" />}
        {ta >= 642.53 && ta < 647.85 && <Rain t={ta} n={220} op={0.55} />}
        <Flash t={ta} at={[642.7, 643.5, 644.4, 645.95]} />
        {cur?.k === "ir2" && <IRCam t={ta} a={645.91} b={647.85} cam="CAGE CAM · IR" date="2004" lostAt={646.7} />}
        <Place t={ta} a={648.0} b={652.3} text="Morning" sub="the cage, half underwater" />
        <BigWord t={ta} a={652.5} b={654.5} text="THE GOAT WAS GONE" red size={150} />
        <BigWord t={ta} a={654.6} b={655.9} text="NO FOOTAGE" size={190} />
        <BigWord t={ta} a={656.0} b={657.45} text="NO CROCODILE" size={190} />
        {cur?.k === "th" && <StrikeList t={ta} b={671.55} y={300} size={70} items={[{ at: 660.3, text: "1 · STORM SURGE, GOAT ESCAPED" }, { at: 663.65, text: "2 · ANOTHER ANIMAL TOOK IT" }, { at: 665.3, text: "3 · GUSTAVE CAME… AND LEFT" }]} />}
        <Place t={ta} a={671.8} b={674.9} text="No answer" sub="they left Burundi" />
        {cur?.k === "pbs" && <SourceCard t={ta} a={675.2} b={685.2} kicker="PBS · 2004" title="Capturing the Killer Croc" sub="the main source on Gustave" x={110} y={240} />}
        <BigWord t={ta} a={685.4} b={689.3} text="2007 · HOLLYWOOD" sub="a horror movie, loosely inspired by him" size={150} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M11_FRAMES = Math.round((END11 - OFF11) * FPS);
