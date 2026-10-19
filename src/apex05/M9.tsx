// apex05 · MINUTO 9 (498,23–563,51 s) — #3 oso pardo: el que todos creen #1, grizzly/Kodiak/Europa/Rusia, +1.000 lb, el estudio mundial de 2019 (664 ataques), sorpresa y madre con crías, la mitad en ocio, alce y joroba, depende de por qué ataca.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, CaseCard, StrikeList, SourceCard, Fraction, RankCard, SizeVs, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF9 = 498.23, END9 = 563.51;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 498.23, b: 501.0, v: T + "brown_2d1defc4", from: 0.0, k: "rank", out: { type: "cut" } },
  { a: 501.0, b: 503.85, v: R + "brown_7257789", from: 1.0, out: { type: "cut" } },
  { a: 503.85, b: 507.4, comp: "map1", out: { type: "cut" } },
  { a: 507.4, b: 509.2, v: T + "brown_10e2bbd5", from: 0.0, out: { type: "cut" } },
  { a: 509.2, b: 511.03, v: R + "brown_15387783", from: 1.0, out: { type: "cut" } },
  { a: 511.03, b: 513.2, img: F + "brown_cefb0f8d.jpg", k: "kg", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "cut" } },
  { a: 513.2, b: 515.03, img: F + "brown_cf754b45.jpg", k: "kg", cam: [1.0, 0.3, 0.5, 1.08, 0.3, 0.5], out: { type: "cut" } },
  { a: 515.03, b: 517.6, v: T + "brown_4a0570e4", from: 0.0, k: "study", out: { type: "cut" } },
  { a: 517.6, b: 520.51, v: R + "brown_12110249", from: 1.0, k: "study", out: { type: "flash" } },
  { a: 520.51, b: 524.4, comp: "map2", out: { type: "cut" } },
  { a: 524.4, b: 527.0, v: R + "brown_12121942", from: 1.0, out: { type: "cut" } },
  { a: 527.0, b: 529.21, v: R + "brown_31875200", from: 4.0, out: { type: "cut" } },
  { a: 529.21, b: 532.31, v: R + "brown_30824650", from: 2.0, out: { type: "white", d: 0.3 } },
  { a: 532.31, b: 536.11, v: T + "a26_hikers", from: 1.0, k: "scen", out: { type: "cut" } },
  { a: 536.11, b: 537.53, img: F + "brown_09b59c14.jpg", cam: [1.1, 0.5, 0.4, 1.3, 0.5, 0.35], out: { type: "flash" } },
  { a: 537.53, b: 540.0, v: T + "brown_a0a9f497", from: 0.0, k: "mom", out: { type: "cut" } },
  { a: 540.0, b: 542.51, v: T + "brown_7962c357", from: 0.0, k: "mom", out: { type: "cut" } },
  { a: 542.51, b: 544.6, v: R + "leis_4071294", from: 1.0, k: "half", out: { type: "cut" } },
  { a: 544.6, b: 546.8, v: R + "leis_6133554", from: 1.0, k: "leis", out: { type: "cut" } },
  { a: 546.8, b: 549.13, v: R + "leis_18682956", from: 1.0, k: "leis", out: { type: "white", d: 0.3 } },
  { a: 549.13, b: 552.29, v: T + "a25_grizzly_moose", from: 1.0, out: { type: "cut" } },
  { a: 552.29, b: 555.41, v: T + "a24_grizzly_dig", from: 1.0, out: { type: "cut" } },
  { a: 555.41, b: 557.4, v: R + "black_855582", from: 1.0, out: { type: "cut" } },
  { a: 557.4, b: 559.09, v: R + "brown_13218152", from: 1.0, out: { type: "flash" } },
  { a: 559.09, b: 561.3, v: R + "brown_28490942", from: 6.0, out: { type: "cut" } },
  { a: 561.3, b: 563.51, v: R + "brown_11035304", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF9, b: s.b - OFF9 }));
const L = (x: number) => x - OFF9;

