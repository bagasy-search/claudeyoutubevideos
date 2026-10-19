// apex03 · MINUTO 1 (0–53,14 s) — el tráiler: bahía de Hudson sin hielo, el oso nadando lejos de la costa, las aletas que
// aparecen detrás (una, otra, otra), los dos reyes cara a cara y la pregunta; la respuesta empieza por el hielo.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox } from "./comps";
import { CaseFile, TaleTape } from "./compsA";
import { HudsonMap } from "./HudsonMap";

export const R = "apex03/real/", P = "apex03/px/r", A = "apex03/t2v/";
type S2 = Shot & { k?: string };
export const SHOTS1: S2[] = [
  { a: 0.0, b: 1.57, comp: "hb", out: { type: "cut" } },
  { a: 1.57, b: 3.14, comp: "hb", out: { type: "flash" } },
  { a: 3.14, b: 4.78, v: P + "36278975", from: 2.0, out: { type: "dissolve", d: 0.35 } },
  { a: 4.78, b: 6.19, v: A + "o01_bear_swim", from: 0.5, out: { type: "cut" } },
  { a: 6.19, b: 7.6, v: A + "o01_bear_swim", from: 1.91, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 7.6, b: 8.98, v: A + "o45_bear_head_water", from: 1.0, out: { type: "cut" } },
  { a: 8.98, b: 10.36, v: A + "o45_bear_head_water", from: 2.38, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 10.36, b: 11.78, v: A + "o45_bear_head_water", from: 6.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 11.78, b: 13.2, v: A + "o45_bear_head_water", from: 7.42, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 13.2, b: 14.6, v: A + "o03_under_bear", from: 1.0, out: { type: "cut" } },
  { a: 14.6, b: 16.0, v: A + "o03_under_bear", from: 2.4, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 16.0, b: 17.75, v: P + "20601591", from: 2.0, grade: "brightness(.45) saturate(.8)", cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.6], out: { type: "cut" } },
  { a: 17.75, b: 19.5, v: P + "20601591", from: 3.75, grade: "brightness(.45) saturate(.8)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 19.5, b: 20.87, v: A + "o02_fins_behind", from: 0.5, out: { type: "cut" } },
  { a: 20.87, b: 22.25, v: A + "o02_fins_behind", from: 1.87, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 22.25, b: 23.62, v: A + "o02_fins_behind", from: 3.25, out: { type: "cut" } },
  { a: 23.62, b: 25.06, v: A + "o46_fins_closer", from: 1.0, out: { type: "cut" } },
  { a: 25.06, b: 26.34, v: P + "5607993", from: 2.0, out: { type: "flash" } },
  { a: 26.34, b: 27.87, v: A + "o01_bear_swim", from: 6.0, grade: "brightness(.6)", k: "tape", out: { type: "cut" } },
  { a: 27.87, b: 29.4, v: A + "o01_bear_swim", from: 7.53, grade: "brightness(.6)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 29.4, b: 30.82, v: A + "o15_orca_under", from: 1.0, grade: "brightness(.6)", k: "tape", out: { type: "cut" } },
  { a: 30.82, b: 32.24, v: A + "o15_orca_under", from: 2.42, grade: "brightness(.6)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 32.24, b: 33.99, v: A + "o26_bear_on_ice", from: 1.0, grade: "brightness(.6)", k: "tape", out: { type: "cut" } },
  { a: 33.99, b: 35.74, v: A + "o26_bear_on_ice", from: 2.75, grade: "brightness(.6)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 35.74, b: 37.17, v: R + "e01", from: 19.0, rate: 0.7, grade: "brightness(.6)", k: "tape", out: { type: "cut" } },
  { a: 37.17, b: 38.6, v: R + "e01", from: 20.0, rate: 0.7, grade: "brightness(.6)", k: "tape", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 38.6, b: 39.88, v: A + "o43_bear_vs_orca_edge", from: 1.0, out: { type: "cut" } },
  { a: 39.88, b: 41.16, v: A + "o43_bear_vs_orca_edge", from: 2.28, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 41.16, b: 42.46, v: A + "o43_bear_vs_orca_edge", from: 6.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 42.46, b: 43.76, v: A + "o43_bear_vs_orca_edge", from: 7.3, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 43.76, b: 45.48, v: P + "8318615", from: 2.0, out: { type: "cut" } },
  { a: 45.48, b: 47.2, v: P + "8318615", from: 3.72, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 47.2, b: 48.53, v: P + "8016862", from: 2.0, grade: "brightness(.6)", k: "file", out: { type: "cut" } },
  { a: 48.53, b: 49.85, v: P + "8016862", from: 3.33, grade: "brightness(.6)", k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 49.85, b: 51.18, v: P + "8016862", from: 4.65, grade: "brightness(.6)", k: "file", out: { type: "cut" } },
  { a: 51.18, b: 52.16, v: P + "7441313", from: 2.0, k: "file", cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 52.16, b: 53.14, v: P + "7441313", from: 2.98, k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const M1_END = 53.14;

export const M1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const renderComp = (s: Shot) => {
    if (s.comp === "hb") return <HudsonMap t0={0} keys={[
      { at: 0, pos: [0, 34, 26], look: [0, 0, 1], fov: 34 },
      { at: 3.2, pos: [-4, 18, 14], look: [-4, 0, 2], fov: 34 },
    ]} pins={[{ at: 0.4, lon: -86, lat: 59.5, label: "HUDSON BAY", sub: "Canada · late summer", ring: true }]} />;
    return null;
  };
  const cur = SHOTS1.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {!farm && <Audio src={staticFile("apex03_mix.wav")} />}
      {SHOTS1.map((s, i) => <ShotLayer key={i} S={SHOTS1} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={t} a={3.3} b={4.7} text="THE ICE IS GONE" />
        <Place t={t} a={5.2} b={10.2} text="KILOMETERS FROM SHORE" sub="the nearest land, out of sight" />
        <Place t={t} a={10.6} b={15.9} text="WATER JUST ABOVE FREEZING" />
        <BigWord t={t} a={16.4} b={19.3} text="DARK · VERY DEEP" />
        <BigWord t={t} a={21.0} b={23.5} text="A FIN" hot />
        <BigWord t={t} a={23.7} b={25.0} text="ANOTHER" />
        <BigWord t={t} a={25.1} b={26.3} text="AND ANOTHER" hot />
        {cur?.k === "tape" && <TaleTape t={t} a={26.4} b={38.5}
          left={{ name: "POLAR BEAR", rows: [{ at: 27.2, v: "LARGEST LAND PREDATOR" }, { at: 32.6, v: "NOTHING HUNTS IT ON LAND" }] }}
          right={{ name: "ORCA", rows: [{ at: 29.8, v: "MOST POWERFUL IN THE OCEAN" }, { at: 36.1, v: "NOTHING HUNTS IT AT SEA" }] }} />}
        <BigWord t={t} a={38.8} b={41.0} text="WHEN THEY MEET?" />
        <Place t={t} a={41.4} b={43.6} text="STRANGER THAN YOU THINK" />
        <BigWord t={t} a={44.0} b={47.0} text="THEY ALMOST NEVER DID" />
        {cur?.k === "file" && <CaseFile t={t} a={47.3} b={53.0} num="03" name="ORCA VS POLAR BEAR" latin="Orcinus orca · Ursus maritimus"
          rows={[{ at: 48.4, k: "MEETINGS", v: "ALMOST NONE" }, { at: 51.3, k: "WHAT CHANGED", v: "THE ICE", hot: true }]} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
