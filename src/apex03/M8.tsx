// apex03 · MINUTO 8 (521,02–584,9 s) — la frontera se derrite: mínimo de verano −12 %/década desde fines de los 70, hielo que
// llega tarde y se va temprano, Hudson con semanas más sin hielo, las orcas entran (avistajes, rutas, collares satelitales), Arluk. OFF8.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, YearRoll } from "./comps";
import { CheckList, PolarIce } from "./compsA";
import { HudsonMap } from "./HudsonMap";
import { R, P, A } from "./M1";

export const OFF8 = 521.02;
const L = (x: number) => x - OFF8;
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 521.02, b: 522.96, v: A + "o47_ice_melt_drip", from: 1.0, out: { type: "flash" } },
  { a: 522.96, b: 525.25, comp: "ice", out: { type: "cut" } },
  { a: 525.25, b: 527.54, comp: "ice", out: { type: "cut" } },
  { a: 527.54, b: 529.83, comp: "ice", out: { type: "cut" } },
  { a: 529.83, b: 532.12, comp: "ice", out: { type: "cut" } },
  { a: 532.12, b: 534.34, v: A + "o27_ice_breakup", from: 1.0, out: { type: "cut" } },
  { a: 534.34, b: 536.56, v: A + "o27_ice_breakup", from: 3.22, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 536.56, b: 539.21, comp: "hb", out: { type: "cut" } },
  { a: 539.21, b: 541.85, comp: "hb", out: { type: "cut" } },
  { a: 541.85, b: 544.5, comp: "hb", out: { type: "flash" } },
  { a: 544.5, b: 546.83, v: A + "o30_orca_bay", from: 1.0, out: { type: "cut" } },
  { a: 546.83, b: 549.16, v: A + "o30_orca_bay", from: 3.33, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 549.16, b: 550.7, v: A + "o30_orca_bay", from: 6.0, rate: 0.7, grade: "brightness(.5)", k: "yr", out: { type: "cut" } },
  { a: 550.7, b: 552.24, v: A + "o30_orca_bay", from: 7.08, rate: 0.7, grade: "brightness(.5)", k: "yr", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 552.24, b: 554.39, comp: "route", out: { type: "cut" } },
  { a: 554.39, b: 556.55, comp: "route", out: { type: "cut" } },
  { a: 556.55, b: 558.7, comp: "route", out: { type: "cut" } },
  { a: 558.7, b: 561.1, v: A + "o31_tag", from: 1.0, out: { type: "cut" } },
  { a: 561.1, b: 563.5, v: A + "o31_tag", from: 3.4, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 563.5, b: 566.14, v: A + "o33_bowhead", from: 1.0, rate: 0.7, grade: "brightness(.5)", k: "menu", out: { type: "cut" } },
  { a: 566.14, b: 568.78, v: A + "o33_bowhead", from: 2.85, rate: 0.7, grade: "brightness(.5)", k: "menu", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 568.78, b: 570.63, v: A + "o52_hunters_boat", from: 1.0, out: { type: "cut" } },
  { a: 570.63, b: 572.48, v: A + "o52_hunters_boat", from: 2.85, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 572.48, b: 574.1, v: A + "o52_hunters_boat", from: 6.0, rate: 0.7, out: { type: "cut" } },
  { a: 574.1, b: 575.72, v: A + "o52_hunters_boat", from: 7.13, rate: 0.7, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 575.72, b: 577.54, v: R + "e01", from: 0.0, rate: 0.5, out: { type: "cut" } },
  { a: 577.54, b: 579.36, v: R + "e01", from: 0.91, rate: 0.5, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 579.36, b: 582.13, v: A + "o53_whale_remains", from: 1.0, rate: 0.9, out: { type: "cut" } },
  { a: 582.13, b: 584.9, v: A + "o53_whale_remains", from: 3.49, rate: 0.9, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const SHOTS8: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF8, b: s.b - OFF8 }));
