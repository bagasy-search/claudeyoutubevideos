// apex05 · MINUTO 1 (0–64,36 s) — tráiler: aldea de India → el oso que se para → carga → "no es el grizzly" → las 8 especies → el ranking.
// Planos a mano sobre la voz (frases.txt). Real: Pexels + Wikimedia Commons (osos perezosos de verdad).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Stamp, CaseCard, StrikeList, BearLineup, Letterbox, Flash } from "./comps";

const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
export const SHOTS: S2[] = [
  { a: 0, b: 1.3, v: R + "india_5488124", from: 2.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.55], out: { type: "whip", vx: 1 } },
  { a: 1.3, b: 2.6, v: R + "india_16479564", from: 1.0, out: { type: "cut" } },
  { a: 2.6, b: 3.66, v: R + "india_5461700", from: 1.0, cam: [1.05, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "flash" } },
  { a: 3.66, b: 5.2, v: R + "india_4443826", from: 1.0, out: { type: "cut" } },
  { a: 5.2, b: 6.8, v: T + "a01_night_path", from: 1.0, out: { type: "cut" } },
  { a: 6.8, b: 8.2, v: R + "india_5468036", from: 1.0, grade: "brightness(.75) saturate(.8)", out: { type: "cut" } },
  { a: 8.2, b: 9.48, v: R + "india_30262329", from: 1.0, grade: "brightness(.7) saturate(.75)", out: { type: "zoom", fx: 0.5, fy: 0.45 } },
  { a: 9.48, b: 10.9, img: F + "sloth_65e2329d.jpg", cam: [1.05, 0.55, 0.6, 1.4, 0.55, 0.6], out: { type: "cut" } },
  { a: 10.9, b: 12.3, img: F + "sloth_2495815d.jpg", cam: [1.1, 0.5, 0.6, 1.45, 0.48, 0.6], out: { type: "flash" } },
  { a: 12.3, b: 14.3, v: T + "a02_sloth_rise", from: 1.0, out: { type: "cut" } },
  { a: 14.3, b: 15.6, img: F + "sloth_ed421eff.jpg", cam: [1.15, 0.5, 0.45, 1.3, 0.5, 0.45], out: { type: "cut" } },
  { a: 15.6, b: 16.7, img: F + "sloth_8344d240.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 16.7, b: 17.62, img: F + "sloth_712853c4.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "cut" } },
  { a: 17.62, b: 18.98, v: T + "a36_sloth_face", from: 1.0, out: { type: "flash" } },
  { a: 18.98, b: 20.4, v: T + "a03_sloth_charge", from: 1.0, out: { type: "whip", vx: 1 } },
  { a: 20.4, b: 21.7, img: F + "sloth_369d99a6.jpg", cam: [1.1, 0.3, 0.6, 1.4, 0.3, 0.6], out: { type: "cut" } },
  { a: 21.7, b: 23.2, img: F + "sloth_8d6e686f.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "cut" } },
  { a: 23.2, b: 24.46, img: F + "sloth_02b7f534.jpg", cam: [1.1, 0.6, 0.5, 1.3, 0.6, 0.5], out: { type: "white", d: 0.3 } },
  { a: 24.46, b: 25.62, v: R + "india_11842225", from: 1.0, out: { type: "cut" } },
  { a: 25.62, b: 26.9, v: R + "india_29505573", from: 1.0, out: { type: "cut" } },
  { a: 26.9, b: 28.2, v: R + "india_15405845", from: 1.0, out: { type: "cut" } },
  { a: 28.2, b: 29.6, img: F + "sloth_53b53069.jpg", cam: [1.05, 0.6, 0.6, 1.2, 0.6, 0.6], out: { type: "cut" } },
  { a: 29.6, b: 31.0, img: F + "sloth_f62ebff2.jpg", cam: [1.2, 0.55, 0.45, 1.05, 0.55, 0.5], out: { type: "cut" } },
  { a: 31.0, b: 32.4, img: F + "sloth_874a0088.jpg", cam: [1.05, 0.4, 0.5, 1.25, 0.4, 0.5], out: { type: "flash" } },
  { a: 32.4, b: 33.5, v: R + "brown_10740608", from: 1.0, out: { type: "cut" } },
  { a: 33.5, b: 34.74, v: R + "brown_8152698", from: 1.0, out: { type: "flash" } },
  { a: 34.74, b: 37.6, comp: "lineup", out: { type: "cut" } },
  { a: 37.6, b: 38.8, v: R + "brown_18855413", from: 1.0, out: { type: "cut" } },
  { a: 38.8, b: 40.1, v: R + "polar_37108112", from: 1.0, out: { type: "whip", vx: -1 } },
  { a: 40.1, b: 41.3, v: R + "panda_31671421", from: 1.0, out: { type: "cut" } },
  { a: 41.3, b: 42.7, v: R + "panda_13039682", from: 1.0, out: { type: "cut" } },
  { a: 42.7, b: 44.0, v: R + "andean_5237469", from: 1.0, cam: [1.2, 0.45, 0.65, 1.35, 0.45, 0.65], out: { type: "cut" } },
  { a: 44.0, b: 45.6, v: R + "sun_36767649", from: 1.0, out: { type: "flash" } },
  { a: 45.6, b: 47.0, img: F + "sloth_331c06a4.jpg", cam: [1.0, 0.5, 0.4, 1.15, 0.5, 0.4], out: { type: "cut" } },
  { a: 47.0, b: 48.4, img: F + "sloth_48a891eb.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 48.4, b: 49.8, v: R + "india_12108855", from: 1.0, out: { type: "cut" } },
  { a: 49.8, b: 51.0, img: F + "sloth_ff99d0a9.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 51.0, b: 52.22, img: F + "sloth_d8b11ca1.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "white", d: 0.3 } },
  { a: 52.22, b: 55.4, comp: "rank", out: { type: "cut" } },
  { a: 55.4, b: 57.0, v: T + "a37_india_dawn", from: 1.0, out: { type: "cut" } },
  { a: 57.0, b: 58.6, v: R + "brown_18856388", from: 1.0, out: { type: "cut" } },
  { a: 58.6, b: 60.04, v: R + "polar_37187236", from: 1.0, k: "not", out: { type: "cut" } },
  { a: 60.04, b: 61.7, v: R + "brown_7612155", from: 1.0, k: "not", out: { type: "flash" } },
  { a: 61.7, b: 64.36, v: T + "sloth_0cf24eb0", from: 0.0, k: "rec", grade: "brightness(.55) sepia(.3)" },
];

