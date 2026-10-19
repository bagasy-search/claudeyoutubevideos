// apex05 · MINUTO 7 (369,70–439,50 s) — polar: raro de encontrar, las reglas del Ártico, la cárcel de osos de Churchill, no hacerse el muerto → #4 oso negro americano: el que más se ve, tímido, el amago, las crías al árbol.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, CaseCard, StrikeList, RankCard, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF7 = 369.7, END7 = 439.5;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 369.7, b: 372.0, v: T + "polar_5aed4bf4", from: 0.0, out: { type: "cut" } },
  { a: 372.0, b: 373.88, v: R + "polar_26647326", from: 1.0, out: { type: "cut" } },
  { a: 373.88, b: 377.32, v: R + "polar_35884069", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 377.32, b: 379.6, v: R + "arctic_8318779", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 379.6, b: 381.64, v: R + "arctic_11269270", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 381.64, b: 383.62, v: R + "arctic_11676591", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 383.62, b: 386.6, v: R + "arctic_8318785", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 386.6, b: 389.3, v: T + "a19_polar_patrol", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 389.3, b: 392.04, v: T + "polar_03b1ac24", from: 0.0, k: "rules", out: { type: "flash" } },
  { a: 392.04, b: 395.0, comp: "map1", out: { type: "cut" } },
  { a: 395.0, b: 397.4, v: T + "polar_7326e044", from: 0.0, k: "jail", out: { type: "cut" } },
  { a: 397.4, b: 399.88, v: T + "polar_19e86132", from: 0.0, k: "jail", out: { type: "white", d: 0.3 } },
  { a: 399.88, b: 402.5, v: T + "polar_4737e514", from: 0.0, out: { type: "cut" } },
  { a: 402.5, b: 405.14, v: R + "polar_39113256", from: 0.5, out: { type: "cut" } },
  { a: 405.14, b: 406.66, v: R + "polar_37219179", from: 1.0, out: { type: "flash" } },
  { a: 406.66, b: 409.0, v: R + "polar_8318412", from: 1.0, k: "fight", out: { type: "cut" } },
  { a: 409.0, b: 411.3, img: F + "polar_e6f80746.jpg", k: "fight", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "white", d: 0.3 } },
  { a: 411.3, b: 414.3, img: F + "black_9263124c.jpg", k: "rank", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "cut" } },
  { a: 414.3, b: 416.4, v: R + "black_854303", from: 1.0, out: { type: "cut" } },
  { a: 416.4, b: 418.36, img: F + "black_df9cdaf9.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.45], out: { type: "cut" } },
  { a: 418.36, b: 421.0, comp: "map2", out: { type: "cut" } },
  { a: 421.0, b: 423.5, v: R + "black_3882052", from: 1.0, out: { type: "cut" } },
  { a: 423.5, b: 426.0, v: R + "black_36199977", from: 1.0, out: { type: "cut" } },
  { a: 426.0, b: 428.44, v: R + "black_3150387", from: 1.0, out: { type: "cut" } },
  { a: 428.44, b: 431.06, img: F + "black_ad1efcaa.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.55], out: { type: "cut" } },
  { a: 431.06, b: 433.0, v: T + "a21_black_bluff", from: 1.0, k: "bluff", out: { type: "cut" } },
  { a: 433.0, b: 434.96, img: F + "black_fe22ebd5.jpg", k: "bluff", cam: [1.0, 0.6, 0.5, 1.1, 0.6, 0.5], out: { type: "cut" } },
  { a: 434.96, b: 437.3, v: T + "a22_black_cubs_tree", from: 1.0, out: { type: "cut" } },
  { a: 437.3, b: 439.5, img: F + "black_aaf1f652.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF7, b: s.b - OFF7 }));
const L = (x: number) => x - OFF7;

export const M7: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF7;
  const renderComp = (s: Shot) => {
    if (s.comp === "map1") return <GeoMap m="wd" t0={L(392.04)} keys={[
      { at: 0, pos: [-16, 28, 10], look: [-19, 0, -6], fov: 34 },
      { at: 3.0, pos: [-20, 13, 1], look: [-20, 0, -9.5], fov: 34 },
    ]} pins={[{ at: 0.5, lon: -94.2, lat: 58.8, label: "CHURCHILL, CANADA", sub: "the polar bear capital", ring: true }]} />;
    if (s.comp === "map2") return <GeoMap m="wd" t0={L(418.36)} keys={[
      { at: 0, pos: [-18, 30, 16], look: [-21, 0, -5], fov: 34 },
      { at: 2.7, pos: [-21, 20, 9], look: [-21, 0, -5], fov: 34 },
    ]} pins={[{ at: 0.3, lon: -100, lat: 56, label: "CANADA", ring: false }, { at: 1.1, lon: -104, lat: 24, label: "MEXICO", ring: false }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={369.9} b={373.8} text="NOT BECAUSE IT'S GENTLE" size={150} />
        <BigWord t={ta} a={374.1} b={377.2} text="RARE TO MEET" sub="that's the only reason" size={190} />
        <Place t={ta} a={377.5} b={381.5} text="In the Arctic" sub="people follow strict rules" />
        {cur?.k === "rules" && <StrikeList t={ta} b={391.95} y={280} size={92} items={[{ at: 381.7, text: "NEVER ALONE AT NIGHT" }, { at: 383.7, text: "DOGS THAT BARK" }, { at: 386.8, text: "BEAR PATROLS" }]} />}
        {cur?.k === "jail" && <CaseCard t={ta} a={395.1} b={399.8} title="POLAR BEAR JAIL" x={1060} y={150}
          rows={[{ at: 395.4, k: "WHERE", v: "Churchill · Canada" }, { at: 396.3, k: "HOLDS", v: "problem bears", red: true }, { at: 397.6, k: "UNTIL", v: "the sea ice returns" }]} />}
        <Place t={ta} a={400.1} b={402.4} text="If a polar bear is stalking you" sub="" />
        <BigWord t={ta} a={402.7} b={405.05} text="THE OPPOSITE ADVICE" size={170} />
        <BigWord t={ta} a={405.2} b={406.6} text="DON'T PLAY DEAD" red size={190} />
        {cur?.k === "fight" && <StrikeList t={ta} b={411.25} y={300} size={110} items={[{ at: 406.8, text: "LOOK BIG" }, { at: 407.9, text: "MAKE NOISE" }, { at: 409.2, text: "FIGHT BACK" }]} />}
        {cur?.k === "rank" && <RankCard t={ta} a={411.4} b={414.25} n={4} name="AMERICAN BLACK BEAR" latin="Ursus americanus" danger={7} />}
        <Place t={ta} a={414.6} b={418.3} text="The bear most people see" sub="in North America" />
        <BigWord t={ta} a={418.5} b={420.95} text="HUNDREDS OF THOUSANDS" size={140} />
        <Place t={ta} a={421.2} b={423.4} text="Right next to towns" sub="" />
        <Place t={ta} a={423.7} b={425.9} text="Campgrounds" sub="" />
        <Place t={ta} a={426.2} b={428.35} text="Garbage bins" sub="" />
        <BigWord t={ta} a={428.6} b={431.0} text="USUALLY TIMID" size={190} />
        {cur?.k === "bluff" && <StrikeList t={ta} b={434.9} y={300} size={100} items={[{ at: 431.2, text: "HUFF" }, { at: 432.1, text: "SLAP THE GROUND" }, { at: 433.5, text: "BACK AWAY" }]} />}
        <Place t={ta} a={435.1} b={439.4} text="Cubs up a tree" sub="and the mother leaves" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M7_FRAMES = Math.round((END7 - OFF7) * FPS);
