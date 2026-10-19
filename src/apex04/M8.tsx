// apex04 · MINUTO 8 (431,08–494,93 s) — las cicatrices de bala, la teoría de Faye (presas grandes), y la otra razón: la historia de Burundi.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Mark, StrikeList, TimeRail, Letterbox } from "./comps";

export const OFF8 = 431.08, END8 = 494.93;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 431.08, b: 433.6, img: F + "lake_3db05fd9.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 433.6, b: 436.69, v: R + "otros_4047523", from: 0.5, out: { type: "flash" } },
  { a: 436.69, b: 440.31, v: T + "g09_scars", from: 1.0, k: "scars", out: { type: "cut" } },
  { a: 440.31, b: 443.46, img: F + "croc_34ea8361.jpg", k: "shoulder", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 443.46, b: 445.4, img: F + "croc_3927da08.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.6, 0.5], out: { type: "flash" } },
  { a: 445.4, b: 447.26, v: R + "river_4377020", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.6], out: { type: "white", d: 0.3 } },
  { a: 447.26, b: 449.9, v: T + "g30_sink", from: 1.0, out: { type: "cut" } },
  { a: 449.9, b: 452.0, img: F + "lake_026c99e4.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 452.0, b: 454.14, img: F + "croc_044d01ee.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.55, 0.5], out: { type: "cut" } },
  { a: 454.14, b: 456.4, v: R + "anim_29981058", from: 1.0, out: { type: "cut" } },
  { a: 456.4, b: 459.5, v: R + "anim_9274929", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 459.5, b: 461.6, v: R + "anim_34345832", from: 1.0, out: { type: "cut" } },
  { a: 461.6, b: 463.8, v: R + "anim_3625458", from: 2.0, out: { type: "cut" } },
  { a: 463.8, b: 467.02, v: R + "anim_11968386", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "flash" } },
  { a: 467.02, b: 468.58, v: R + "anim_12939735", from: 1.0, k: "menu", out: { type: "cut" } },
  { a: 468.58, b: 469.55, v: R + "anim_11968406", from: 1.0, k: "menu", out: { type: "cut" } },
  { a: 469.55, b: 472.3, v: T + "g22_hippo", from: 1.0, k: "menu", out: { type: "cut" } },
  { a: 472.3, b: 473.67, img: F + "lake_9f95bbab.jpg", k: "menu", cam: [1.1, 0.5, 0.5, 1.25, 0.6, 0.55], out: { type: "flash" } },
  { a: 473.67, b: 476.4, v: R + "storm_11489658", from: 1.0, out: { type: "cut" } },
  { a: 476.4, b: 478.6, v: R + "storm_2895820", from: 1.0, out: { type: "cut" } },
  { a: 478.6, b: 480.59, v: R + "river_31204499", from: 1.0, out: { type: "sweep", d: 0.5 } },
  { a: 480.59, b: 483.55, img: F + "hills_48b175f1.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 483.55, b: 486.6, img: F + "city_072cf36d.jpg", k: "rail", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 486.6, b: 489.4, img: F + "city_2faa83ff.jpg", k: "rail", grade: "grayscale(1) contrast(1.1) brightness(.85)", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 489.4, b: 491.9, img: F + "hills_8bbb16b6.jpg", k: "rail", grade: "grayscale(.6) contrast(1.1) brightness(.8)", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 491.9, b: 494.93, v: R + "war_856150", from: 1.0, k: "rail", grade: "grayscale(.5) contrast(1.15) brightness(.8)" },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF8, b: s.b - OFF8 }));

export const M8: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF8;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={431.3} b={436.5} text="Late 1990s" sub="observers notice something else" />
        {cur?.k === "scars" && <>
          <Mark t={ta} a={437.3} b={440.25} x={700} y={460} r={55} n="1" side="l" />
          <Mark t={ta} a={437.8} b={440.25} x={960} y={520} r={55} n="2" />
          <Mark t={ta} a={438.3} b={440.25} x={1220} y={470} r={55} n="3" label="BULLET SCARS" />
        </>}
        {cur?.k === "shoulder" && <Mark t={ta} a={440.6} b={443.4} x={1400} y={460} r={95} n="4" label="RIGHT SHOULDER · DEEP WOUND" />}
        <BigWord t={ta} a={443.8} b={447.2} text="A RIFLE" sub="somebody tried to kill him" size={220} />
        <BigWord t={ta} a={447.85} b={449.85} text="NOT ENOUGH" red size={220} />
        <Place t={ta} a={450.1} b={453.9} text="Faye's theory" />
        <BigWord t={ta} a={454.4} b={459.3} text="TOO HEAVY" sub="for fast, small prey" size={200} />
        <Place t={ta} a={460.5} b={466.8} text="Bigger animals" sub="the ones that come to the water" />
        {cur?.k === "menu" && <StrikeList t={ta} b={473.6} y={300} size={96} items={[{ at: 467.05, text: "ANTELOPE" }, { at: 468.6, text: "CATTLE" }, { at: 469.6, text: "AN ADULT HIPPO?" }, { at: 472.35, text: "PEOPLE" }]} />}
        <BigWord t={ta} a={474.0} b={480.4} text="ANOTHER REASON" sub="nothing to do with biology" size={180} />
        <Place t={ta} a={480.8} b={483.4} text="Burundi" sub="what happened to the country" />
        {cur?.k === "rail" && <TimeRail t={ta} a={483.65} b={494.9} ev={[{ at: 484.4, y: "1962", text: "INDEPENDENCE FROM BELGIUM" }, { at: 488.5, y: "1965–1988", text: "HUTU–TUTSI VIOLENCE, AGAIN AND AGAIN" }, { at: 493.6, y: "1993", text: "CIVIL WAR" }]} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M8_FRAMES = Math.round((END8 - OFF8) * FPS);
