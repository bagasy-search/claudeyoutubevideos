// apex05 · MINUTO 5 (244,36–312,06 s) — #6 oso malayo: el más chico, Sudeste Asiático, la lengua y las garras, tímido pero pelea si lo sorprenden, su problema somos nosotros, qué hacer → "ahora la lista cambia".
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, CaseCard, StrikeList, RankCard, SizeVs, BearLineup, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF5 = 244.36, END5 = 312.06;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 244.36, b: 247.0, v: T + "sun_8b2dc338", from: 0.0, k: "rank", out: { type: "cut" } },
  { a: 247.0, b: 249.32, img: F + "sun_4cfdfb32.jpg", k: "size", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "cut" } },
  { a: 249.32, b: 252.8, v: R + "sun_35012840", from: 1.0, k: "size", out: { type: "cut" } },
  { a: 252.8, b: 255.2, v: R + "sun_30575008", from: 1.0, out: { type: "cut" } },
  { a: 255.2, b: 257.6, comp: "map", out: { type: "cut" } },
  { a: 257.6, b: 260.0, v: T + "a62_sun_bear_face", from: 1.0, out: { type: "cut" } },
  { a: 260.0, b: 262.24, v: T + "sun_c30a6d5d", from: 0.0, out: { type: "flash" } },
  { a: 262.24, b: 265.0, v: T + "a27_sun_tongue", from: 1.0, out: { type: "cut" } },
  { a: 265.0, b: 268.14, v: R + "honey_13556697", from: 1.0, out: { type: "cut" } },
  { a: 268.14, b: 270.3, img: F + "sun_7602595e.jpg", cam: [1.05, 0.4, 0.5, 1.25, 0.4, 0.5], out: { type: "cut" } },
  { a: 270.3, b: 272.3, v: T + "a63_sun_bear_claws", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 272.3, b: 274.6, img: F + "sun_bbd45bf3.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 274.6, b: 276.86, v: R + "sun_35012841", from: 1.0, out: { type: "cut" } },
  { a: 276.86, b: 279.2, v: R + "sun_36657234", from: 1.0, grade: "brightness(.8)", out: { type: "cut" } },
  { a: 279.2, b: 281.64, img: F + "sun_d68c8899.jpg", cam: [1.05, 0.6, 0.5, 1.3, 0.65, 0.45], out: { type: "flash" } },
  { a: 281.64, b: 284.0, v: T + "a64_sun_bear_stand", from: 1.0, out: { type: "cut" } },
  { a: 284.0, b: 286.38, v: T + "sun_b51d3112", from: 0.0, out: { type: "white", d: 0.3 } },
  { a: 286.38, b: 288.72, v: R + "sun_32640541", from: 1.0, out: { type: "cut" } },
  { a: 288.72, b: 291.2, v: T + "sun_459602fb", from: 0.0, out: { type: "cut" } },
  { a: 291.2, b: 293.6, v: T + "a28_logging", from: 1.0, k: "threat", out: { type: "cut" } },
  { a: 293.6, b: 295.92, v: R + "sun_26999568", from: 1.0, k: "threat", out: { type: "cut" } },
  { a: 295.92, b: 298.2, v: R + "sun_35771035", from: 1.0, k: "rules", out: { type: "cut" } },
  { a: 298.2, b: 300.42, v: T + "sun_552135f5", from: 0.0, k: "rules", out: { type: "cut" } },
  { a: 300.42, b: 303.4, img: F + "sun_c853e742.jpg", k: "rules", cam: [1.04, 0.6, 0.5, 1.16, 0.65, 0.5], out: { type: "cut" } },
  { a: 303.4, b: 305.4, v: R + "sun_30770305", from: 1.0, out: { type: "cut" } },
  { a: 305.4, b: 307.22, img: F + "sun_3418b924.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "flash" } },
  { a: 307.22, b: 310.0, comp: "change", out: { type: "cut" } },
  { a: 310.0, b: 312.06, v: R + "brown_7427471", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.45] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF5, b: s.b - OFF5 }));
