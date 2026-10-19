// apex04 · MINUTO 9 (494,93–558,45 s) — la guerra, las tres fronteras del Ruzizi, la leyenda que cruza el mundo, el plan: atraparlo vivo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { GeoMap } from "./GeoMap";
import { BigWord, Place, Stamp, Counter, SourceCard, Letterbox } from "./comps";

export const OFF9 = 494.93, END9 = 558.45;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 494.93, b: 497.0, v: R + "war_1444721", from: 1.0, out: { type: "cut" } },
  { a: 497.0, b: 498.63, v: R + "war_2908573", from: 2.0, grade: "contrast(1.1) saturate(.8)", out: { type: "cut" } },
  { a: 498.63, b: 500.89, v: R + "storm_10824285", from: 1.0, out: { type: "cut" } },
  { a: 500.89, b: 504.09, v: R + "lake_6981419", from: 1.0, grade: "brightness(1.25)", out: { type: "sweep", d: 0.5 } },
  { a: 504.09, b: 507.2, comp: "af3", out: { type: "cut" } },
  { a: 507.2, b: 510.29, comp: "af3", out: { type: "cut" } },
  { a: 510.29, b: 514.19, comp: "bu4", out: { type: "whip", vx: 1 } },
  { a: 514.19, b: 516.8, v: R + "river_20208900", from: 1.0, out: { type: "cut" } },
  { a: 516.8, b: 519.4, v: R + "river_3149008", from: 1.0, out: { type: "cut" } },
  { a: 519.4, b: 521.99, v: R + "river_36955444", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "dissolve", d: 0.5 } },
  { a: 521.99, b: 523.53, img: F + "ruzizi_d2b0f826.jpg", grade: "brightness(.75) contrast(1.15)", cam: [1.1, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 523.53, b: 525.39, img: F + "ruzizi_51c77349.jpg", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 525.39, b: 527.8, v: T + "g32_village_burnt", from: 1.0, out: { type: "cut" } },
  { a: 527.8, b: 530.23, img: F + "croc_28c14c84.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "flash" } },
  { a: 530.23, b: 532.6, v: R + "storm_6190836", from: 1.0, out: { type: "cut" } },
  { a: 532.6, b: 535.01, v: R + "river_4288026", from: 1.0, out: { type: "whip", vx: 1 } },
  { a: 535.01, b: 537.6, v: R + "otros_1085978", from: 1.0, out: { type: "cut" } },
  { a: 537.6, b: 539.6, v: R + "otros_3205625", from: 1.0, out: { type: "cut" } },
  { a: 539.6, b: 541.69, v: R + "lake_3149007", from: 1.0, out: { type: "flash" } },
  { a: 541.69, b: 545.0, img: F + "croc_13947b1b.jpg", k: "ng", cam: [1.04, 0.6, 0.5, 1.15, 0.6, 0.5], out: { type: "cut" } },
  { a: 545.0, b: 547.2, img: F + "croc_725b9fa7.jpg", k: "ng", cam: [1.05, 0.6, 0.5, 1.18, 0.6, 0.5], out: { type: "cut" } },
  { a: 547.2, b: 549.45, img: F + "croc_411ac497.jpg", k: "ng", cam: [1.05, 0.6, 0.5, 1.18, 0.65, 0.5], out: { type: "white", d: 0.3 } },
  { a: 549.45, b: 550.95, v: R + "otros_1998560", from: 1.0, out: { type: "cut" } },
  { a: 550.95, b: 553.1, v: R + "otros_2512876", from: 1.0, out: { type: "cut" } },
  { a: 553.1, b: 555.27, v: T + "g26_filmcrew", from: 1.0, out: { type: "flash" } },
  { a: 555.27, b: 556.71, img: F + "croc_b3fbf34b.jpg", cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 556.71, b: 558.45, v: T + "g03_cage_drag", from: 1.0 },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF9, b: s.b - OFF9 }));
const L = (x: number) => x - OFF9;

