// apex04 · MINUTO 3 (126,88–185,56 s) — la rutina de la orilla, el cocodrilo del Nilo, la cabeza hecha para esperar.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Routine, SpanMark, WaterLine, Mark, Letterbox } from "./comps";

export const OFF3 = 126.88, END3 = 185.56;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 126.88, b: 129.38, img: F + "lake_70f9f9a6.jpg", cam: [1.05, 0.5, 0.55, 1.2, 0.35, 0.6], out: { type: "cut" } },
  { a: 129.38, b: 131.78, v: T + "g13_children", from: 1.0, out: { type: "cut" } },
  { a: 131.78, b: 133.7, v: T + "g14_fishermen", from: 1.0, out: { type: "cut" } },
  { a: 133.7, b: 135.72, v: R + "lake_10039885", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.55], out: { type: "dissolve", d: 0.4 } },
  { a: 135.72, b: 138.0, v: R + "lake_3151449", from: 1.0, k: "rout", out: { type: "cut" } },
  { a: 138.0, b: 140.34, v: R + "lake_4809193", from: 1.0, k: "rout", out: { type: "flash" } },
  { a: 140.34, b: 142.3, v: R + "croc_37905524", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.45], out: { type: "cut" } },
  { a: 142.3, b: 144.2, v: R + "croc_29356265", from: 1.0, cam: [1.1, 0.3, 0.5, 1.22, 0.3, 0.5], out: { type: "zoom", fx: 0.3, fy: 0.5 } },
  { a: 144.2, b: 146.0, v: R + "croc_20432857", from: 1.0, out: { type: "cut" } },
  { a: 146.0, b: 148.56, v: R + "croc_37659258", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.4, 0.5], out: { type: "whip", vx: 1 } },
  { a: 148.56, b: 151.2, v: R + "croc_20443910", from: 1.0, k: "len", out: { type: "cut" } },
  { a: 151.2, b: 154.24, v: R + "croc_855862", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.55], out: { type: "flash" } },
  { a: 154.24, b: 156.5, v: R + "croc_6423032", from: 1.0, out: { type: "cut" } },
  { a: 156.5, b: 158.78, v: R + "croc_7722911", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.45, 0.55], out: { type: "white", d: 0.3 } },
  { a: 158.78, b: 161.0, v: T + "g11_lunge", from: 2.0, out: { type: "flash" } },
  { a: 161.0, b: 163.78, img: F + "croc_92b0a0e5.jpg", cam: [1.25, 0.35, 0.5, 1.05, 0.4, 0.5], out: { type: "cut" } },
  { a: 163.78, b: 165.66, v: R + "croc_5742215", from: 1.0, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "cut" } },
  { a: 165.66, b: 169.0, img: F + "croc_c987b768.jpg", k: "wl", cam: [1.0, 0.5, 0.5, 1.08, 0.5, 0.5], out: { type: "cut" } },
  { a: 169.0, b: 171.64, img: F + "croc_a796d66d.jpg", k: "eye", cam: [1.05, 0.5, 0.5, 1.1, 0.5, 0.5], out: { type: "zoom", fx: 0.5, fy: 0.3 } },
  { a: 171.64, b: 174.4, v: T + "g15_eyes", from: 1.0, out: { type: "cut" } },
  { a: 174.4, b: 177.0, v: R + "croc_2910037", from: 1.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 177.0, b: 180.12, v: R + "croc_13876328", from: 1.0, out: { type: "whip", vx: -1 } },
  { a: 180.12, b: 181.9, v: R + "croc_31163984", from: 1.0, out: { type: "cut" } },
  { a: 181.9, b: 183.7, v: R + "croc_10041464", from: 1.0, out: { type: "cut" } },
  { a: 183.7, b: 185.56, v: R + "river_3859436", from: 1.0, cam: [1.0, 0.5, 0.5, 1.1, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF3, b: s.b - OFF3 }));

export const M3: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF3;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={127.1} b={129.3} text="Every morning" sub="the same shore" />
        {cur?.k === "rout" && <Routine t={ta} a={135.8} b={140.3} hour={6} days={14} />}
        <BigWord t={ta} a={144.4} b={146.9} text="NILE CROCODILE" sub="Crocodylus niloticus" size={170} />
        {cur?.k === "len" && <SpanMark t={ta} a={148.7} b={151.15} x1={560} y1={640} x2={1500} y2={630} label="LONGER THAN A CAR" sub="largest males · 16–20 ft" ticks={16} />}
        <BigWord t={ta} a={151.6} b={154.1} text="≈ 1 TON" sub="the biggest ones" size={210} />
        <Place t={ta} a={154.5} b={158.6} text="Slow on land" sub="for long distances" />
        <BigWord t={ta} a={159.0} b={160.9} text="AMBUSH" red size={240} />
        {cur?.k === "wl" && <WaterLine t={ta} a={165.8} b={168.95} y={492} pts={[{ at: 166.1, x: 830, label: "EYES" }, { at: 166.6, x: 1010, label: "EARS" }, { at: 167.1, x: 540, label: "NOSTRILS" }]} />}
        {cur?.k === "eye" && <Mark t={ta} a={169.2} b={171.6} x={1260} y={250} r={80} n="1" label="ON TOP OF THE SKULL" />}
        <Place t={ta} a={174.6} b={179.9} text="Almost fully underwater" sub="still seeing · hearing · breathing" />
        <BigWord t={ta} a={180.3} b={181.85} text="A LOG?" size={200} />
        <BigWord t={ta} a={182.0} b={183.65} text="WEEDS?" size={200} />
        <BigWord t={ta} a={183.8} b={185.5} text="NOTHING." red size={200} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M3_FRAMES = Math.round((END3 - OFF3) * FPS);
