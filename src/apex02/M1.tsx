// apex02 · MINUTO 1 (0–56,13 s) — el tráiler: amanecer, la cascabel enroscada, la mordida en milisegundos,
// algo que se acerca, la revelación ("It's a bird."), la pelea en flash-forward y la ficha del sujeto.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, W } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, ThermalDefs, Letterbox, NoList } from "./comps";
import { StrikeClock, CaseFile, Lock, WeighIn, Dust } from "./compsA";

export const R = "apex02/real/", P = "apex02/px/r", A = "apex02/t2v/";
type S2 = Shot & { k?: string };
export const SHOTS1: S2[] = [
  { a: 0, b: 1.25, v: A + "r48_strike_side", from: 3.0, rate: 0.625, out: { type: "flash" } },
  { a: 1.25, b: 2.3, v: P + "17806511", from: 2.0, out: { type: "dissolve", d: 0.3 } },
  { a: 2.3, b: 3.5, v: P + "9010493", from: 1.0, out: { type: "whip", vx: 1 } },
  { a: 3.5, b: 4.9, v: R + "c07", from: 44.2, cam: [1.25, 0.42, 0.45, 1.45, 0.42, 0.45], out: { type: "zoom", fx: 0.42, fy: 0.45 } },
  { a: 4.9, b: 6.3, v: A + "r01_coiled_dawn", from: 0.5, out: { type: "whip", vx: -1 } },
  { a: 6.3, b: 7.6, v: P + "4000749", from: 2.0, out: { type: "zoom", fx: 0.45, fy: 0.35 } },
  { a: 7.6, b: 8.8, v: A + "r18_pits", from: 1.0, out: { type: "flash" } },
  { a: 8.8, b: 10.16, v: A + "r01_coiled_dawn", from: 7.0, out: { type: "white", d: 0.3 } },
  { a: 10.16, b: 11.6, v: R + "c09", from: 1.6, rate: 0.625, k: "clock", out: { type: "cut" } },
  { a: 11.6, b: 13.02, v: A + "r48_strike_side", from: 6.5, rate: 0.625, k: "clock", out: { type: "flash" } },
  { a: 13.02, b: 14.68, v: A + "r21_rattle", from: 1.0, out: { type: "whip", vy: 1 } },
  { a: 14.68, b: 16.1, v: P + "7963035", from: 3.0, out: { type: "zoom", fx: 0.6, fy: 0.5 } },
  { a: 16.1, b: 17.7, v: R + "c06", from: 0.5, cam: [1.1, 0.4, 0.75, 1.3, 0.38, 0.8], out: { type: "whip", vx: 1 } },
  { a: 17.7, b: 19.36, v: A + "r47_scent", from: 1.0, out: { type: "flash" } },
  { a: 19.36, b: 20.75, v: A + "r46_feet", from: 0.5, out: { type: "whip", vx: -1 } },
  { a: 20.75, b: 22.14, v: A + "r08_tracks", from: 1.0, out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 22.14, b: 23.28, v: A + "r02_walk_toward", from: 0.5, grade: "brightness(.55) contrast(1.2) saturate(.8)", k: "weigh", out: { type: "cut" } },
  { a: 23.28, b: 24.42, v: A + "r02_walk_toward", from: 1.64, grade: "brightness(.55) contrast(1.2) saturate(.8)", k: "weigh", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 24.42, b: 25.9, v: P + "30341759", from: 2.0, grade: "brightness(.7) contrast(1.1)", out: { type: "whip", vx: 1 } },
  { a: 25.9, b: 27.6, v: P + "2985896", from: 4.0, out: { type: "whip", vx: -1 } },
  { a: 27.6, b: 28.61, v: A + "r02_walk_toward", from: 6.0, grade: "brightness(.5) contrast(1.25)", cam: [1.1, 0.5, 0.75, 1.5, 0.5, 0.8], out: { type: "cut" } },
  { a: 28.61, b: 29.61, v: A + "r02_walk_toward", from: 7.01, grade: "brightness(.5) contrast(1.25)", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 29.61, b: 30.04, img: "apex02/negro.png", out: { type: "cut" } },
  { a: 30.04, b: 30.9, v: R + "c01", from: 2.4, out: { type: "whip", vx: 1 } },
  { a: 30.9, b: 31.84, v: R + "c03", from: 2.0, cam: [1.0, 0.5, 0.5, 1.2, 0.35, 0.62], out: { type: "cut" } },
  { a: 31.84, b: 32.77, v: R + "c03", from: 2.94, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
  { a: 32.77, b: 34.2, v: A + "r15_circle", from: 1.0, out: { type: "whip", vx: -1 } },
  { a: 34.2, b: 35.6, v: A + "r04_slam", from: 0.5, out: { type: "cut" } },
  { a: 35.6, b: 37.0, v: A + "r17_miss", from: 2.0, rate: 0.625, out: { type: "flash" } },
  { a: 37.0, b: 38.6, v: A + "r04_slam", from: 5.0, out: { type: "whip", vy: -1 } },
  { a: 38.6, b: 39.78, v: A + "r44_swallow", from: 1.0, out: { type: "cut" } },
  { a: 39.78, b: 40.97, v: A + "r44_swallow", from: 2.18, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 40.97, b: 42.6, v: A + "r16_cape", from: 2.4, out: { type: "whip", vx: 1 } },
  { a: 42.6, b: 43.75, v: A + "r05_tail_hang", from: 0.5, out: { type: "cut" } },
  { a: 43.75, b: 44.9, v: A + "r05_tail_hang", from: 1.65, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "cut" } },
  { a: 44.9, b: 46.0, v: A + "r05_tail_hang", from: 6.5, cam: [1.15, 0.5, 0.55, 1.35, 0.55, 0.6], out: { type: "cut" } },
  { a: 46.0, b: 47.1, v: A + "r05_tail_hang", from: 7.6, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: -1 } },
  { a: 47.1, b: 48.36, v: R + "c01", from: 38.0, out: { type: "cut" } },
  { a: 48.36, b: 49.61, v: R + "c01", from: 39.26, cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "sweep", d: 0.5 } },
  { a: 49.61, b: 50.91, v: R + "c01", from: 12.0, k: "file", cam: [1.05, 0.6, 0.5, 1.15, 0.65, 0.5], out: { type: "cut" } },
  { a: 50.91, b: 52.2, v: R + "c01", from: 13.3, k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 52.2, b: 53.9, v: A + "r03_sprint", from: 1.0, k: "file", out: { type: "whip", vx: 1 } },
  { a: 53.9, b: 55.02, v: A + "r63_post", from: 0.5, k: "file", out: { type: "cut" } },
  { a: 55.02, b: 56.13, v: A + "r63_post", from: 1.62, k: "file", cam: [1.22, 0.5, 0.45, 1.28, 0.5, 0.45], out: { type: "flash" } },
];
export const M1_END = 56.13;
const DUSTY = new Set([A + "r02_walk_toward", A + "r08_tracks", A + "r46_feet", P + "30341759"]);