export const M9: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF9;
  const renderComp = (s: Shot) => {
    if (s.comp === "af3") return <GeoMap m="af" t0={L(504.09)} keys={[
      { at: 0, pos: [6, 34, 26], look: [6, 0, 1], fov: 34 },
      { at: 6.2, pos: [7.4, 18, 14], look: [7.0, 0, 1.6], fov: 34 },
    ]} pins={[
      { at: 0.3, lon: 29.9, lat: -3.4, label: "BURUNDI", sub: "1993–2005", ring: true },
      { at: 1.4, lon: 29.9, lat: -1.9, label: "RWANDA", sub: "1994", ring: true },
      { at: 2.6, lon: 26.6, lat: -3.0, label: "DR CONGO", sub: "1996–2003", ring: true },
    ]} ranges={[{ at: 0.4, d: 1.2, color: "#ff4a3a", pts: [[29.0, -2.35], [29.35, -2.3], [29.9, -2.38], [30.4, -2.4], [30.85, -2.95], [30.75, -3.3], [30.4, -3.65], [30.0, -4.3], [29.6, -4.45], [29.4, -4.1], [29.25, -3.6], [29.2, -3.3], [29.0, -2.8]] }, { at: 1.5, d: 1.2, color: "#ff8a4a", pts: [[29.0, -1.5], [29.6, -1.3], [30.4, -1.05], [30.9, -1.6], [30.8, -2.35], [29.9, -2.36], [29.0, -2.6]] }]} dark={(u) => 0.25 + 0.3 * Math.min(1, u / 6)} />;
    if (s.comp === "bu4") return <GeoMap m="bu" t0={L(510.29)} keys={[
      { at: 0, pos: [-9, 30, 20], look: [-10, 0, -4], fov: 34 },
      { at: 3.9, pos: [-8, 22, 18], look: [-9, 0, 0], fov: 34 },
    ]} pins={[
      { at: 0.3, lon: 29.3, lat: -2.45, label: "RWANDA", ring: false },
      { at: 0.7, lon: 28.75, lat: -2.9, label: "CONGO", ring: false },
      { at: 1.1, lon: 29.4, lat: -3.0, label: "BURUNDI", ring: false },
    ]} lines={[{ at: 0, d: 1.2, color: RED_LINE, w: 8, pts: [[28.86, -2.49], [29.02, -2.7], [29.13, -3.0], [29.25, -3.33]] }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Stamp t={ta} a={495.2} b={498.55} text="1993" sub="civil war" size={160} />
        <Counter t={ta} a={498.8} b={500.8} to={10} dur={0.8} digits={2} kicker="MORE THAN" unit="YEARS" center y={330} size={220} />
        <Counter t={ta} a={501.0} b={504.0} to={200000} dur={1.6} digits={6} comma kicker="AN ESTIMATED" unit="BURUNDIANS KILLED" red center y={330} size={200} />
        <Place t={ta} a={510.5} b={514.1} text="The Ruzizi" sub="where three countries meet" />
        <Place t={ta} a={514.4} b={521.8} text="Some writers suggested" sub="the crocodiles had something new" />
        <Stamp t={ta} a={523.7} b={525.3} text="UNPROVEN" size={130} />
        <BigWord t={ta} a={530.5} b={534.9} text="WHEN PEOPLE VANISH" sub="a story can grow" size={150} />
        <Place t={ta} a={535.3} b={541.5} text="Early 2000s" sub="the story reaches the other side of the world" />
        {cur?.k === "ng" && <SourceCard t={ta} a={541.9} b={549.35} kicker="NATIONAL GEOGRAPHIC · 2002" title="“Easily more than 20 feet”" sub="and over 2,000 pounds" x={110} y={240} />}
        <Place t={ta} a={549.6} b={555.1} text="Filmmakers arrive" sub="and Faye has a plan" />
        <BigWord t={ta} a={555.3} b={556.65} text="NOT KILL HIM" size={190} />
        <BigWord t={ta} a={556.75} b={558.4} text="CATCH HIM. ALIVE." red size={170} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const RED_LINE = "#e0473f";
export const M9_FRAMES = Math.round((END9 - OFF9) * FPS);