export const M1: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const renderComp = (s: Shot) => {
    if (s.comp === "lineup") return <>
      <Img src={staticFile(F + "sloth_65d12fb8.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.35) blur(3px)", transform: `scale(${1.08 + 0.03 * (t - 34.74)})` }} />
      <BearLineup t={t} a={34.74} b={37.65} mv="truck" title="8 SPECIES · THAT'S ALL" />
    </>;
    if (s.comp === "rank") return <>
      <Img src={staticFile(F + "sloth_6e41cc6b.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)", transform: `scale(${1.08 + 0.03 * (t - 52.22)})` }} />
      <BearLineup t={t} a={52.22} b={55.45} mv="push" showRank mystery={1} title="FROM HARMLESS TO DEADLY" />
    </>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={t} a={0.2} b={3.6} text="Central India" sub="just after dark" />
        <Place t={t} a={3.9} b={9.4} text="The same path" sub="a thousand times" />
        <BigWord t={t} a={14.4} b={15.55} text="SHAGGY" size={210} />
        <BigWord t={t} a={15.65} b={16.65} text="BLACK" size={230} />
        <BigWord t={t} a={16.75} b={17.6} text="NOT VERY BIG" size={170} />
        <BigWord t={t} a={17.7} b={18.9} text="NO ROAR" red size={210} />
        <Flash t={t} at={[19.0, 19.5]} />
        <BigWord t={t} a={21.8} b={23.15} text="3-INCH CLAWS" sub="as long as a human finger" red size={170} />
        <BigWord t={t} a={24.55} b={25.55} text="HE SURVIVES" size={170} />
        <Place t={t} a={25.8} b={28.1} text="Many do" sub="in this part of the world" />
        <BigWord t={t} a={28.4} b={32.3} text="MORE ATTACKS" sub="than almost any other bear on Earth" red size={170} />
        <Stamp t={t} a={33.0} b={34.65} text="NOT THE GRIZZLY" x={W / 2} y={H / 2 + 40} size={120} />
        <Place t={t} a={37.75} b={40.0} text="Heavier than a small car" sub="some of them" />
        <Place t={t} a={40.25} b={42.6} text="Almost only plants" sub="some of them" />
        <BigWord t={t} a={42.9} b={45.5} text="NEVER KILLED A PERSON" sub="some of them" size={140} />
        <Place t={t} a={45.8} b={49.7} text="The one most people never heard of" sub="India · Sri Lanka · Nepal" />
        <BigWord t={t} a={49.9} b={52.15} text="HUNDREDS" sub="to the hospital · every year" red size={220} />
        <BigWord t={t} a={55.5} b={58.5} text="RANKED" sub="every bear on the planet" size={220} />
        {cur?.k === "not" && <StrikeList t={t} b={61.65} y={330} size={110} items={[{ at: 58.65, text: "BY SIZE", strike: 59.5 }, { at: 60.1, text: "BY LOOKS", strike: 60.9 }]} />}
        {cur?.k === "rec" && <CaseCard t={t} a={61.75} b={64.36} title="THE ATTACK RECORDS" x={1060} y={130}
          rows={[{ at: 62.0, k: "BROWN BEAR · 2000–2015", v: "664 attacks" }, { at: 62.4, k: "BLACK BEAR · 1900–2009", v: "63 killed" },
            { at: 62.8, k: "POLAR BEAR · 1870–2014", v: "73 attacks" }, { at: 63.2, k: "SLOTH BEAR · INDIA", v: "1,700+ attacks", red: true }]}
          stamp={{ at: 63.6, text: "CASE FILE" }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M1_FRAMES = Math.round(64.36 * FPS);
