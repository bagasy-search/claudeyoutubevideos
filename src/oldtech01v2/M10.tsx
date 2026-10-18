// oldtech01v2 · MINUTO 10 (598,73–675,55 s) — las excepciones (Malbork, Kachelofen), la reinvención (losa radiante ~30 °C),
// revelación en 634,43 ("almost exactly what the Roman surfaces delivered"), el ondol coreano y el cierre.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Maqueta, BATH } from "./Maqueta";
import { Hypo3D, Fase, HypoKey, PH } from "./Hypo3D";
import { Place, ThermalDefs, Snow, BigWord, TempSplit, TempTag, Letterbox } from "./comps";
import { Term, Carved } from "./comps2";
import { RadiantWaves, DialGauge } from "./comps3";

export const OFF10 = 598.73;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type S10 = Shot & { k?: string };
const ABS: S10[] = [
  { a: 598.73, b: 600.11, img: F + "2dcb8d60.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 600.11, b: 602.6, comp: "malmap", out: { type: "dissolve", d: 0.5 } },
  { a: 602.6, b: 605.4, img: F + "969edb70.jpg", out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 605.4, b: 608.4, img: F + "808f1d48.jpg", out: { type: "whip", vx: 1 } },
  { a: 608.4, b: 611.19, img: F + "a7595ce1.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.35], out: { type: "white", d: 0.4 } },
  { a: 611.19, b: 614.5, img: F + "d2754894.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 614.5, b: 617.83, img: F + "c893cf97.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "flash" } },
  { a: 617.83, b: 621.05, img: F + "49582b34.jpg", out: { type: "dissolve", d: 0.5 } },
  { a: 621.05, b: 624.2, comp: "whole", out: { type: "whip", vx: 1 } },
  { a: 624.2, b: 627.01, v: R + "r4769544", from: 0.5, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 627.01, b: 630.0, v: R + "r4769544", from: 7, rate: 1, out: { type: "sweep", d: 0.5 } },
  { a: 630.0, b: 633.55, comp: "dark", k: "g30", out: { type: "flash" } },
  { a: 634.43, b: 637.64, comp: "split", out: { type: "white", d: 0.4 } },
  { a: 637.64, b: 640.4, v: T + "a06_cambodunum", from: 0.2, out: { type: "dissolve", d: 0.5 } },
  { a: 640.4, b: 643.42, comp: "maq", out: { type: "sweep", d: 0.5 } },
  { a: 643.42, b: 646.4, comp: "feet", out: { type: "white", d: 0.45 } },
  { a: 646.4, b: 651.0, v: R + "r2897281", from: 6, rate: 1, out: { type: "whip", vx: 1 } },
  { a: 651.0, b: 655.0, img: F + "c188e93c.jpg", out: { type: "zoom", fx: 0.4, fy: 0.7 } },
  { a: 655.0, b: 658.3, img: F + "749fe40f.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 658.3, b: 660.38, v: R + "r6937668", from: 1, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 660.38, b: 664.62, v: R + "r2897281", from: 1, rate: 1, out: { type: "flash" } },
  { a: 664.62, b: 666.84, v: R + "r1860683", from: 0.3, rate: 1, out: { type: "dissolve", d: 0.6 } },
  { a: 666.84, b: 675.55, v: T + "a06_cambodunum", from: 4.2, rate: 0.45, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.45] },
];
export const SHOTS10: S10[] = ABS.map((s) => ({ ...s, a: s.a - OFF10, b: s.b - OFF10 }));
export const M10_FRAMES = Math.round((675.55 - OFF10) * FPS);

type V3 = [number, number, number];
const K = (at: number, pos: V3, look: V3, fov = 40): HypoKey => ({ at, pos, look, fov });
const base = (o: Partial<Fase>): Fase => ({ open: 0, gas: 0, flue: 0, glow: 0, room: 0, ...o });
const Clip: React.FC<{ v: string; at: number; from?: number }> = ({ v, at, from = 0 }) => (
  <Sequence from={Math.round(at * FPS)} layout="none">
    <OffthreadVideo src={staticFile(`${v}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={1.25} muted style={{ width: W, height: H, objectFit: "cover" }} />
  </Sequence>
);
// foto real con acercamiento lento (reemplaza un clip que no llegó)
const Pic: React.FC<{ src: string; t: number; a: number }> = ({ src, t, a }) => (
  <Img src={staticFile(src)} style={{ width: W, height: H, objectFit: "cover", transform: `scale(${1.04 + 0.025 * Math.max(0, t - a)})` }} />
);

export const M10: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF10;
  const L = (x: number) => x - OFF10;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "malmap": return <ClayMap t0={L(599.9)} keys={[
        { at: 0, pos: [18, 14, -7], look: [17.1, 0, -15.1], fov: 34 }, { at: 2.8, pos: [17.4, 4.4, -11.2], look: [17.1, 0.6, -15.1], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.6, lon: 19.03, lat: 54.04, label: "MALBORK", sub: "castle of the Teutonic Knights, Poland" }]} />;
      case "whole": return <Hypo3D t0={L(620.85)} keys={[K(0, [6, 4, 9], [0, 1.6, 0], 40), K(3.4, [12, 7, 14], [0, 1.6, 0], 40)]}
        fase={() => base({ gas: 1, glow: 0.8, flue: 1, room: 1 })} title="THE FULL ROMAN IDEA" />;
      case "dark": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1a1c 0%, #070607 75%)" }} />;
      case "split": return <TempSplit t={t} a={L(634.43)} b={L(637.64)}
        left={<><Pic src={F + "25ac89f2.jpg"} t={t} a={L(634.0)} /><TempTag t={t} a={L(634.7)} b={L(637.5)} x={110} y={600} kicker="TODAY" value={30} to={0} /></>}
        right={<><Hypo3D t0={L(634.2)} keys={[K(0, [8, 3, 10], [0, 1.2, 0], 40), K(3.6, [6.5, 2.5, 8.5], [0, 1.2, 0], 40)]} fase={() => base({ gas: 1, glow: 0.8, flue: 1, room: 1 })} />
          <TempTag t={t} a={L(635.1)} b={L(637.5)} x={1240} y={600} kicker="ROME" value="≈ 30" /></>} />;
      case "maq": return <Maqueta t0={L(640.2)} keys={[
        { at: 0, pos: [BATH[0] + 12, 14, BATH[1] + 18], look: [BATH[0], 0, BATH[1]] }, { at: 3.4, pos: [BATH[0] + 26, 34, BATH[1] + 40], look: [BATH[0] - 2, 0, BATH[1]] },
      ]} ring={{ at: 0.5, out: 3.0, x: BATH[0], z: BATH[1], label: "BEFORE AD 100", sub: "working in Alpine valleys" }} />;
      case "feet": return <Hypo3D t0={L(643.2)} keys={[K(0, [4, 4.2, 6], [-1, 1.2, 0], 44), K(3.2, [2.6, 3.2, 4.6], [-1, 1.2, 0], 44)]}
        fase={() => base({ gas: 1, glow: 1, room: 1, open: 0 })}
        labels={[{ at: 0.6, out: 3.0, x: -0.5, y: PH + 0.42, z: 1.2, text: "UNDER YOUR FEET", sub: "the best place to store heat", side: "r" }]} />;
    }
    return null;
  };
  const cur = SHOTS10.find((s) => t >= s.a && t < s.b);
  const SNOWY = new Set([T + "f07_malbork", T + "k01_hanok", T + "k03_final"]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS10.map((s, i) => <ShotLayer key={i} S={SHOTS10} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && SNOWY.has(cur.v) && <Snow t={t} n={90} wind={0.4} op={0.6} />}
        <BigWord t={ta} a={598.8} b={600.05} text="EXCEPTIONS" />
        <Place t={ta} a={605.6} b={608.3} text="A CHAMBER OF STONES" sub="heated until they glowed" />
        <Place t={ta} a={608.6} b={611.0} text="WARM AIR" sub="released through openings in the floor" />
        <Term t={ta} a={611.4} b={614.4} words={[{ la: "KACHELOFEN", en: "THE TILED STOVE", at: 613.0 }]} y={150} />
        <Place t={ta} a={614.7} b={617.7} text="THE SAME PRINCIPLE" />
        <RadiantWaves t={ta} a={618.0} b={621.0} sides={["l", "r"]} />
        <Place t={ta} a={618.2} b={620.9} text="STORE THE HEAT IN MASS" sub="and let it out slowly" />
        <Place t={ta} a={624.4} b={626.9} text="REINVENTED" />
        <Place t={ta} a={627.2} b={629.9} text="UNDERFLOOR HEATING" />
        {cur?.k === "g30" && <DialGauge t={ta} a={630.05} b={633.5} value={30} max={50} band={[26, 32]} caption="A MODERN HEATED FLOOR" sub="around 30 °C" from={8} />}
        <Place t={ta} a={637.8} b={640.3} text="STILL CATCHING UP" />
        <Place t={ta} a={646.6} b={650.9} text="KOREA" sub="smoke from one kitchen fire under every room" />
        <Term t={ta} a={660.6} b={664.5} words={[{ la: "ONDOL", en: "WARM STONE", at: 662.0 }]} y={150} />
        <Place t={ta} a={664.8} b={666.7} text="OUR NEXT VIDEO" />
        <Carved t={ta} a={667.0} b={675.4} text="OLD TECH LAB" sub="THANK YOU FOR WATCHING" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
