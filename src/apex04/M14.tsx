// apex04 · MINUTO 14 (812,51–877,89 s) — 2019: "lo mataron" sin pruebas; cuánto vive un cocodrilo; vivo o hundido en el barro; el río no cambió.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, Counter, CaseCard, SourceCard, LifeBar, Letterbox } from "./comps";

export const OFF14 = 812.51, END14 = 877.89;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 812.51, b: 815.4, img: F + "kivu_b4c9c724.jpg", k: "mag", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 815.4, b: 818.36, img: F + "city_af5c4601.jpg", k: "mag", cam: [1.16, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "flash" } },
  { a: 818.36, b: 820.6, img: F + "ruzizi_11f0dc3e.jpg", k: "claim", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 820.6, b: 823.0, v: R + "lake_9550276", from: 1.0, k: "claim", out: { type: "cut" } },
  { a: 823.0, b: 825.01, img: F + "ruzizi_4c096595.jpg", k: "claim", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 825.01, b: 828.03, v: T + "g43_old_delta", from: 1.0, k: "claim", out: { type: "flash" } },
  { a: 828.03, b: 830.4, v: R + "otros_10480740", from: 1.0, out: { type: "cut" } },
  { a: 830.4, b: 832.6, v: R + "otros_28812647", from: 1.0, grade: "brightness(1.3)", out: { type: "cut" } },
  { a: 832.6, b: 834.91, img: F + "ruzizi_6ff7413d.jpg", grade: "brightness(.8) saturate(.75)", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 834.91, b: 837.6, v: T + "g56_delta_sunrise", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 837.6, b: 840.22, img: F + "kivu_f2598573.jpg", k: "life", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 840.22, b: 842.6, img: F + "kivu_f18dd7f1.jpg", k: "life", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 842.6, b: 844.89, img: F + "lake_1f907db3.jpg", k: "life", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 844.89, b: 847.6, img: F + "lake_fa2722c4.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 847.6, b: 850.4, v: T + "g71_hidden_sandbank", from: 1.0, out: { type: "cut" } },
  { a: 850.4, b: 853.2, v: T + "g73_birds_croc", from: 1.0, out: { type: "cut" } },
  { a: 853.2, b: 856.2, img: F + "kivu_5ccb8668.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 856.2, b: 858.9, v: T + "g72_mud_under", from: 1.0, out: { type: "cut" } },
  { a: 858.9, b: 862.13, v: R + "storm_3986896", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 862.13, b: 864.82, img: F + "lake_d35a73f7.jpg", cam: [1.04, 0.5, 0.45, 1.16, 0.5, 0.45], out: { type: "cut" } },
  { a: 864.82, b: 867.3, v: T + "g63_tea_river", from: 1.0, out: { type: "cut" } },
  { a: 867.3, b: 869.7, img: F + "ruzizi_d35358d4.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 869.7, b: 872.25, v: T + "g64_reeds_wind", from: 1.0, out: { type: "cut" } },
  { a: 872.25, b: 874.6, v: T + "g65_dawn_walk", from: 1.0, out: { type: "cut" } },
  { a: 874.6, b: 877.89, v: T + "g46_dawn_villagers", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF14, b: s.b - OFF14 }));

export const M14: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF14;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "mag" && <SourceCard t={ta} a={812.7} b={818.3} kicker="A TRAVEL MAGAZINE · 2019" title="Gustave has been killed" sub="a short report" x={110} y={240} />}
        {cur?.k === "claim" && <CaseCard t={ta} a={818.5} b={827.95} title="THE 2019 CLAIM" x={1060} y={120}
          rows={[{ at: 818.8, k: "HOW", v: "—" }, { at: 819.6, k: "WHERE", v: "—" }, { at: 820.4, k: "BY WHOM", v: "—" },
            { at: 821.6, k: "PHOTO OF THE BODY", v: "none", red: true }, { at: 825.1, k: "SKULL", v: "none", red: true }, { at: 825.8, k: "SKIN", v: "none", red: true }, { at: 826.5, k: "MEASUREMENTS", v: "none", red: true }]} />}
        <Place t={ta} a={828.3} b={832.5} text="Years of cameras" sub="and steel cages" />
        <BigWord t={ta} a={832.7} b={834.85} text="A STRANGE ENDING" size={170} />
        <Stamp t={ta} a={835.4} b={837.5} text="UNPROVEN" sub="the 2019 claim" size={140} />
        {cur?.k === "life" && <LifeBar t={ta} a={837.8} b={844.8} max={100} range={[70, 100]} rangeAt={842.0} marks={[{ at: 840.4, v: 70, label: "LARGEST NILE CROCS ≈ 70" }]} />}
        <Counter t={ta} a={846.0} b={850.3} to={81} dur={1.2} digits={2} kicker="IF HE WAS 60 IN 2005 · TODAY" unit="YEARS OLD" center y={330} size={220} />
        <Place t={ta} a={850.6} b={856.1} text="Still alive?" sub="too big to be bothered by anything" />
        <BigWord t={ta} a={856.4} b={862.0} text="OR GONE" sub="sunk in the mud · never found" size={190} />
        <Place t={ta} a={862.3} b={864.7} text="1871" sub="Livingstone & Stanley on the Ruzizi" />
        <Place t={ta} a={865.0} b={869.6} text="The Ruzizi today" sub="still the color of strong tea" />
        <Place t={ta} a={872.5} b={877.8} text="Every morning" sub="because they still need the water" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M14_FRAMES = Math.round((END14 - OFF14) * FPS);
