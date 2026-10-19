// apex05 · MINUTO 2 (64,36–123,30 s) — cómo armamos el ranking (3 criterios), defensa vs comida, "los ataques son raros", patrones, se abre el expediente → #8 panda.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, CaseCard, StrikeList, Gauge, RankCard, Letterbox } from "./comps";

export const OFF2 = 64.36, END2 = 123.3;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 64.36, b: 66.6, v: R + "brown_18856748", from: 1.0, k: "crit", out: { type: "cut" } },
  { a: 66.6, b: 68.9, v: R + "black_855113", from: 1.0, k: "crit", out: { type: "cut" } },
  { a: 68.9, b: 71.1, v: T + "moon_2337c1f6", from: 0.0, k: "crit", out: { type: "flash" } },
  { a: 71.1, b: 74.0, v: T + "a23_grizzly_mother", from: 1.0, out: { type: "whip", vx: 1 } },
  { a: 74.0, b: 75.9, v: T + "a18_polar_stalk", from: 1.0, out: { type: "cut" } },
  { a: 75.9, b: 77.6, v: R + "brown_5993800", from: 1.0, grade: "brightness(.8) saturate(.8)", out: { type: "white", d: 0.3 } },
  { a: 77.6, b: 80.8, v: R + "polar_6887988", from: 1.0, out: { type: "cut" } },
  { a: 80.8, b: 82.6, v: R + "panda_39646286", from: 1.0, out: { type: "cut" } },
  { a: 82.6, b: 84.7, v: R + "black_855114", from: 1.0, cam: [1.1, 0.4, 0.55, 1.3, 0.4, 0.55], out: { type: "flash" } },
  { a: 84.7, b: 86.9, v: R + "brown_7630637", from: 1.0, out: { type: "cut" } },
  { a: 86.9, b: 88.7, v: R + "brown_10644131", from: 1.0, out: { type: "cut" } },
  { a: 88.7, b: 90.2, v: R + "brown_7624652", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 90.2, b: 91.7, v: R + "brown_5534696", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 91.7, b: 93.2, v: R + "india_4684807", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 93.2, b: 94.7, v: R + "india_5734595", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 94.7, b: 96.8, v: R + "brown_7624590", from: 1.0, out: { type: "flash" } },
  { a: 96.8, b: 99.2, v: R + "black_9640796", from: 1.0, k: "pat", out: { type: "cut" } },
  { a: 99.2, b: 101.6, v: R + "black_36082573", from: 1.0, k: "pat", out: { type: "cut" } },
  { a: 101.6, b: 103.14, v: R + "black_4064322", from: 1.0, k: "pat", out: { type: "white", d: 0.3 } },
  { a: 103.14, b: 104.88, v: R + "brown_11035302", from: 1.0, out: { type: "flash" } },
  { a: 104.88, b: 107.6, v: R + "panda_39645918", from: 1.0, k: "rank", out: { type: "cut" } },
  { a: 107.6, b: 109.6, v: R + "panda_39646279", from: 1.0, out: { type: "cut" } },
  { a: 109.6, b: 111.7, v: R + "panda_39633711", from: 1.0, out: { type: "cut" } },
  { a: 111.7, b: 114.2, v: T + "a32_panda_chew", from: 1.0, out: { type: "cut" } },
  { a: 114.2, b: 116.7, v: R + "panda_38020831", from: 1.0, out: { type: "cut" } },
  { a: 116.7, b: 119.3, v: T + "a31_panda_wild", from: 4.3, out: { type: "cut" } },
  { a: 119.3, b: 121.2, v: R + "panda_5254760", from: 1.0, k: "hrs", out: { type: "cut" } },
  { a: 121.2, b: 123.3, v: R + "panda_39646281", from: 1.0, k: "hrs" },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF2, b: s.b - OFF2 }));

export const M2: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF2;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "crit" && <CaseCard t={ta} a={64.5} b={71.05} title="HOW WE RANKED THEM" x={1060} y={150}
          rows={[{ at: 67.1, k: "1 · HOW OFTEN", v: "it attacks people" }, { at: 69.0, k: "2 · HOW DEADLY", v: "fatal attacks" }, { at: 70.2, k: "3 · WHY", v: "defense or food", red: true }]} />}
        <BigWord t={ta} a={71.3} b={73.9} text="DEFENSE" sub="itself · its cubs" size={210} />
        <BigWord t={ta} a={74.1} b={77.5} text="FOOD" sub="a person as prey" red size={240} />
        <Place t={ta} a={77.8} b={80.7} text="Rarely meets people" sub="can still be deadly" />
        <Place t={ta} a={81.0} b={82.3} text="Looks harmless" sub="" />
        <BigWord t={ta} a={82.6} b={84.6} text="TOP OF THE LIST?" size={170} />
        <BigWord t={ta} a={84.9} b={86.8} text="ONE WARNING" size={190} />
        <BigWord t={ta} a={87.1} b={88.6} text="ATTACKS ARE RARE" size={170} />
        {cur?.k === "list" && <StrikeList t={ta} b={94.65} y={300} size={100} items={[{ at: 88.9, text: "HIKE" }, { at: 90.3, text: "FISH" }, { at: 91.8, text: "FARM" }, { at: 93.3, text: "LIVE THERE" }]} />}
        <Place t={ta} a={94.9} b={96.7} text="Almost all of them" sub="never see a bear up close" />
        {cur?.k === "pat" && <CaseCard t={ta} a={97.0} b={103.05} title="ATTACKS FOLLOW PATTERNS" x={1060} y={150}
          rows={[{ at: 97.6, k: "SURPRISE", v: "close range" }, { at: 98.6, k: "MOTHER", v: "with cubs" }, { at: 100.2, k: "FOOD", v: "camps · garbage" }, { at: 101.7, k: "HUNGER", v: "a predatory male", red: true }]} />}
        <Stamp t={ta} a={103.3} b={104.8} text="CASE FILE · OPEN" size={110} />
        {cur?.k === "rank" && <RankCard t={ta} a={105.0} b={107.55} n={8} name="GIANT PANDA" latin="Ailuropoda melanoleuca" danger={1} note="least dangerous of the eight" />}
        <BigWord t={ta} a={108.2} b={111.6} text="MOST FAMOUS" sub="and the least dangerous" size={190} />
        <Place t={ta} a={112.0} b={119.2} text="Bamboo" sub="almost everything it eats" />
        {cur?.k === "hrs" && <Gauge t={ta} a={119.4} b={123.25} value={14} max={24} unit="HOURS" caption="CHEWING · EVERY DAY" x={480} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M2_FRAMES = Math.round((END2 - OFF2) * FPS);
