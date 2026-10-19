// apex05 · MINUTO 6 (312,06–369,70 s) — #5 oso polar: el carnívoro terrestre más grande, nos ve como comida, ¿por qué sólo #5?, el estudio de 2017 (73 ataques, 20 muertos), machos flacos y con hambre, el hielo que se derrite.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, CaseCard, StrikeList, SourceCard, RankCard, SizeVs, Crowd, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF6 = 312.06, END6 = 369.7;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 312.06, b: 314.26, img: F + "polar_c93f8ae8.jpg", k: "rank", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "cut" } },
  { a: 314.26, b: 317.9, v: R + "polar_38079506", from: 2.0, k: "rank", out: { type: "cut" } },
  { a: 317.9, b: 320.2, v: T + "polar_fb830439", from: 0.0, out: { type: "cut" } },
  { a: 320.2, b: 322.2, img: F + "polar_4666a3c4.jpg", k: "size", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "cut" } },
  { a: 322.2, b: 324.0, img: F + "polar_7f5e76de.jpg", k: "size", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "flash" } },
  { a: 324.0, b: 326.6, v: T + "polar_09a4398e", from: 0.0, grade: "brightness(.75) saturate(.7)", out: { type: "cut" } },
  { a: 326.6, b: 329.46, v: R + "polar_36005535", from: 1.0, out: { type: "cut" } },
  { a: 329.46, b: 331.74, v: T + "polar_0b5548b2", from: 0.0, out: { type: "flash" } },
  { a: 331.74, b: 335.12, comp: "map", out: { type: "cut" } },
  { a: 335.12, b: 338.0, img: F + "polar_3893f637.jpg", k: "study", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 338.0, b: 340.4, v: R + "arctic_8318614", from: 1.0, k: "study", out: { type: "cut" } },
  { a: 340.4, b: 342.84, v: T + "polar_6e3b4f88", from: 0.0, k: "study", out: { type: "cut" } },
  { a: 342.84, b: 345.9, comp: "count", out: { type: "cut" } },
  { a: 345.9, b: 348.06, comp: "count2", out: { type: "cut" } },
  { a: 348.06, b: 349.98, v: R + "polar_6887991", from: 1.0, out: { type: "cut" } },
  { a: 349.98, b: 351.78, v: R + "polar_37116279", from: 1.0, out: { type: "cut" } },
  { a: 351.78, b: 354.4, img: F + "polar_16648103.jpg", k: "who", cam: [1.05, 0.3, 0.5, 1.25, 0.3, 0.5], out: { type: "cut" } },
  { a: 354.4, b: 357.04, v: T + "polar_b8ae9c76", from: 0.0, k: "who", out: { type: "cut" } },
  { a: 357.04, b: 359.38, v: T + "polar_740e002f", from: 0.0, k: "cubs", out: { type: "flash" } },
  { a: 359.38, b: 360.3, img: F + "polar_d0b0c6ef.jpg", cam: [1.2, 0.5, 0.5, 1.35, 0.5, 0.5], out: { type: "cut" } },
  { a: 360.3, b: 363.4, v: R + "arctic_8318408", from: 1.0, out: { type: "cut" } },
  { a: 363.4, b: 366.0, v: R + "polar_7441256", from: 1.0, out: { type: "cut" } },
  { a: 366.0, b: 369.7, v: T + "a17_polar_land", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF6, b: s.b - OFF6 }));
const L = (x: number) => x - OFF6;

export const M6: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF6;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="wd" t0={L(331.74)} ranges={[{ at: 0.2, color: "#8fd8ff", pts: [[-168, 70], [-140, 69], [-120, 71], [-95, 60], [-82, 56], [-70, 61], [-60, 67], [-45, 78], [-20, 77], [20, 77], [60, 76], [100, 76], [140, 73], [178, 70], [178, 78], [-168, 78]] }]} keys={[
      { at: 0, pos: [-6, 30, 14], look: [-9, 0, -8], fov: 34 },
      { at: 3.4, pos: [-12, 17, 2], look: [-13, 0, -10], fov: 34 },
    ]} pins={[{ at: 0.6, lon: -60, lat: 70, label: "THE ARCTIC", sub: "almost nobody lives here", ring: true }]} />;
    if (s.comp === "count") return <><Img src={staticFile(F + "polar_001570e5.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.5) contrast(1.1)" }} /><Crowd t={ta} a={342.9} b={345.95} n={73} cols={15} label="73 ATTACKS · 1870–2014" /></>;
    if (s.comp === "count2") return <><Img src={staticFile(F + "polar_01fc8eef.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.5) contrast(1.1)" }} /><Crowd t={ta} a={344.0} b={348.1} n={73} cols={15} keepAt={346.9} keep={20} label="73 ATTACKS · 1870–2014" keepLabel="20 KILLED" /></>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "rank" && <RankCard t={ta} a={312.2} b={317.85} n={5} name="POLAR BEAR" latin="Ursus maritimus" danger={6} note="the largest land carnivore on Earth" />}
        <Counter t={ta} a={318.0} b={320.1} to={1000} dur={1.0} digits={4} comma kicker="A BIG MALE · WELL OVER" unit="POUNDS" center y={330} size={220} />
        {cur?.k === "size" && <SizeVs t={ta} a={320.3} b={323.95} heightM={3.0} standAt={321.0} label="10 FT ON HIS HIND LEGS" x={980} />}
        <BigWord t={ta} a={324.2} b={329.4} text="JUST ANOTHER MEAL" sub="one of the few bears that sees a person this way" red size={170} />
        <BigWord t={ta} a={329.6} b={331.65} text="SO WHY ONLY #5?" size={180} />
        {cur?.k === "study" && <SourceCard t={ta} a={335.3} b={342.8} kicker="WILDER ET AL. · 2017" title="Every polar bear attack" sub="they could find · back to 1870" x={1060} y={260} />}
        <BigWord t={ta} a={348.2} b={349.9} text="A SMALL NUMBER" size={190} />
        <BigWord t={ta} a={350.1} b={351.7} text="BUT LOOK WHO" size={210} />
        {cur?.k === "who" && <CaseCard t={ta} a={351.9} b={356.95} title="THE MOST DANGEROUS" x={1060} y={150}
          rows={[{ at: 352.4, k: "AGE", v: "adult" }, { at: 353.0, k: "SEX", v: "male" }, { at: 354.6, k: "CONDITION", v: "thin · hungry", red: true }]} />}
        {cur?.k === "cubs" && <StrikeList t={ta} b={359.3} y={330} size={110} items={[{ at: 357.1, text: "DEFENDING CUBS", strike: 358.3 }]} />}
        <BigWord t={ta} a={359.4} b={360.25} text="HUNTING" red size={260} />
        <BigWord t={ta} a={360.5} b={363.3} text="IT COULD GET WORSE" size={170} />
        <Place t={ta} a={363.6} b={365.9} text="The sea ice melts earlier" sub="in the year" />
        <BigWord t={ta} a={366.2} b={369.6} text="ONTO LAND" sub="where the people are" size={210} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M6_FRAMES = Math.round((END6 - OFF6) * FPS);
