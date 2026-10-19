// apex05 · MINUTO 8 (439,50–498,23 s) — #4 oso negro: el estudio de 2011 (63 muertos, 59 incidentes), depredador y no defensa, casi siempre macho, desde 1960, el raro que decide que sos comida, pelear y no hacerse el muerto.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, CaseCard, StrikeList, SourceCard, Fraction, TimeRail, Crowd, Letterbox } from "./comps";

export const OFF8 = 439.5, END8 = 498.23;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 439.5, b: 442.2, img: F + "black_b77ad459.jpg", k: "study", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 442.2, b: 444.8, v: R + "black_857097", from: 1.0, k: "study", out: { type: "cut" } },
  { a: 444.8, b: 447.76, img: F + "black_a50c32c1.jpg", k: "study", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 447.76, b: 451.22, comp: "count", out: { type: "cut" } },
  { a: 451.22, b: 454.24, v: R + "black_38866051", from: 0.5, out: { type: "cut" } },
  { a: 454.24, b: 457.72, img: F + "black_a3619bf1.jpg", k: "def", cam: [1.04, 0.6, 0.5, 1.16, 0.6, 0.5], out: { type: "flash" } },
  { a: 457.72, b: 459.6, img: F + "black_65e925b9.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 459.6, b: 461.38, img: F + "black_72cbf26a.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.55, 0.5], out: { type: "cut" } },
  { a: 461.38, b: 463.4, img: F + "black_281722e0.jpg", k: "male", cam: [1.04, 0.3, 0.5, 1.16, 0.3, 0.5], out: { type: "cut" } },
  { a: 463.4, b: 465.26, img: F + "black_51e22c09.jpg", k: "male", cam: [1.04, 0.3, 0.5, 1.16, 0.3, 0.5], out: { type: "white", d: 0.3 } },
  { a: 465.26, b: 468.0, v: R + "black_6968181", from: 1.0, k: "since", out: { type: "cut" } },
  { a: 468.0, b: 470.4, v: R + "black_6920815", from: 1.0, k: "since", out: { type: "cut" } },
  { a: 470.4, b: 472.58, img: F + "black_22edb4fe.jpg", k: "since", cam: [1.1, 0.5, 0.6, 1.4, 0.5, 0.65], out: { type: "cut" } },
  { a: 472.58, b: 475.0, v: T + "black_d21fd283", from: 0.0, out: { type: "cut" } },
  { a: 475.0, b: 477.13, img: F + "black_9e730bf1.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "flash" } },
  { a: 477.13, b: 479.4, v: T + "a20_black_trash", from: 1.0, out: { type: "cut" } },
  { a: 479.4, b: 481.45, img: F + "black_82d76e06.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "cut" } },
  { a: 481.45, b: 485.25, v: R + "black_27644073", from: 9.0, out: { type: "cut" } },
  { a: 485.25, b: 487.2, img: F + "black_2f48656e.jpg", k: "fight", cam: [1.05, 0.6, 0.5, 1.2, 0.6, 0.5], out: { type: "cut" } },
  { a: 487.2, b: 488.95, img: F + "black_ea6b9834.jpg", k: "fight", cam: [1.05, 0.6, 0.5, 1.2, 0.6, 0.5], out: { type: "cut" } },
  { a: 488.95, b: 490.7, img: F + "black_55c5bcde.jpg", k: "fight", cam: [1.1, 0.6, 0.4, 1.3, 0.62, 0.38], out: { type: "cut" } },
  { a: 490.7, b: 492.37, img: F + "black_11270f78.jpg", k: "fight", cam: [1.05, 0.6, 0.5, 1.2, 0.6, 0.5], out: { type: "flash" } },
  { a: 492.37, b: 495.4, img: F + "black_50069658.jpg", k: "dead", cam: [1.04, 0.35, 0.5, 1.16, 0.35, 0.5], out: { type: "cut" } },
  { a: 495.4, b: 498.23, v: T + "black_08c3dd44", from: 0.0, k: "dead" },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF8, b: s.b - OFF8 }));

export const M8: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF8;
  const renderComp = (s: Shot) => {
    if (s.comp === "count") return <><Img src={staticFile(F + "black_86968005.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.32) blur(4px)" }} /><Crowd t={ta} a={447.8} b={451.25} n={63} cols={13} label="AT LEAST 63 KILLED · 59 INCIDENTS" /></>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.k === "study" && <SourceCard t={ta} a={439.7} b={447.7} kicker="HERRERO ET AL. · 2011" title="Every fatal black bear attack" sub="North America · 1900–2009" x={1060} y={260} />}
        <BigWord t={ta} a={451.4} b={454.15} text="A SURPRISE" sub="for many people" size={200} />
        {cur?.k === "def" && <StrikeList t={ta} b={457.65} y={330} size={110} items={[{ at: 454.4, text: "DEFENDING", strike: 456.0 }]} />}
        <BigWord t={ta} a={457.9} b={461.3} text="A PREDATOR" sub="stalking the person as prey" red size={200} />
        {cur?.k === "male" && <Fraction t={ta} a={461.5} b={465.2} n={10} red={9} label="PREDATORY ATTACKS · ALMOST ALWAYS A MALE" />}
        {cur?.k === "since" && <TimeRail t={ta} a={465.4} b={472.5} ev={[{ at: 465.6, y: "1900", text: "the study starts" }, { at: 467.3, y: "1960", text: "most deaths come after" }, { at: 469.6, y: "TODAY", text: "more people in bear country" }]} />}
        <BigWord t={ta} a={472.8} b={477.05} text="EASIEST TO SCARE AWAY" sub="usually" size={150} />
        <BigWord t={ta} a={477.3} b={479.3} text="YOU ARE FOOD" red size={210} />
        <BigWord t={ta} a={479.5} b={481.4} text="IT WILL NOT STOP" size={180} />
        <Place t={ta} a={481.7} b={485.15} text="Experts say something" sub="that sounds strange" />
        {cur?.k === "fight" && <StrikeList t={ta} b={492.3} y={280} size={100} items={[{ at: 485.4, text: "FIGHT BACK" }, { at: 489.0, text: "HIT THE FACE" }, { at: 490.2, text: "AND THE NOSE" }]} />}
        {cur?.k === "dead" && <CaseCard t={ta} a={492.5} b={498.15} title="PLAY DEAD?" x={1060} y={150}
          rows={[{ at: 493.0, k: "MOTHER GRIZZLY", v: "may work" }, { at: 495.6, k: "PREDATORY BLACK BEAR", v: "can be fatal", red: true }]} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M8_FRAMES = Math.round((END8 - OFF8) * FPS);
