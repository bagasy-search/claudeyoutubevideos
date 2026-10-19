// apex04 · MINUTO 6 (307,58–368,43 s) — los que no vuelven, el registro desde 1987, el gigante con la cicatriz, entra Patrice Faye.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { GeoMap } from "./GeoMap";
import { BigWord, Place, Mark, CaseCard, Letterbox } from "./comps";

export const OFF6 = 307.58, END6 = 368.43;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 307.58, b: 310.52, v: R + "river_28750873", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 310.52, b: 313.0, v: T + "g20_empty_canoe", from: 1.0, out: { type: "cut" } },
  { a: 313.0, b: 315.43, img: F + "ruzizi_fa1be931.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.55], out: { type: "sweep", d: 0.55 } },
  { a: 315.43, b: 318.8, comp: "bu3", out: { type: "cut" } },
  { a: 318.8, b: 322.11, comp: "bu3", out: { type: "whip", vx: 1 } },
  { a: 322.11, b: 324.6, img: F + "lake_e29a21d6.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.55, 0.6], out: { type: "cut" } },
  { a: 324.6, b: 326.7, img: F + "lake_4f912e15.jpg", cam: [1.18, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "cut" } },
  { a: 326.7, b: 328.79, img: F + "croc_23e07292.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "flash" } },
  { a: 328.79, b: 330.29, img: F + "croc_2708db2e.jpg", cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 330.29, b: 331.55, v: T + "g02_bank", from: 1.0, out: { type: "cut" } },
  { a: 331.55, b: 335.08, v: T + "g25_scale_boat", from: 1.0, out: { type: "cut" } },
  { a: 335.08, b: 337.11, v: T + "g01_surface", from: 4.0, k: "scar", out: { type: "flash" } },
  { a: 337.11, b: 340.05, v: T + "g18_binoculars", from: 1.0, out: { type: "cut" } },
  { a: 340.05, b: 342.4, img: F + "city_0f1cd991.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.45], out: { type: "cut" } },
  { a: 342.4, b: 344.6, img: F + "city_af5720bd.jpg", cam: [1.18, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "cut" } },
  { a: 344.6, b: 347.88, img: F + "croc_47c9ac61.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.35, 0.5], out: { type: "whip", vx: -1 } },
  { a: 347.88, b: 351.0, v: R + "lake_4652497", from: 1.0, k: "notes", out: { type: "cut" } },
  { a: 351.0, b: 354.4, v: R + "lake_4159893", from: 1.0, k: "notes", out: { type: "cut" } },
  { a: 354.4, b: 355.99, v: T + "g19_naturalist_fishermen", from: 1.0, out: { type: "cut" } },
  { a: 355.99, b: 357.49, img: F + "ruzizi_f321e42d.jpg", cam: [1.05, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 357.49, b: 360.46, v: R + "otros_4231686", from: 1.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 360.46, b: 364.08, v: R + "lake_7357610", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "flash" } },
  { a: 364.08, b: 365.2, img: F + "croc_d59b53ac.jpg", cam: [1.3, 0.75, 0.5, 1.15, 0.7, 0.5], out: { type: "cut" } },
  { a: 365.2, b: 368.43, v: R + "croc_33322227", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF6, b: s.b - OFF6 }));
const L = (x: number) => x - OFF6;

export const M6: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF6;
  const renderComp = (s: Shot) => {
    if (s.comp === "bu3") return <GeoMap m="bu" t0={L(315.43)} keys={[
      { at: 0, pos: [-2, 40, 34], look: [-3, 0, 2], fov: 34 },
      { at: 6.7, pos: [-4, 16, 16], look: [-5, 0, 5], fov: 34 },
    ]} pins={[
      { at: 0.5, out: 1.5, lon: 29.36, lat: -3.38, label: "BUJUMBURA", ring: false },
      { at: 1.6, lon: 29.3, lat: -3.36, label: "NORTHEAST SHORE", sub: "attack records since 1987", ring: true },
    ]} ranges={[{ at: 2.0, d: 1.6, color: "#ff5a3c", pts: [[29.24, -3.3], [29.42, -3.31], [29.4, -3.5], [29.34, -3.68], [29.26, -3.7], [29.28, -3.5]] }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={310.8} b={315.3} text="NEVER CAME BACK" size={170} />
        <Place t={ta} a={322.3} b={328.6} text="Survivors · witnesses" sub="describing the same animal" />
        <BigWord t={ta} a={330.35} b={331.5} text="A GIANT" red size={240} />
        <Place t={ta} a={331.8} b={334.9} text="Much bigger than the others" sub="in the river" />
        {cur?.k === "scar" && <Mark t={ta} a={335.2} b={337.05} x={960} y={420} r={90} n="!" label="THE SAME SCAR" />}
        <Place t={ta} a={337.3} b={339.95} text="Patrice Faye" sub="French naturalist · living in Burundi" />
        <Place t={ta} a={344.8} b={347.7} text="Self-taught" sub="obsessed with reptiles" />
        {cur?.k === "notes" && <CaseCard t={ta} a={348.0} b={354.3} title="REPORTS · LATE 1990s" x={1060} y={150}
          rows={[{ at: 348.6, k: "SOURCE", v: "fishermen, villagers" }, { at: 349.6, k: "WHERE", v: "delta · lakeshore" }, { at: 350.8, k: "SUBJECT", v: "one giant crocodile", red: true }]} />}
        <BigWord t={ta} a={364.15} b={365.15} text="GUSTAVE" red size={240} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M6_FRAMES = Math.round((END6 - OFF6) * FPS);
