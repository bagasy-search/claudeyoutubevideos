// apex04 · MINUTO 2 (63,46–126,88 s) — el lugar: Burundi, el Tanganica, el Ruzizi desde el Kivu, el delta, la gente en la orilla.
// Tiempos ABSOLUTOS (segundos de la voz); la composición arranca en OFF2.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { GeoMap } from "./GeoMap";
import { BigWord, Place, DepthRule, Letterbox } from "./comps";

export const OFF2 = 63.46, END2 = 126.88;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 63.46, b: 65.5, v: R + "river_17772375", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.55], out: { type: "dissolve", d: 0.4 } },
  { a: 65.5, b: 67.66, img: F + "hills_0871c4b8.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "sweep", d: 0.55 } },
  { a: 67.66, b: 71.3, comp: "af1", out: { type: "cut" } },
  { a: 71.3, b: 75.18, comp: "af2", out: { type: "whip", vx: 1 } },
  { a: 75.18, b: 77.3, v: R + "lake_4091556", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.6], out: { type: "cut" } },
  { a: 77.3, b: 79.28, v: R + "lake_854994", from: 2.0, out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 79.28, b: 81.3, img: F + "lake_b00130c7.jpg", cam: [1.04, 0.4, 0.5, 1.2, 0.6, 0.5], out: { type: "whip", vx: -1 } },
  { a: 81.3, b: 83.58, v: R + "lake_7443771", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 83.58, b: 87.4, v: R + "river_5191074", from: 1.0, cam: [1.05, 0.5, 0.4, 1.2, 0.5, 0.7], k: "depth", out: { type: "flash" } },
  { a: 87.4, b: 89.6, v: R + "lake_3281507", from: 2.0, cam: [1.04, 0.5, 0.5, 1.14, 0.45, 0.5], out: { type: "cut" } },
  { a: 89.6, b: 91.4, img: F + "lake_fa1b9eb8.jpg", cam: [1.18, 0.5, 0.55, 1.04, 0.5, 0.5], out: { type: "cut" } },
  { a: 91.4, b: 93.44, v: R + "lake_2711145", from: 1.5, out: { type: "dissolve", d: 0.4 } },
  { a: 93.44, b: 95.2, v: R + "river_35897979", from: 1.0, cam: [1.1, 0.5, 0.7, 1.2, 0.5, 0.75], out: { type: "cut" } },
  { a: 95.2, b: 96.94, v: R + "river_14943855", from: 2.0, out: { type: "sweep", d: 0.55 } },
  { a: 96.94, b: 100.4, comp: "bu1", out: { type: "cut" } },
  { a: 100.4, b: 103.76, comp: "bu2", out: { type: "zoom", fx: 0.45, fy: 0.6 } },
  { a: 103.76, b: 105.9, v: R + "river_10069767", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 105.9, b: 108.58, v: R + "river_4275176", from: 2.0, out: { type: "flash" } },
  { a: 108.58, b: 109.45, v: R + "river_5236944", from: 1.0, cam: [1.1, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 109.45, b: 110.35, v: R + "river_26052515", from: 2.0, out: { type: "cut" } },
  { a: 110.35, b: 111.2, v: R + "river_5887831", from: 2.0, out: { type: "cut" } },
  { a: 111.2, b: 112.06, v: R + "river_5206344", from: 1.0, cam: [1.15, 0.5, 0.6, 1.25, 0.5, 0.6], out: { type: "flash" } },
  { a: 112.06, b: 114.84, v: R + "croc_2910042", from: 1.0, cam: [1.1, 0.45, 0.55, 1.3, 0.45, 0.6], out: { type: "whip", vx: 1 } },
  { a: 114.84, b: 116.8, v: R + "lake_4426234", from: 1.0, out: { type: "cut" } },
  { a: 116.8, b: 118.66, v: R + "anim_5288493", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.6, 0.5], out: { type: "cut" } },
  { a: 118.66, b: 120.62, v: R + "anim_7086841", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "dissolve", d: 0.4 } },
  { a: 120.62, b: 123.0, v: T + "g12_jerrycans", from: 1.0, out: { type: "cut" } },
  { a: 123.0, b: 125.0, img: F + "lake_c93e9f5c.jpg", cam: [1.05, 0.5, 0.5, 1.15, 0.45, 0.55], out: { type: "cut" } },
  { a: 125.0, b: 126.88, img: F + "lake_6ac40f76.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.55, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF2, b: s.b - OFF2 }));
const L = (x: number) => x - OFF2;
// África: x = (lon-26)*2, z = -(lat+3)*2 · Burundi ~ (7.8, 0.8)
const BDI: [number, number] = [29.9, -3.4];

export const M2: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF2;
  const renderComp = (s: Shot) => {
    if (s.comp === "af1" || s.comp === "af2") return <GeoMap m="af" t0={L(67.66)} keys={[
      { at: 0, pos: [3, 66, 44], look: [3, 0, 2], fov: 34 },
      { at: 3.6, pos: [7.5, 30, 22], look: [7.6, 0, 1.6], fov: 34 },
      { at: 7.5, pos: [8.6, 17, 14], look: [7.6, 0, 2.6], fov: 34 },
    ]} pins={[
      { at: 0.6, lon: BDI[0], lat: BDI[1], label: "BURUNDI", ring: true },
      { at: 4.6, lon: 29.9, lat: -1.9, label: "RWANDA", ring: false },
      { at: 5.5, lon: 33.3, lat: -5.0, label: "TANZANIA", ring: false },
      { at: 6.3, lon: 26.6, lat: -3.6, label: "DR CONGO", ring: false },
    ]} ranges={[{ at: 1.0, d: 1.6, color: "#ff6b4a", pts: [[29.0, -2.35], [29.35, -2.3], [29.9, -2.38], [30.4, -2.4], [30.85, -2.95], [30.75, -3.3], [30.4, -3.65], [30.0, -4.3], [29.6, -4.45], [29.4, -4.1], [29.25, -3.6], [29.2, -3.3], [29.0, -2.8]] }]} />;
    if (s.comp === "bu1" || s.comp === "bu2") return <GeoMap m="bu" t0={L(96.94)} keys={[
      { at: 0, pos: [-10, 52, 30], look: [-11, 0, -4], fov: 34 },
      { at: 3.4, pos: [-9, 36, 26], look: [-11, 0, -1], fov: 34 },
      { at: 6.8, pos: [-6, 18, 19], look: [-9, 0, 3.5], fov: 34 },
    ]} pins={[
      { at: 0.4, out: 5.0, lon: 29.0, lat: -2.2, label: "LAKE KIVU", ring: false },
      { at: 4.2, out: 6.8, lon: 29.55, lat: -3.0, label: "BURUNDI", ring: false },
      { at: 4.6, out: 6.8, lon: 28.75, lat: -3.0, label: "CONGO", ring: false },
      { at: 6.0, lon: 29.25, lat: -3.33, label: "RUZIZI DELTA", ring: true },
    ]} lines={[{ at: 0.9, d: 3.2, color: "#c8a26a", w: 7, pts: [[28.86, -2.49], [28.92, -2.6], [29.02, -2.7], [29.0, -2.75], [29.06, -2.9], [29.13, -3.0], [29.17, -3.15], [29.22, -3.25], [29.25, -3.33]] }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={79.5} b={83.4} text="Lake Tanganyika" sub="more than 400 miles long" />
        {cur?.k === "depth" && <DepthRule t={ta} a={83.7} b={87.3} max={1470} unit="M" marks={[{ at: 85.4, d: 1470, label: "≈ 4,800 FT · ALMOST A MILE" }]} />}
        <BigWord t={ta} a={88.0} b={89.5} text="MILLIONS OF YEARS" size={150} />
        <BigWord t={ta} a={91.6} b={93.3} text="4 COUNTRIES" size={170} />
        <Place t={ta} a={104.0} b={108.4} text="The Ruzizi delta" sub="reeds · sandbanks · slow channels · mud" />
        <BigWord t={ta} a={112.4} b={114.7} text="PERFECT" sub="for a crocodile" red size={200} />
        <Place t={ta} a={115.0} b={116.7} text="Warm water" sub="all year round" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M2_FRAMES = Math.round((END2 - OFF2) * FPS);
