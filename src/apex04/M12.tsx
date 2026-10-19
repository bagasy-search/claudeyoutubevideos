// apex04 · MINUTO 12 (689,41–747,38 s) — la gran pregunta: ¿300 muertes? El rumor, Richard Grant (60 o menos), National Geographic duda.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, Crowd, CaseCard, SourceCard, Letterbox } from "./comps";

export const OFF12 = 689.41, END12 = 747.38;
const R = "apex04/real/", F = "apex04/foto/", T = "apex04/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 689.41, b: 691.5, v: R + "lake_3151453", from: 1.0, out: { type: "cut" } },
  { a: 691.5, b: 693.33, v: R + "anim_26596204", from: 1.0, out: { type: "cut" } },
  { a: 693.33, b: 695.19, img: F + "lake_fd930e5d.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "flash" } },
  { a: 695.19, b: 697.91, v: T + "g45_eye_open", from: 1.0, out: { type: "cut" } },
  { a: 697.91, b: 700.59, v: T + "g50_sandbank_many", from: 1.0, k: "c300", out: { type: "flash" } },
  { a: 700.59, b: 702.4, v: R + "river_4287985", from: 1.0, out: { type: "cut" } },
  { a: 702.4, b: 704.25, img: F + "croc_127afc3d.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.4, 0.4], out: { type: "cut" } },
  { a: 704.25, b: 706.45, img: F + "ruzizi_957161bb.jpg", cam: [1.04, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "cut" } },
  { a: 706.45, b: 708.49, v: R + "river_7001581", from: 1.0, k: "names", out: { type: "cut" } },
  { a: 708.49, b: 710.2, img: F + "ruzizi_c687f4dc.jpg", cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "cut" } },
  { a: 710.2, b: 711.99, img: F + "ruzizi_d599dcd7.jpg", cam: [1.18, 0.5, 0.6, 1.05, 0.5, 0.6], out: { type: "whip", vx: 1 } },
  { a: 711.99, b: 714.6, v: T + "g44_bubbles", from: 1.0, out: { type: "cut" } },
  { a: 714.6, b: 716.8, img: F + "ruzizi_d8b55c5d.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.55, 0.5], out: { type: "cut" } },
  { a: 716.8, b: 719.0, v: T + "g51_night_eyes", from: 1.0, out: { type: "cut" } },
  { a: 719.0, b: 720.82, img: F + "croc_a9008c33.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.6, 0.5], out: { type: "sweep", d: 0.5 } },
  { a: 720.82, b: 723.4, v: R + "lake_4440945", from: 1.0, k: "grant", out: { type: "cut" } },
  { a: 723.4, b: 725.9, v: R + "river_2316938", from: 1.0, k: "grant", out: { type: "cut" } },
  { a: 725.9, b: 728.48, img: F + "lake_70999066.jpg", k: "grant", cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "flash" } },
  { a: 728.48, b: 731.0, v: R + "lake_3816507", from: 1.0, k: "c60", out: { type: "cut" } },
  { a: 731.0, b: 733.62, v: R + "lake_8651229", from: 1.0, k: "c60", out: { type: "cut" } },
  { a: 733.62, b: 736.6, img: F + "lake_81682bbb.jpg", k: "ng", cam: [1.04, 0.6, 0.5, 1.15, 0.6, 0.5], out: { type: "cut" } },
  { a: 736.6, b: 739.4, img: F + "lake_1cc078e2.jpg", k: "ng", cam: [1.15, 0.6, 0.5, 1.04, 0.6, 0.5], out: { type: "cut" } },
  { a: 739.4, b: 743.13, v: R + "river_1388376", from: 1.0, k: "ng", out: { type: "flash" } },
  { a: 743.13, b: 744.91, img: F + "ruzizi_b881c5e9.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 744.91, b: 747.38, img: F + "lake_ffcfb739.jpg", cam: [1.04, 0.5, 0.5, 1.18, 0.5, 0.5] },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF12, b: s.b - OFF12 }));

export const M12: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF12;
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <BigWord t={ta} a={693.4} b={695.1} text="A GLOBAL LEGEND" size={170} />
        <Place t={ta} a={695.4} b={697.8} text="The biggest question" sub="in this case" />
        {cur?.k === "c300" && <Crowd t={ta} a={698.0} b={700.55} n={300} cols={30} label="DID HE REALLY KILL 300?" />}
        <Stamp t={ta} a={700.8} b={704.15} text="ALMOST CERTAINLY NO" size={110} />
        <Stamp t={ta} a={704.4} b={706.4} text="RUMOR" sub="the number 300" size={150} />
        {cur?.k === "names" && <CaseCard t={ta} a={706.5} b={708.45} title="VICTIMS · LIST" x={1060} y={150}
          rows={[{ at: 706.8, k: "NAMES", v: "none kept", red: true }, { at: 707.4, k: "LINKED TO GUSTAVE", v: "none proven", red: true }]} />}
        <Place t={ta} a={708.7} b={711.9} text="One death · one crocodile?" sub="nobody connected them" />
        <BigWord t={ta} a={712.2} b={718.9} text="A RIVER FULL OF CROCODILES" sub="many of them large" size={130} />
        {cur?.k === "grant" && <SourceCard t={ta} a={721.0} b={728.4} kicker="RICHARD GRANT · 2011" title="Crazy River" sub="traveled to Burundi to check the story" x={110} y={240} />}
        {cur?.k === "c60" && <Crowd t={ta} a={728.6} b={733.55} n={300} cols={30} keepAt={729.4} keep={60} label="BLAMED" keepLabel="PROBABLY 60 OR FEWER" />}
        {cur?.k === "ng" && <SourceCard t={ta} a={733.8} b={743.0} kicker="NATIONAL GEOGRAPHIC · LATER" title="“Doubtful” one crocodile did it all" sub="the same magazine that made him famous" x={110} y={240} />}
        <BigWord t={ta} a={743.2} b={744.85} text="60 ≠ 300" red size={240} />
        <Place t={ta} a={745.1} b={747.3} text="But think about" sub="what sixty means" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M12_FRAMES = Math.round((END12 - OFF12) * FPS);
