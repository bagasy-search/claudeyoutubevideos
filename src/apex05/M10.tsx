// apex05 · MINUTO 10 (563,51–627,65 s) — pardo: hacerse el muerto con la madre, pelear si sigue; ¿por qué no #1? → "dos osos negros" → #2 oso negro asiático: la luna en el pecho, de Irán a Japón, la crisis japonesa (AF2023: 219 / 6).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, CaseCard, StrikeList, RankCard, BearLineup, Letterbox } from "./comps";
import { GeoMap } from "./GeoMap";

export const OFF10 = 563.51, END10 = 627.65;
const R = "apex05/real/", F = "apex05/foto/", T = "apex05/t2v/";
type S2 = Shot & { k?: string };
const ABS: S2[] = [
  { a: 563.51, b: 566.0, v: T + "brown_a1e51a7c", from: 0.0, k: "flat", out: { type: "cut" } },
  { a: 566.0, b: 568.5, v: T + "brown_b9eb925d", from: 0.0, k: "flat", out: { type: "cut" } },
  { a: 568.5, b: 571.0, v: R + "brown_7505572", from: 1.0, k: "flat", out: { type: "cut" } },
  { a: 571.0, b: 573.41, v: T + "brown_3a143830", from: 0.0, k: "flat", out: { type: "cut" } },
  { a: 573.41, b: 576.0, v: T + "brown_e6fe9ad7", from: 0.0, out: { type: "cut" } },
  { a: 576.0, b: 578.59, v: T + "brown_11d75f2b", from: 0.0, out: { type: "cut" } },
  { a: 578.59, b: 580.31, img: F + "brown_4ba164c5.jpg", cam: [1.1, 0.5, 0.45, 1.3, 0.5, 0.4], out: { type: "flash" } },
  { a: 580.31, b: 582.41, v: R + "brown_37414231", from: 3.0, out: { type: "cut" } },
  { a: 582.41, b: 585.0, v: R + "leis_6291857", from: 1.0, out: { type: "cut" } },
  { a: 585.0, b: 587.6, v: R + "brown_16837912", from: 1.0, out: { type: "cut" } },
  { a: 587.6, b: 590.3, comp: "map1", out: { type: "cut" } },
  { a: 590.3, b: 592.93, v: T + "brown_d1f114eb", from: 0.0, out: { type: "white", d: 0.3 } },
  { a: 592.93, b: 595.0, img: F + "moon_f8f02b59.jpg", cam: [1.04, 0.5, 0.5, 1.16, 0.5, 0.5], out: { type: "cut" } },
  { a: 595.0, b: 596.63, img: F + "sloth_3085bf85.jpg", cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "cut" } },
  { a: 596.63, b: 598.61, comp: "two", out: { type: "flash" } },
  { a: 598.61, b: 601.59, img: F + "moon_1f35db6b.jpg", k: "rank", cam: [1.0, 0.7, 0.4, 1.1, 0.7, 0.4], out: { type: "cut" } },
  { a: 601.59, b: 604.0, img: F + "moon_f10f2dde.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.55], out: { type: "cut" } },
  { a: 604.0, b: 606.13, img: F + "moon_5db80bbe.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.55], out: { type: "cut" } },
  { a: 606.13, b: 610.0, comp: "map2", out: { type: "cut" } },
  { a: 610.0, b: 613.63, v: R + "moon_3552378", from: 1.0, out: { type: "cut" } },
  { a: 613.63, b: 617.37, comp: "japan", out: { type: "cut" } },
  { a: 617.37, b: 620.0, v: T + "a11_moon_town", from: 1.0, k: "fy23", out: { type: "cut" } },
  { a: 620.0, b: 622.6, img: F + "sign_337ee31d.jpg", k: "fy23", cam: [1.0, 0.4, 0.5, 1.1, 0.4, 0.5], out: { type: "cut" } },
  { a: 622.6, b: 624.97, v: T + "moon_70cf0c0f", from: 0.0, k: "fy23", out: { type: "cut" } },
  { a: 624.97, b: 627.65, v: T + "a12_moon_persimmon", from: 1.0, k: "fy23" },
];
const SHOTS: S2[] = ABS.map((s) => ({ ...s, a: s.a - OFF10, b: s.b - OFF10 }));
const L = (x: number) => x - OFF10;

export const M10: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF10;
  const renderComp = (s: Shot) => {
    if (s.comp === "map1") return <GeoMap m="wd" t0={L(587.6)} keys={[
      { at: 0, pos: [-4, 44, 24], look: [-4, 0, -6], fov: 34 },
      { at: 2.7, pos: [0, 40, 20], look: [0, 0, -6], fov: 34 },
    ]} pins={[{ at: 0.1, lon: -110, lat: 45, label: "USA", ring: false }, { at: 0.4, lon: -120, lat: 58, label: "CANADA", ring: false }, { at: 0.7, lon: 25, lat: 46, label: "ROMANIA", ring: false },
      { at: 1.0, lon: 90, lat: 62, label: "RUSSIA", ring: false }, { at: 1.3, lon: 35, lat: 39, label: "TURKEY", ring: false }, { at: 1.6, lon: 142.5, lat: 43.5, label: "JAPAN", ring: false }]} />;
    if (s.comp === "two") return <>
      <Img src={staticFile(F + "moon_2dba4f43.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", filter: "brightness(.3) blur(3px)" }} />
      <BearLineup t={ta} a={596.65} b={598.65} showRank set={[2, 1]} setAt={596.9} title="AND BOTH ARE BLACK" />
    </>;
    if (s.comp === "map2") return <GeoMap m="wd" t0={L(606.13)} ranges={[{ at: 0.2, color: "#d7d7d7", pts: [[52, 32], [70, 36], [80, 32], [90, 28], [100, 30], [110, 35], [125, 40], [132, 45], [138, 43], [140, 38], [130, 34], [120, 28], [110, 22], [100, 20], [92, 24], [80, 28], [66, 30]] }]} keys={[
      { at: 0, pos: [12, 26, 16], look: [14, 0, -4], fov: 34 },
      { at: 3.9, pos: [20, 22, 12], look: [21, 0, -5], fov: 34 },
    ]} lines={[{ at: 0.4, d: 2.8, pts: [[53, 32], [70, 34], [84, 29], [105, 33], [127.5, 37], [138, 37]], color: "#c8a26a" }]}
      pins={[{ at: 0.4, lon: 53, lat: 32, label: "IRAN", ring: false }, { at: 1.2, lon: 84, lat: 29, label: "HIMALAYAS", ring: false }, { at: 2.0, lon: 105, lat: 33, label: "CHINA", ring: false },
        { at: 2.6, lon: 127.5, lat: 37, label: "KOREA", ring: false }, { at: 3.1, lon: 138, lat: 37, label: "JAPAN", ring: false }]} />;
    if (s.comp === "japan") return <GeoMap m="jp" t0={L(613.63)} keys={[
      { at: 0, pos: [0, 58, 46], look: [0, 0, 0], fov: 34 },
      { at: 3.8, pos: [8, 30, 20], look: [11, 0, -5], fov: 34 },
    ]} pins={[{ at: 1.0, lon: 140.5, lat: 39.6, label: "JAPAN", sub: "most attacks: moon bears", ring: true }]} />;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={563.7} b={566.4} text="A mother defending cubs" sub="" />
        {cur?.k === "flat" && <StrikeList t={ta} b={573.35} y={250} size={84} items={[{ at: 566.7, text: "LIE FLAT ON YOUR STOMACH" }, { at: 568.7, text: "HANDS BEHIND YOUR NECK" }, { at: 570.3, text: "LEGS APART" }, { at: 571.4, text: "STAY STILL" }]} />}
        <BigWord t={ta} a={573.6} b={578.5} text="NO LONGER DEFENDING" sub="it keeps biting · it followed you" size={160} />
        <BigWord t={ta} a={578.7} b={580.25} text="THEN YOU FIGHT" red size={200} />
        <BigWord t={ta} a={580.4} b={582.35} text="WHY NOT #1?" size={210} />
        <Place t={ta} a={582.6} b={587.5} text="Most encounters" sub="end without contact" />
        <BigWord t={ta} a={590.4} b={592.85} text="STILL A SMALL NUMBER" sub="of people killed each year" size={150} />
        <Place t={ta} a={593.1} b={596.55} text="Two bears injure even more" sub="where they live" />
        {cur?.k === "rank" && <RankCard t={ta} a={598.7} b={601.55} n={2} name="ASIATIC BLACK BEAR" latin="Ursus thibetanus" danger={9} />}
        <BigWord t={ta} a={601.8} b={606.05} text="MOON BEAR" sub="a white crescent on its chest" size={210} />
        <BigWord t={ta} a={610.2} b={613.55} text="A CRISIS" sub="right now" red size={230} />
        {cur?.k === "fy23" && <CaseCard t={ta} a={617.5} b={627.6} title="JAPAN · FISCAL 2023" x={1060} y={150}
          rows={[{ at: 619.0, k: "ATTACKED", v: "219 people" }, { at: 623.6, k: "KILLED", v: "6", red: true }]} stamp={{ at: 625.2, text: "RECORD" }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M10_FRAMES = Math.round((END10 - OFF10) * FPS);
