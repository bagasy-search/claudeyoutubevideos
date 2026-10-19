// apex05 · MINUTO 11 (627,65–689,61 s) — #2 oso luna: récord roto (AF2025: 238 / 13), osos en pueblos, escuelas y un supermercado, ~300 lb, se para y va a la cara, por qué ahora, cascabeles y rifles, carteles en la calle → "hay uno peor".
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, CaseCard, StrikeList, SizeVs, BearLineup, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF11 = 627.65, END11 = 689.61;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 627.65, b: 629.31, img: F + "sign_88865ee1.jpg", cam: [1.0, 0.5, 0.4, 1.12, 0.5, 0.4], out: { type: "flash" } },
  { a: 629.31, b: 632.0, v: T + "a13_moon_stand", from: 1.0, k: "fy25", out: { type: "cut" } },
  { a: 632.0, b: 634.6, img: F + "moon_ab72aebd.jpg", k: "fy25", cam: [1.0, 0.3, 0.5, 1.1, 0.3, 0.5], out: { type: "cut" } },
  { a: 634.6, b: 636.8, img: F + "moon_02a5ddb3.jpg", k: "fy25", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 636.8, b: 638.87, v: R + "jp_10483572", from: 1.0, k: "fy25", out: { type: "cut" } },
  { a: 638.87, b: 641.2, v: R + "jp_9381751", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 641.2, b: 642.9, v: R + "jp_17433810", from: 1.0, k: "list", out: { type: "cut" } },
  { a: 642.9, b: 644.45, v: T + "a14_supermarket", from: 1.0, k: "list", out: { type: "flash" } },
  { a: 644.45, b: 646.83, v: T + "moon_d6d68af0", from: 0.0, out: { type: "cut" } },
  { a: 646.83, b: 649.79, img: F + "moon_5641dee8.jpg", k: "size", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "cut" } },
  { a: 649.79, b: 652.0, v: T + "moon_1789a347", from: 0.0, out: { type: "cut" } },
  { a: 652.0, b: 654.27, img: F + "moon_53c8990d.jpg", cam: [1.05, 0.5, 0.35, 1.25, 0.5, 0.3], out: { type: "flash" } },
  { a: 654.27, b: 657.6, comp: "map", out: { type: "cut" } },
  { a: 657.6, b: 660.25, v: T + "moon_def9db25", from: 0.0, grade: "brightness(.75) saturate(.7)", out: { type: "cut" } },
  { a: 660.25, b: 662.8, v: R + "jp_19291328", from: 1.0, k: "why", out: { type: "cut" } },
  { a: 662.8, b: 665.4, v: R + "jp_6380755", from: 1.0, k: "why", out: { type: "cut" } },
  { a: 665.4, b: 668.71, v: T + "a16_acorns", from: 1.0, k: "why", out: { type: "cut" } },
  { a: 668.71, b: 671.2, img: F + "sign_005fc582.jpg", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.55], out: { type: "cut" } },
  { a: 671.2, b: 673.6, v: T + "a35_bear_bell", from: 1.0, out: { type: "cut" } },
  { a: 673.6, b: 676.0, v: R + "jp_17537822", from: 1.0, out: { type: "cut" } },
  { a: 676.0, b: 678.45, v: T + "moon_00f68e78", from: 0.0, out: { type: "cut" } },
  { a: 678.45, b: 681.6, v: R + "jp_17439837", from: 1.0, out: { type: "cut" } },
  { a: 681.6, b: 684.87, img: F + "sign_732989c3.jpg", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 684.87, b: 688.0, comp: "worse", out: { type: "flash" } },
  { a: 688.0, b: 689.61, img: F + "sloth_747e1631.jpg", cam: [1.1, 0.5, 0.5, 1.3, 0.5, 0.55] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF11, b: s.b - OFF11 }));
const L = (x: number) => x - OFF11;

export const M11: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF11;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="wd" t0={L(654.27)} keys={[
      { at: 0, pos: [20, 26, 16], look: [20, 0, -4], fov: 34 },
      { at: 3.4, pos: [21, 21, 11], look: [21, 0, -4], fov: 34 },
    ]} pins={[{ at: 0.3, lon: 138, lat: 37, label: "JAPAN", ring: false }, { at: 0.9, lon: 78, lat: 22, label: "INDIA", ring: false }, { at: 1.5, lon: 84, lat: 28.4, label: "NEPAL", ring: false }]} />;
    if (s.comp === "worse") return <>
      <Img src={staticFile(F + "sloth_c0cac2b0.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)" }} />
      <BearLineup t={ta} a={684.9} b={688.05} showRank hi={1} title="ONE BEAR IS WORSE" />
    </>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={627.75} b={629.25} text="THEN IT BROKE" size={200} />
        {cur?.k === "fy25" && <CaseCard t={ta} a={629.4} b={638.8} title="JAPAN · FISCAL 2025" x={1060} y={150}
          rows={[{ at: 632.4, k: "ATTACKED", v: "238 people" }, { at: 634.4, k: "KILLED", v: "13", red: true }]} stamp={{ at: 637.0, text: "HIGHEST EVER" }} />}
        {cur?.k === "list" && <StrikeList t={ta} b={644.4} y={300} size={100} items={[{ at: 639.7, text: "TOWNS" }, { at: 641.3, text: "NEAR SCHOOLS" }, { at: 643.0, text: "A SUPERMARKET" }]} />}
        <BigWord t={ta} a={644.6} b={646.75} text="NOT HUGE" size={230} />
        {cur?.k === "size" && <SizeVs t={ta} a={646.9} b={649.7} heightM={0.95} label="AROUND 300 LB" cut="sloth_8344d240" ar={346 / 236} x={980} />}
        <BigWord t={ta} a={649.9} b={651.95} text="IT STANDS UP" size={210} />
        <BigWord t={ta} a={652.1} b={654.2} text="HEAD AND FACE" red size={210} />
        <Place t={ta} a={654.5} b={657.5} text="Survivors" sub="Japan · India · Nepal" />
        <BigWord t={ta} a={657.8} b={660.2} text="TERRIBLE FACIAL INJURIES" size={140} />
        {cur?.k === "why" && <CaseCard t={ta} a={660.4} b={668.65} title="WHY NOW?" x={1060} y={150}
          rows={[{ at: 660.6, k: "COUNTRYSIDE", v: "fewer people" }, { at: 662.9, k: "FARMLAND", v: "abandoned" }, { at: 665.5, k: "ACORNS · BEECH NUTS", v: "bad years", red: true }]} />}
        <Place t={ta} a={668.9} b={673.5} text="Schools hand out bear bells" sub="northern Japan" />
        <BigWord t={ta} a={673.8} b={678.4} text="POLICE RIFLES" sub="against bears in residential areas" size={200} />
        <Place t={ta} a={678.7} b={681.5} text="One of the lowest crime rates" sub="in the world" />
        <BigWord t={ta} a={681.8} b={684.8} text="BEAR WARNINGS" sub="on its city streets" red size={190} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M11_FRAMES = Math.round((END11 - OFF11) * FPS);