export const M1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const cur = SHOTS1.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {!farm && <Audio src={staticFile("apex02_mix.wav")} />}
      {SHOTS1.map((s, i) => <ShotLayer key={i} S={SHOTS1} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && DUSTY.has(cur.v) && <Dust t={t} n={70} />}
        <Place t={t} a={0.3} b={2.25} text="SONORAN DESERT" sub="Arizona · first light" />
        <Lock t={t} a={4.1} b={6.25} x={640} y={330} w={560} h={380} label="WESTERN DIAMONDBACK" sub="Crotalus atrox" red />
        <StrikeClock t={t} a={10.25} b={14.6} ms={100} blinkAt={13.1} />
        <BigWord t={t} a={15.0} b={16.0} text="VENOM" hot />
        <Place t={t} a={17.9} b={19.3} text="INTENSIVE CARE" sub="for a grown man" />
        <BigWord t={t} a={19.6} b={21.9} text="SOMETHING IS COMING" y={420} />
        {cur?.k === "weigh" && <WeighIn t={t} a={22.2} b={24.4} from={220} to={540} unit="g" caption="BODY WEIGHT" sub="less than a can of soup" />}
        <NoList t={t} b={29.55} items={[{ at: 24.6, text: "NO ARMOR" }, { at: 25.9, text: "NO THICK HIDE" }, { at: 27.4, text: "NO IMMUNITY" }]} />
        <BigWord t={t} a={30.06} b={30.9} text="A BIRD." />
        <BigWord t={t} a={31.0} b={32.7} text="A CUCKOO" hot />
        <Place t={t} a={34.3} b={35.55} text="BY THE HEAD" />
        <Place t={t} a={37.1} b={38.55} text="AGAINST A ROCK" />
        <Place t={t} a={39.0} b={40.9} text="SWALLOWED WHOLE" />
        <Place t={t} a={45.0} b={47.0} text="ONE INCH AT A TIME" />
        {cur?.k === "file" && <CaseFile t={t} a={49.7} b={56.1} num="02" name="GREATER ROADRUNNER" latin="Geococcyx californianus · the ground cuckoo"
          rows={[{ at: 51.0, k: "FAMILY", v: "CUCKOOS" }, { at: 52.2, k: "TOP SPEED", v: "~20 MPH" }, { at: 53.4, k: "VENOM IMMUNITY", v: "NONE", hot: true }, { at: 54.6, k: "THE CARTOON", v: "WRONG" }]} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
void W;
