// apex05 · MINUTO 4 (180,50–244,36 s) — #7 oso andino: único oso de Sudamérica, anteojos, Paddington, árboles y plataformas, dieta, sin ataques confirmados, la muerte del oso herido, el peligro al revés, qué hacer.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, StrikeList, SourceCard, RankCard, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF4 = 180.5, END4 = 244.36;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 180.5, b: 183.1, img: F + "andean_c86b6f0e.jpg", k: "rank", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "cut" } },
  { a: 183.1, b: 185.6, v: R + "andean_19366762", from: 1.0, out: { type: "cut" } },
  { a: 185.6, b: 188.6, comp: "map", out: { type: "cut" } },
  { a: 188.6, b: 191.0, v: T + "a61_andean_face", from: 1.0, out: { type: "cut" } },
  { a: 191.0, b: 193.5, img: F + "andean_f8bf668f.jpg", cam: [1.05, 0.5, 0.45, 1.25, 0.5, 0.4], out: { type: "flash" } },
  { a: 193.5, b: 196.0, v: R + "andes_19936738", from: 1.0, out: { type: "cut" } },
  { a: 196.0, b: 198.4, v: R + "andes_20466611", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 198.4, b: 200.6, img: F + "andean_a9c6534f.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.4], out: { type: "cut" } },
  { a: 200.6, b: 202.8, v: T + "a59_andean_tree", from: 1.0, out: { type: "cut" } },
  { a: 202.8, b: 204.8, v: T + "a29_andean_platform", from: 1.0, out: { type: "cut" } },
  { a: 204.8, b: 207.72, img: F + "andean_93ba69a5.jpg", k: "diet", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 207.72, b: 210.5, v: T + "andean_aed744a4", from: 0.0, out: { type: "flash" } },
  { a: 210.5, b: 213.0, v: T + "andean_bc29050b", from: 0.0, k: "rev", out: { type: "cut" } },
  { a: 213.0, b: 215.4, v: R + "andean_7723475", from: 1.0, k: "rev", out: { type: "cut" } },
  { a: 215.4, b: 217.4, img: F + "andean_aaf3a444.jpg", k: "rev", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 217.4, b: 220.4, v: R + "andean_13920857", from: 1.0, out: { type: "cut" } },
  { a: 220.4, b: 223.38, img: F + "andean_2e5d0483.jpg", cam: [1.1, 0.5, 0.5, 1.4, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 223.38, b: 225.8, img: F + "andean_4a03be22.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 225.8, b: 228.38, img: F + "andean_69d58e75.jpg", cam: [1.05, 0.3, 0.6, 1.25, 0.3, 0.6], out: { type: "flash" } },
  { a: 228.38, b: 231.0, v: T + "a60_andean_corn", from: 1.0, out: { type: "cut" } },
  { a: 231.0, b: 234.6, v: R + "andean_16263003", from: 1.0, out: { type: "cut" } },
  { a: 234.6, b: 236.8, v: R + "andean_12858363", from: 1.0, out: { type: "cut" } },
  { a: 236.8, b: 238.7, img: F + "andean_b2a29b45.jpg", cam: [1.05, 0.4, 0.6, 1.25, 0.4, 0.6], out: { type: "cut" } },
  { a: 238.7, b: 240.6, img: F + "andean_02c37b9e.jpg", k: "rules", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "cut" } },
  { a: 240.6, b: 242.4, v: R + "andean_15747425", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 242.4, b: 244.36, img: F + "andean_c4bb2910.jpg", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF4, b: s.b - OFF4 }));
const L = (x: number) => x - OFF4;

export const M4: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF4;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="wd" t0={L(185.6)} ranges={[{ at: 0.2, color: "#ffb347", pts: [[-73, 10], [-70, 8], [-75, 2], [-78, -2], [-76, -8], [-72, -13], [-66, -18], [-64, -19], [-68, -16], [-74, -11], [-79, -4], [-79, 1], [-76, 6]] }]} keys={[
      { at: 0, pos: [-12, 30, 28], look: [-15, 0, 3], fov: 34 },
      { at: 3.0, pos: [-16, 16, 16], look: [-16, 0, 3], fov: 34 },
    ]} pins={[{ at: 0.6, lon: -76, lat: -6, label: "THE ANDES", sub: "the only bear in South America", ring: true }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "rank" && <RankCard t={ta} a={180.6} b={183.05} n={7} name="ANDEAN BEAR" latin="Tremarctos ornatus" danger={1} />}
        <Place t={ta} a={183.3} b={185.5} text="Cloud forests" sub="high in the Andes" />
        <BigWord t={ta} a={188.8} b={190.9} text="SPECTACLED BEAR" size={170} />
        <Place t={ta} a={191.2} b={193.4} text="Pale rings" sub="that look like glasses" />
        <Place t={ta} a={193.8} b={198.3} text="Paddington" sub="the little bear from darkest Peru" />
        <Place t={ta} a={198.7} b={202.7} text="It climbs for fruit" sub="" />
        <Place t={ta} a={203.0} b={204.7} text="Platforms of branches" sub="to rest in the canopy" />
        {cur?.k === "diet" && <StrikeList t={ta} b={207.65} y={300} size={100} items={[{ at: 204.9, text: "BROMELIADS" }, { at: 205.9, text: "CACTUS" }, { at: 206.8, text: "CORN" }]} />}
        <BigWord t={ta} a={208.0} b={210.4} text="MEAT? BARELY" sub="a very small part of its diet" size={180} />
        {cur?.k === "rev" && <SourceCard t={ta} a={210.7} b={217.35} kicker="WORLDWIDE REVIEW · BEAR ATTACKS" title="No confirmed attack" sub="on people by this species" x={1060} y={260} />}
        <Place t={ta} a={217.6} b={220.3} text="The one human death" sub="sometimes linked to it" />
        <Stamp t={ta} a={220.6} b={223.3} text="ALREADY SHOT" sub="by a hunter" size={130} />
        <BigWord t={ta} a={223.6} b={228.3} text="IT RUNS FROM YOU" sub="more likely than it notices you" size={180} />
        <Place t={ta} a={228.6} b={230.9} text="The real danger" sub="runs the other way" />
        <BigWord t={ta} a={231.2} b={234.5} text="FARMERS KILL THEM" sub="for raiding crops" red size={170} />
        <Place t={ta} a={234.8} b={238.6} text="On a mountain trail" sub="the advice is simple" />
        {cur?.k === "rules" && <StrikeList t={ta} b={242.35} y={300} size={100} items={[{ at: 238.8, text: "STOP" }, { at: 239.5, text: "GIVE IT SPACE" }, { at: 240.8, text: "LET IT CLIMB AWAY" }]} />}
        <BigWord t={ta} a={242.6} b={244.3} text="IT ALMOST ALWAYS WILL" size={150} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M4_FRAMES = Math.round((END4 - OFF4) * FPS);
