// apex05 · MINUTO 3 (123,30–180,50 s) — #8 panda: no es un juguete, la mordida, los ataques en el zoo de Pekín (2006/2007/2009), 0 casos en libertad, <2.000 en las montañas de China, "del otro lado del vidrio".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, Counter, CaseCard, TimeRail, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF3 = 123.3, END3 = 180.5;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 123.3, b: 126.2, v: R + "panda_39633716", from: 1.0, out: { type: "cut" } },
  { a: 126.2, b: 127.72, img: F + "panda_88acfb7e.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "flash" } },
  { a: 127.72, b: 130.4, v: R + "panda_39646695", from: 1.0, out: { type: "cut" } },
  { a: 130.4, b: 132.6, v: T + "panda_6acf6a49", from: 0.0, out: { type: "cut" } },
  { a: 132.6, b: 134.7, v: T + "a55_panda_jaw", from: 1.0, out: { type: "cut" } },
  { a: 134.7, b: 137.0, v: T + "panda_349019eb", from: 0.0, out: { type: "cut" } },
  { a: 137.0, b: 138.98, v: R + "panda_39611290", from: 1.0, out: { type: "white", d: 0.3 } },
  { a: 138.98, b: 141.6, v: R + "panda_39646284", from: 1.0, out: { type: "cut" } },
  { a: 141.6, b: 144.24, v: R + "panda_40073043", from: 1.0, out: { type: "flash" } },
  { a: 144.24, b: 146.6, img: F + "panda_a6546ceb.jpg", k: "rail", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 146.6, b: 148.5, v: R + "panda_39645926", from: 1.0, k: "rail", out: { type: "cut" } },
  { a: 148.5, b: 150.42, img: F + "panda_1e453f32.jpg", k: "rail", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 150.42, b: 152.8, v: T + "a53_zoo_toy", from: 3.15, out: { type: "cut" } },
  { a: 152.8, b: 154.8, img: F + "panda_d4bd752c.jpg", k: "case", cam: [1.04, 0.4, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 154.8, b: 156.74, img: F + "panda_540bf16c.jpg", k: "case", cam: [1.04, 0.4, 0.5, 1.16, 0.35, 0.5], out: { type: "white", d: 0.3 } },
  { a: 156.74, b: 159.4, v: T + "a56_panda_mist", from: 1.0, out: { type: "cut" } },
  { a: 159.4, b: 162.32, v: R + "panda_40117055", from: 2.0, grade: "contrast(1.1)", out: { type: "cut" } },
  { a: 162.32, b: 165.36, v: R + "china_13180793", from: 1.0, out: { type: "dissolve", d: 0.4 } },
  { a: 165.36, b: 169.0, comp: "map", out: { type: "cut" } },
  { a: 169.0, b: 170.8, v: T + "a58_sichuan_ridge", from: 1.0, out: { type: "cut" } },
  { a: 170.8, b: 172.52, v: T + "a57_panda_tree", from: 1.0, out: { type: "cut" } },
  { a: 172.52, b: 174.4, v: T + "a54_panda_glass", from: 1.0, out: { type: "cut" } },
  { a: 174.4, b: 176.22, img: F + "panda_9ad459d7.jpg", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 176.22, b: 178.4, v: T + "panda_13875509", from: 0.0, out: { type: "cut" } },
  { a: 178.4, b: 180.5, img: F + "panda_3f671111.jpg", cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF3, b: s.b - OFF3 }));
const L = (x: number) => x - OFF3;

export const M3: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF3;
  const renderComp = (s: Shot) => {
    if (s.comp === "map") return <GeoMap m="wd" t0={L(165.36)} ranges={[{ at: 0.3, color: "#9be37a", pts: [[102, 28.5], [104.5, 29], [108, 32.5], [107, 34], [104, 34.5], [102, 33], [101.5, 30]] }]} keys={[
      { at: 0, pos: [8, 34, 26], look: [10, 0, -2], fov: 34 },
      { at: 3.7, pos: [19.7, 15, 9], look: [19.7, 0, -4], fov: 34 },
    ]} pins={[{ at: 1.2, lon: 103.5, lat: 31.5, label: "CENTRAL CHINA", sub: "the last wild pandas", ring: true }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={123.5} b={126.1} text="NOT A TOY" size={220} />
        <BigWord t={ta} a={126.3} b={127.65} text="STILL A BEAR" red size={200} />
        <Counter t={ta} a={127.9} b={130.3} to={250} dur={1.0} digits={3} kicker="AN ADULT · MORE THAN" unit="POUNDS" center y={330} size={220} />
        <Place t={ta} a={130.6} b={134.6} text="Jaws built to crush" sub="thick bamboo stems" />
        <BigWord t={ta} a={134.9} b={138.9} text="ONE OF THE STRONGEST BITES" sub="of any carnivore · for its size" size={130} />
        <Place t={ta} a={139.2} b={141.5} text="Panda attacks on record" sub="almost all in one place" />
        <Stamp t={ta} a={141.8} b={144.15} text="ZOOS" size={170} />
        {cur?.k === "rail" && <TimeRail t={ta} a={144.3} b={150.4} ev={[{ at: 144.5, y: "2006", text: "a man climbs in" }, { at: 146.2, y: "2007", text: "a teenager jumps in" }, { at: 148.0, y: "2009", text: "a father · after a toy" }]} />}
        <Place t={ta} a={150.6} b={152.7} text="Beijing Zoo · 2009" sub="a toy dropped by a child" />
        {cur?.k === "case" && <CaseCard t={ta} a={152.9} b={156.7} title="BEIJING ZOO · 2009" x={1060} y={150}
          rows={[{ at: 153.1, k: "WHY", v: "jumped in for a toy" }, { at: 153.8, k: "INJURY", v: "both legs · badly", red: true }]} stamp={{ at: 155.0, text: "BITTEN" }} />}
        <Place t={ta} a={156.9} b={159.3} text="In the wild" sub="researchers looked" />
        <Stamp t={ta} a={159.6} b={162.25} text="0 CASES" sub="a panda hunting a person" size={140} />
        <BigWord t={ta} a={162.6} b={165.3} text="LEAVE IT ALONE" sub="it will leave you alone" size={180} />
        <Counter t={ta} a={169.1} b={172.45} to={2000} dur={1.2} digits={4} comma kicker="FEWER THAN" unit="IN THE WILD" center y={330} size={220} />
        <Place t={ta} a={172.7} b={176.1} text="Most people will meet one" sub="through glass" />
        <BigWord t={ta} a={176.4} b={180.4} text="STAY ON YOUR SIDE" sub="of the glass" size={170} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M3_FRAMES = Math.round((END3 - OFF3) * FPS);
