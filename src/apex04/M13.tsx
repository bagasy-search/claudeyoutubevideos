// apex04 · MINUTO 13 (747,38–812,51 s) — lo que significan 60; Nessie/Yeti/Bigfoot vs un animal real; desaparece 16 meses y reaparece en 2009.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { GeoMap } from "./GeoMap";
import { BigWord, Place, Stamp, CaseCard, TimeRail, Letterbox } from "./comps";

export const OFF13 = 747.38, END13 = 812.51;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 747.38, b: 749.6, img: F + "lake_ad997c1b.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 749.6, b: 751.6, v: R + "river_3969327", from: 1.0, out: { type: "cut" } },
  { a: 751.6, b: 753.6, img: F + "ruzizi_978b32f4.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 753.6, b: 755.6, v: T + "g59_giant_bask", from: 1.0, out: { type: "flash" } },
  { a: 755.6, b: 758.0, v: T + "g60_scarred_head", from: 1.0, out: { type: "cut" } },
  { a: 758.0, b: 760.08, v: R + "lake_11417535", from: 1.0, out: { type: "cut" } },
  { a: 760.08, b: 762.0, img: F + "kivu_16a089f9.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 762.0, b: 763.89, v: R + "otros_3723651", from: 1.0, out: { type: "flash" } },
  { a: 763.89, b: 766.6, img: F + "lake_eac1727d.jpg", k: "cmp", grade: "brightness(.8) saturate(.7)", cam: [1.04, 0.3, 0.5, 1.16, 0.3, 0.5], out: { type: "cut" } },
  { a: 766.6, b: 769.32, img: F + "hills_412ffc67.jpg", k: "cmp", grade: "brightness(.8) saturate(.7)", cam: [1.16, 0.3, 0.5, 1.04, 0.3, 0.5], out: { type: "cut" } },
  { a: 769.32, b: 771.2, v: R + "anim_4706982", from: 1.0, k: "cmp", out: { type: "cut" } },
  { a: 771.2, b: 773.62, v: T + "g69_eye_close", from: 1.0, k: "cmp", out: { type: "flash" } },
  { a: 773.62, b: 776.0, v: T + "g68_boat_search", from: 1.0, out: { type: "cut" } },
  { a: 776.0, b: 778.65, v: R + "otros_35916044", from: 1.0, out: { type: "cut" } },
  { a: 778.65, b: 781.0, v: T + "g61_old_croc_reeds", from: 1.0, out: { type: "cut" } },
  { a: 781.0, b: 783.63, img: F + "kivu_fd40aea2.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "white", d: 0.3 } },
  { a: 783.63, b: 785.55, v: R + "storm_854541", from: 0.5, out: { type: "cut" } },
  { a: 785.55, b: 787.2, v: T + "g67_strike", from: 2.4, out: { type: "flash" } },
  { a: 787.2, b: 788.74, img: F + "ruzizi_0567ea0e.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 788.74, b: 791.0, img: F + "hills_9233425e.jpg", k: "rail", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 791.0, b: 793.03, img: F + "hills_a876718e.jpg", k: "rail", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 793.03, b: 795.24, v: T + "g62_sink_mud", from: 1.0, k: "rail", out: { type: "cut" } },
  { a: 795.24, b: 797.79, img: F + "ruzizi_fed6272b.jpg", k: "rail", grade: "brightness(.85) saturate(.7)", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "sweep", d: 0.5 } },
  { a: 797.79, b: 801.0, comp: "bu5", out: { type: "cut" } },
  { a: 801.0, b: 804.2, comp: "bu5", out: { type: "cut" } },
  { a: 804.2, b: 807.36, img: F + "kivu_1cb7f4af.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "flash" } },
  { a: 807.36, b: 808.67, v: T + "g53_splash", from: 2.2, out: { type: "cut" } },
  { a: 808.67, b: 810.22, v: T + "g52_watching", from: 1.0, out: { type: "cut" } },
  { a: 810.22, b: 812.51, v: T + "g58_tracks", from: 1.0, out: { type: "dissolve", d: 0.4 } },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF13, b: s.b - OFF13 }));
const L = (x: number) => x - OFF13;

export const M13: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF13;
  const renderComp = (s: Shot) => {
    if (s.comp === "bu5") return <GeoMap m="bu" t0={L(797.79)} keys={[
      { at: 0, pos: [-2, 40, 34], look: [-3, 0, 2], fov: 34 },
      { at: 6.4, pos: [-6, 16, 16], look: [-7, 0, 5], fov: 34 },
    ]} pins={[
      { at: 0.4, out: 2.4, lon: 29.25, lat: -3.33, label: "RUZIZI DELTA", ring: false },
      { at: 2.6, lon: 29.05, lat: -3.37, label: "EARLY 2009", sub: "seen again · northern shore", ring: true },
    ]} ranges={[{ at: 2.8, d: 1.4, color: "#ffcf5a", pts: [[29.0, -3.3], [29.28, -3.3], [29.3, -3.42], [29.12, -3.47], [29.0, -3.42]] }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={747.5} b={749.5} text="60 PEOPLE" size={220} />
        <Place t={ta} a={749.8} b={753.5} text="A handful of villages" sub="one stretch of river and shore" />
        <BigWord t={ta} a={753.7} b={755.5} text="ONE ANIMAL" red size={200} />
        <BigWord t={ta} a={755.8} b={760.0} text="ONE OF THE DEADLIEST" sub="individual animals ever recorded" size={150} />
        <Place t={ta} a={760.3} b={763.8} text="One name" sub="swallows all the others" />
        {cur?.k === "cmp" && <CaseCard t={ta} a={764.0} b={773.55} title="LEGENDS · COMPARED" x={1060} y={150}
          rows={[{ at: 764.3, k: "LOCH NESS MONSTER", v: "never proven" }, { at: 765.6, k: "YETI", v: "never proven" }, { at: 767.0, k: "BIGFOOT", v: "never proven" },
            { at: 771.3, k: "GUSTAVE", v: "seen · filmed · photographed", red: true }]} stamp={{ at: 771.6, text: "REAL" }} />}
        <Place t={ta} a={773.8} b={778.5} text="Seen · filmed · photographed" sub="by people who studied him for years" />
        <Place t={ta} a={778.9} b={783.5} text="The same scar" sub="from witnesses who never met" />
        <BigWord t={ta} a={783.7} b={785.5} text="THE LEGEND IS BIGGER" size={150} />
        <BigWord t={ta} a={785.6} b={787.1} text="BUT THE ANIMAL IS REAL" red size={140} />
        <Place t={ta} a={787.3} b={788.7} text="So what happened to him?" />
        {cur?.k === "rail" && <TimeRail t={ta} a={788.8} b={797.7} ev={[{ at: 789.2, y: "2004", text: "THE EXPEDITION ENDS" }, { at: 790.8, y: "AFTER", text: "THE REPORTS KEEP COMING" }, { at: 793.3, y: "THEN", text: "SIXTEEN MONTHS OF NOTHING" }]} />}
        <Stamp t={ta} a={804.4} b={807.25} text="PATRICE FAYE" sub="reports the giant again" size={110} />
        <BigWord t={ta} a={807.45} b={808.6} text="STILL ALIVE" size={200} />
        <BigWord t={ta} a={808.75} b={810.15} text="STILL ENORMOUS" size={190} />
        <Place t={ta} a={810.4} b={812.4} text="Then" sub="the trail goes cold" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M13_FRAMES = Math.round((END13 - OFF13) * FPS);