export const M9: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF9;
  const renderComp = (s: Shot) => {
    if (s.comp === "map1") return <GeoMap m="wd" t0={L(503.85)} ranges={[{ at: 0.1, color: "#e0965a", pts: [[-168, 66], [-140, 70], [-110, 68], [-100, 62], [-105, 50], [-112, 44], [-120, 48], [-130, 55], [-150, 58], [-165, 60]] }, { at: 1.9, color: "#e0965a", pts: [[20, 70], [60, 70], [100, 72], [140, 70], [170, 66], [160, 58], [140, 50], [130, 45], [110, 48], [90, 50], [70, 52], [50, 55], [30, 58], [15, 60]] }]} keys={[
      { at: 0, pos: [-6, 40, 24], look: [-6, 0, -4], fov: 34 },
      { at: 3.6, pos: [0, 34, 18], look: [0, 0, -6], fov: 34 },
    ]} pins={[{ at: 0.2, lon: -115, lat: 52, label: "GRIZZLY", ring: false }, { at: 0.9, lon: -153, lat: 57.5, label: "KODIAK", ring: false },
      { at: 1.8, lon: 24, lat: 62, label: "EUROPE", ring: false }, { at: 2.6, lon: 100, lat: 60, label: "RUSSIA", ring: false }]} />;
    if (s.comp === "map2") return <GeoMap m="wd" t0={L(520.51)} keys={[
      { at: 0, pos: [0, 34, 18], look: [0, 0, -6], fov: 34 },
      { at: 3.9, pos: [-2, 40, 22], look: [-2, 0, -5], fov: 34 },
    ]} pins={[{ at: 2.0, lon: 18, lat: 50, label: "EUROPE", ring: true }, { at: 2.6, lon: -110, lat: 50, label: "NORTH AMERICA", ring: true }, { at: 3.2, lon: 95, lat: 45, label: "ASIA", ring: true }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "rank" && <RankCard t={ta} a={498.4} b={500.95} n={3} name="BROWN BEAR" latin="Ursus arctos" danger={8} />}
        <BigWord t={ta} a={501.2} b={503.8} text="EVERYONE'S #1" sub="or so they think" size={200} />
        <Place t={ta} a={507.6} b={509.1} text="Kodiak · Alaska" sub="the giants" />
        <Place t={ta} a={509.4} b={510.95} text="Europe · Russia" sub="" />
        {cur?.k === "kg" && <SizeVs t={ta} a={511.1} b={514.95} heightM={2.7} standAt={511.9} label="OVER 1,000 LB" x={980} />}
        {cur?.k === "study" && <SourceCard t={ta} a={515.2} b={520.45} kicker="BOMBIERI ET AL. · 2019" title="The first worldwide study" sub="of brown bear attacks" x={1060} y={260} />}
        {t >= L(520.51) && t < L(524.4) && <Counter t={ta} a={520.6} b={524.35} to={664} dur={1.4} digits={3} kicker="2000–2015" unit="ATTACKS ON PEOPLE" red center y={250} size={200} />}
        <Place t={ta} a={524.6} b={529.1} text="Europe · North America · Asia" sub="" />
        <BigWord t={ta} a={529.4} b={532.2} text="AND RISING" sub="over time" red size={210} />
        {cur?.k === "scen" && <StrikeList t={ta} b={536.05} y={300} size={86} items={[{ at: 532.4, text: "A HUNGRY BEAR", strike: 534.6 }, { at: 533.4, text: "HUNTING A HIKER", strike: 534.9 }]} />}
        <BigWord t={ta} a={536.2} b={537.45} text="SURPRISE" red size={250} />
        {cur?.k === "mom" && <CaseCard t={ta} a={537.7} b={542.45} title="MOST COMMON SCENARIO" x={1060} y={150}
          rows={[{ at: 538.0, k: "WHO", v: "a mother with cubs" }, { at: 539.6, k: "DISTANCE", v: "close range" }, { at: 541.0, k: "WHY", v: "defending her family", red: true }]} />}
        {cur?.k === "half" && <Fraction t={ta} a={542.6} b={544.55} n={10} red={5} label="ABOUT HALF · OUT FOR LEISURE" />}
        {cur?.k === "leis" && <StrikeList t={ta} b={549.05} y={300} size={100} items={[{ at: 545.5, text: "HIKING" }, { at: 546.5, text: "PICKING MUSHROOMS" }, { at: 547.9, text: "WALKING A DOG" }]} />}
        <BigWord t={ta} a={549.3} b={552.2} text="IT CAN KILL A MOOSE" size={170} />
        <Place t={ta} a={552.5} b={555.3} text="The shoulder hump" sub="pure muscle · built for digging" />
        <BigWord t={ta} a={555.6} b={559.0} text="DEVASTATING" red size={220} />
        <BigWord t={ta} a={559.3} b={563.4} text="IT DEPENDS ON WHY" sub="the right reaction" size={170} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M9_FRAMES = Math.round((END9 - OFF9) * FPS);