const L = (x: number) => x - OFF5;

export const M5: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF5;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="wd" t0={L(255.2)} ranges={[{ at: 0.2, color: "#ffcf5a", pts: [[92, 24], [98, 22], [104, 20], [108, 12], [110, 2], [118, 5], [117, -3], [110, -3], [105, -6], [100, 1], [98, 8], [95, 16]] }]} keys={[
      { at: 0, pos: [18, 26, 24], look: [20, 0, 0], fov: 34 },
      { at: 2.4, pos: [21, 15, 13], look: [21, 0, 1.5], fov: 34 },
    ]} pins={[{ at: 0.4, lon: 110, lat: 2, label: "SOUTHEAST ASIA", sub: "tropical forests", ring: true }]} />;
    if (s.comp === "change") return <>
      <Img src={staticFile(F + "sloth_ddc5c6ee.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)", transform: `scale(${1.08 + 0.03 * (ta - 307.22)})` }} />
      <BearLineup t={ta} a={307.22} b={310.05} showRank set={[5, 4, 3, 2, 1]} setAt={308.2} title="NOW THE LIST CHANGES" />
    </>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "rank" && <RankCard t={ta} a={244.5} b={246.95} n={6} name="SUN BEAR" latin="Helarctos malayanus" danger={2} />}
        {cur?.k === "size" && <SizeVs t={ta} a={247.1} b={252.75} heightM={0.75} label="AS LITTLE AS 60 LB" cut="sun_459602fb" ar={266 / 272} />}
        <Place t={ta} a={253.0} b={255.1} text="The smallest bear" sub="in the world" />
        <Place t={ta} a={257.8} b={262.15} text="A golden patch" sub="like the rising sun" />
        <BigWord t={ta} a={262.4} b={264.9} text="A 10-INCH TONGUE" size={170} />
        <Place t={ta} a={265.2} b={268.0} text="Honey and insects" sub="licked out of tree trunks" />
        <Place t={ta} a={268.3} b={272.2} text="Long, curved claws" sub="made for tearing open wood" />
        <BigWord t={ta} a={272.5} b={274.5} text="SHY" size={260} />
        <Place t={ta} a={274.8} b={276.8} text="Rarely involved" sub="in attacks on humans" />
        <Place t={ta} a={277.0} b={279.1} text="Surprised at close range" sub="" />
        <BigWord t={ta} a={279.4} b={281.55} text="IT DOESN'T ALWAYS RUN" size={150} />
        <BigWord t={ta} a={281.8} b={286.3} text="IT FIGHTS" sub="and those claws do serious damage" red size={220} />
        <BigWord t={ta} a={286.5} b={288.65} text="STILL RARE" size={210} />
        <BigWord t={ta} a={288.9} b={291.1} text="ITS REAL PROBLEM" sub="is us" size={170} />
        {cur?.k === "threat" && <CaseCard t={ta} a={291.3} b={295.85} title="SUN BEAR · THREATS" x={1060} y={150}
          rows={[{ at: 291.6, k: "FOREST", v: "being cleared" }, { at: 293.4, k: "BODY PARTS", v: "illegal markets", red: true }, { at: 294.4, k: "STATUS", v: "vulnerable" }]} />}
        {cur?.k === "rules" && <StrikeList t={ta} b={303.35} y={280} size={92} items={[{ at: 296.6, text: "DON'T CORNER IT" }, { at: 298.3, text: "DON'T RUN PAST IT" }, { at: 300.6, text: "BACK AWAY SLOWLY" }, { at: 301.9, text: "LEAVE IT A WAY OUT" }]} />}
        <BigWord t={ta} a={303.6} b={307.15} text="IT ESCAPES" sub="almost always" size={210} />
        <BigWord t={ta} a={310.1} b={312.0} text="ALL FIVE HAVE KILLED" sub="the next five bears" red size={160} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M5_FRAMES = Math.round((END5 - OFF5) * FPS);