export const M8_END = 584.9;
export const M8_FRAMES = Math.round((M8_END - OFF8) * FPS);

export const M8: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF8;
  const renderComp = (s: Shot) => {
    if (s.comp === "ice") return <PolarIce t={ta} a={522.96} b={532.12} y0={1979} y1={2024} from={0.3} to={0.21} dur={6.5}
      pins={[{ at: 524.0, x: 0.5, y: 0.47, label: "NORTH POLE" }]} zoom={[1.0, 1.3, 0.5, 0.55]} />;
    if (s.comp === "hb") return <HudsonMap t0={L(536.56)} keys={[
      { at: 0, pos: [0, 30, 22], look: [0, 0, 1], fov: 34 },
      { at: 7.9, pos: [2, 20, 14], look: [1, 0, 1], fov: 34 },
    ]} pins={[{ at: 0.5, lon: -86, lat: 59.5, label: "ICE-FREE SEASON", sub: "several weeks longer than a few decades ago", ring: true }]} />;
    if (s.comp === "route") return <HudsonMap t0={L(552.24)} keys={[
      { at: 0, pos: [4, 26, 20], look: [2, 0, 0], fov: 34 },
      { at: 6.5, pos: [0, 22, 16], look: [-1, 0, 1], fov: 34 },
    ]} pins={[{ at: 0.3, lon: -75.5, lat: 62.3, label: "HUDSON STRAIT" }]}
      routes={[{ at: 0.6, from: [-75.5, 62.3], to: [-82, 61.5], d: 1.6 }, { at: 1.8, from: [-82, 61.5], to: [-88, 59], d: 1.6 }, { at: 2.6, from: [-82, 61.5], to: [-86, 63.8], d: 1.4 }]} />;
    return null;
  };
  const cur = SHOTS8.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS8.map((s, i) => <ShotLayer key={i} S={SHOTS8} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={521.1} b={522.9} text="THAT BORDER IS MELTING" hot />
        {cur?.comp === "ice" && <Place t={ta} a={527.6} b={532.0} text="≈ −12 % PER DECADE" sub="satellite record since the late 1970s" />}
        <Place t={ta} a={532.4} b={536.4} text="FORMS LATER · BREAKS UP EARLIER" />
        <BigWord t={ta} a={541.9} b={544.4} text="THE ORCAS NOTICED" hot />
        <Place t={ta} a={544.8} b={549.0} text="KILLER WHALES IN HUDSON BAY" sub="rare for most of the last century" />
        {cur?.k === "yr" && <YearRoll t={ta} a={549.2} b={552.1} from={1950} to={2020} dur={2.2} label="SIGHTINGS · RISING SHARPLY" />}
        <Place t={ta} a={552.6} b={558.5} text="DEEP INTO THE BAY" sub="waters that used to be blocked by ice" />
        <Place t={ta} a={559.0} b={563.4} text="SATELLITE TAGS" sub="followed through the Canadian Arctic" />
        {cur?.k === "menu" && <CheckList t={ta} a={563.6} b={568.6} title="TAGGED ORCAS · HUNTING" x={1080} y={220} items={[
          { at: 563.8, text: "NARWHALS", ok: true }, { at: 564.4, text: "BELUGAS", ok: true }, { at: 565.0, text: "SEALS", ok: true }, { at: 566.0, text: "BOWHEAD WHALES", ok: true }]} />}
        <Place t={ta} a={569.1} b={572.3} text="INUIT HUNTERS" sub="reporting the same change for years" />
        <BigWord t={ta} a={573.2} b={575.6} text="ARLUK" sub="the killer whale · in Inuktitut" hot />
        <Place t={ta} a={576.0} b={579.2} text="ONCE RARE · NOW EVERY SUMMER" />
        <Place t={ta} a={579.7} b={584.7} text="KILLED · AND LEFT BEHIND" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
