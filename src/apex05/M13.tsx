// apex05 · MINUTO 13 (755,71–817,27 s) — las cifras: Karnataka 300 en 5 años; MP+Chhattisgarh 735 / 48 muertos; 8 estudios 1.700+; NatGeo "el más mortífero"; el oso de Mysore (años 50, Kenneth Anderson); cómo pasa: agacharse o doblar en el sendero → se para, carga, a la cara.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, CaseCard, SourceCard, Crowd, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF13 = 755.71, END13 = 817.27;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 755.71, b: 757.51, img: F + "sloth_d308ca60.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "flash" } },
  { a: 757.51, b: 761.2, comp: "map1", out: { type: "cut" } },
  { a: 761.2, b: 764.71, v: R + "sloth_35364740", from: 3.0, out: { type: "cut" } },
  { a: 764.71, b: 768.0, comp: "map2", out: { type: "cut" } },
  { a: 768.0, b: 771.3, comp: "c1", out: { type: "cut" } },
  { a: 771.3, b: 774.75, comp: "c2", out: { type: "cut" } },
  { a: 774.75, b: 777.3, v: T + "sloth_0f88bd7a", from: 0.0, out: { type: "cut" } },
  { a: 777.3, b: 779.89, v: T + "sloth_2194e37c", from: 0.0, out: { type: "cut" } },
  { a: 779.89, b: 781.43, img: F + "sloth_a01f6ca4.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "flash" } },
  { a: 781.43, b: 784.77, img: F + "sloth_24746c20.jpg", k: "ng", cam: [1.0, 0.3, 0.5, 1.1, 0.3, 0.5], out: { type: "cut" } },
  { a: 784.77, b: 787.3, v: T + "sloth_2afa9092", from: 0.0, k: "ng", out: { type: "cut" } },
  { a: 787.3, b: 789.93, v: T + "a39_sloth_dusk_walk", from: 1.0, k: "ng", out: { type: "dissolve", d: 0.4 } },
  { a: 789.93, b: 793.11, v: T + "a50_1950s_village", from: 1.0, out: { type: "cut" } },
  { a: 793.11, b: 795.6, img: F + "mysore_9ad679f1.jpg", grade: "sepia(.4) contrast(1.05)", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 795.6, b: 798.0, img: F + "mysore_6c85c15e.jpg", k: "mys", grade: "sepia(.4)", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 798.0, b: 800.4, v: R + "india_11700830", from: 1.0, k: "mys", grade: "sepia(.55) contrast(1.05)", out: { type: "cut" } },
  { a: 800.4, b: 803.89, v: T + "a49_1950s_hunter", from: 1.0, k: "mys", out: { type: "flash" } },
  { a: 803.89, b: 807.33, img: F + "sloth_8305b65f.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 807.33, b: 810.4, v: T + "a44_leaves_bend", from: 1.0, out: { type: "cut" } },
  { a: 810.4, b: 813.35, v: R + "india_4441037", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 813.35, b: 814.35, img: F + "sloth_1f6ddab6.jpg", cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 814.35, b: 815.35, img: F + "sloth_f43f805f.jpg", cam: [1.2, 0.5, 0.6, 1.5, 0.5, 0.6], out: { type: "cut" } },
  { a: 815.35, b: 817.27, img: F + "sloth_20f02bd7.jpg", cam: [1.1, 0.6, 0.5, 1.35, 0.65, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF13, b: s.b - OFF13 }));
const L = (x: number) => x - OFF13;

export const M13: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF13;
  const renderComp = (s: Shot) => {
    if (s.comp === "map1") return <GeoMap m="in" t0={L(757.51)} keys={[
      { at: 0, pos: [0, 70, 55], look: [0, 0, 0], fov: 34 },
      { at: 3.7, pos: [-6, 34, 34], look: [-7, 0, 9], fov: 34 },
    ]} pins={[{ at: 0.8, lon: 76, lat: 15, label: "KARNATAKA", sub: "one state", ring: true }]} />;
    if (s.comp === "map2") return <GeoMap m="in" t0={L(764.71)} keys={[
      { at: 0, pos: [-6, 34, 34], look: [-7, 0, 9], fov: 34 },
      { at: 3.3, pos: [3, 34, 22], look: [3, 0, -8], fov: 34 },
    ]} pins={[{ at: 1.2, lon: 78, lat: 23.5, label: "MADHYA PRADESH", ring: false }, { at: 1.9, lon: 82, lat: 21.3, label: "CHHATTISGARH", ring: false }]} />;
    if (s.comp === "c1") return <><Img src={staticFile(F + "sloth_2d61137d.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.5) contrast(1.1)" }} /><Crowd t={ta} a={768.0} b={771.35} n={735} cols={49} label="735 INJURED OR KILLED · 5 YEARS" /></>;
    if (s.comp === "c2") return <><Img src={staticFile(F + "sloth_479d8181.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.5) contrast(1.1)" }} /><Crowd t={ta} a={769.5} b={774.8} n={735} cols={49} keepAt={772.4} keep={48} label="735 INJURED OR KILLED · 5 YEARS" keepLabel="48 DIED" /></>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={755.8} b={757.45} text="THE NUMBERS" size={220} />
        <Counter t={ta} a={761.3} b={764.65} to={300} dur={1.2} digits={3} kicker="KARNATAKA · 5 YEARS" unit="SLOTH BEAR ATTACKS" red center y={330} size={220} />
        <Place t={ta} a={764.9} b={767.9} text="Two states" sub="central India" />
        <Counter t={ta} a={774.9} b={779.85} to={1700} dur={1.4} digits={4} comma kicker="8 STUDIES · MORE THAN" unit="ATTACKS" red center y={330} size={220} />
        {cur?.k === "ng" && <SourceCard t={ta} a={781.6} b={789.85} kicker="NATIONAL GEOGRAPHIC" title="The world's deadliest bear" sub="more than a dozen killed every year" x={1060} y={260} />}
        <BigWord t={ta} a={790.1} b={793.0} text="THE MOST FAMOUS CASE" size={170} />
        <Place t={ta} a={793.3} b={795.5} text="Mysore · 1950s" sub="southern India" />
        {cur?.k === "mys" && <CaseCard t={ta} a={795.7} b={803.8} title="THE MYSORE BEAR" x={1060} y={150}
          rows={[{ at: 796.4, k: "KILLED", v: "around a dozen", red: true }, { at: 798.2, k: "MAULED", v: "many more" }, { at: 801.0, k: "THE END", v: "shot by Kenneth Anderson" }]} />}
        <BigWord t={ta} a={804.1} b={807.25} text="ALWAYS THE SAME WAY" size={170} />
        <Place t={ta} a={807.5} b={810.3} text="A person bends down" sub="to pick something up" />
        <Place t={ta} a={810.6} b={813.25} text="Or turns a corner" sub="and the bear is right there" />
        <BigWord t={ta} a={813.45} b={814.3} text="IT STANDS" size={240} />
        <BigWord t={ta} a={814.4} b={815.3} text="IT CHARGES" size={240} />
        <BigWord t={ta} a={815.4} b={817.2} text="THE FACE" red size={260} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M13_FRAMES = Math.round((END13 - OFF13) * FPS);
