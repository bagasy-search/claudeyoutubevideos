// oldtech01v2 · MINUTO 9 (547,35–598,73 s) — por qué se congelaron los castillos: cae Occidente, lo que el sistema necesitaba,
// Bizancio y al-Ándalus lo conservan, el calefactorium de los monjes, la chimenea que se lleva el calor.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Place, ThermalDefs, Embers, Snow, HeatUp, Letterbox } from "./comps";
import { Term } from "./comps2";
import { NeedList } from "./comps3";

export const OFF9 = 547.35;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type S9 = Shot & { k?: string };
const ABS: S9[] = [
  { a: 547.35, b: 549.9, v: T + "f06_castle", from: 4.0, out: { type: "dissolve", d: 0.4 } },
  { a: 549.9, b: 552.29, v: T + "f06_castle", from: 7.5, cam: [1.05, 0.5, 0.5, 1.2, 0.5, 0.4], out: { type: "white", d: 0.4 } },
  { a: 552.29, b: 555.4, v: T + "f01_sack", from: 0, out: { type: "whip", vx: 1 } },
  { a: 555.4, b: 558.47, v: R + "r7294417", from: 0.5, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 558.47, b: 561.0, v: T + "w05_tiles", from: 6.0, grade: "brightness(.7)", out: { type: "whip", vx: -1 } },
  { a: 561.0, b: 563.27, v: R + "r5499340", from: 1, rate: 1, grade: "brightness(.6)", out: { type: "flash" } },
  { a: 563.27, b: 566.5, v: R + "r6666772", from: 7, rate: 1, grade: "brightness(.7)", out: { type: "whip", vx: 1 } },
  { a: 566.5, b: 570.41, v: T + "p03_carts", from: 7.0, grade: "brightness(.7)", out: { type: "dissolve", d: 0.4 } },
  { a: 570.41, b: 572.35, v: R + "r29153312", from: 1, rate: 1, grade: "brightness(.6)", out: { type: "white", d: 0.4 } },
  { a: 572.35, b: 574.3, comp: "constmap", out: { type: "dissolve", d: 0.5 } },
  { a: 574.3, b: 576.67, v: R + "r7304302", from: 0.5, rate: 1, out: { type: "whip", vx: -1 } },
  { a: 576.67, b: 579.2, comp: "andmap", out: { type: "dissolve", d: 0.5 } },
  { a: 579.2, b: 581.9, img: F + "423aec56.jpg", out: { type: "sweep", d: 0.5 } },
  { a: 581.9, b: 586.3, comp: "fade", out: { type: "dissolve", d: 0.5 } },
  { a: 586.3, b: 590.73, v: T + "f05_monks", from: 0, out: { type: "zoom", fx: 0.5, fy: 0.6 } },
  { a: 590.73, b: 593.6, v: T + "f05_monks", from: 5.0, cam: [1.1, 0.5, 0.6, 1.25, 0.5, 0.6], out: { type: "dissolve", d: 0.4 } },
  { a: 593.6, b: 598.73, v: T + "f05_monks", from: 9.0, rate: 0.625, cam: [1.0, 0.5, 0.5, 1.18, 0.5, 0.35] },
];
export const SHOTS9: S9[] = ABS.map((s) => ({ ...s, a: s.a - OFF9, b: s.b - OFF9 }));
export const M9_FRAMES = Math.round((598.73 - OFF9) * FPS);

export const M9: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFF9;
  const L = (x: number) => x - OFF9;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "constmap": return <ClayMap t0={L(572.1)} keys={[
        { at: 0, pos: [37, 14, 18], look: [37, 0, 11], fov: 34 }, { at: 2.4, pos: [37.3, 4.6, 14.4], look: [37, 0.6, 11], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.2, lon: 28.98, lat: 41.01, label: "CONSTANTINOPLA", sub: "los baños calefaccionados siguieron" }]} />;
      case "andmap": return <ClayMap t0={L(576.4)} keys={[
        { at: 0, pos: [-30, 14, 25], look: [-30.6, 0, 17.2], fov: 34 }, { at: 2.8, pos: [-30.4, 4.6, 20.6], look: [-30.6, 0.6, 17.2], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.6, lon: -4.78, lat: 37.88, label: "AL-ÁNDALUS", sub: "los baños mantuvieron viva la idea" }]} />;
      case "fade": return <ClayMap t0={L(581.7)} dark={(u) => Math.min(0.85, Math.max(0, (u - 0.6) / 2.4) * 0.85)} keys={[
        { at: 0, pos: [-6, 34, 26], look: [-6, 0, 0], fov: 34 }, { at: 4.6, pos: [-6, 30, 20], look: [-6, 0, -2], fov: 34 },
      ]} pins={[{ at: 1.0, out: 4.4, lon: 3.0, lat: 48.5, label: "EUROPA OCCIDENTAL", sub: "la idea se apagó" }]} />;
    }
    return null;
  };
  const cur = SHOTS9.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTS9.map((s, i) => <ShotLayer key={i} S={SHOTS9} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v === T + "f06_castle" && <Snow t={t} n={70} wind={0.3} op={0.5} />}
        {cur?.v === T + "f01_sack" && <Embers t={t} n={70} />}
        <Place t={ta} a={547.5} b={552.1} text="¿POR QUÉ SE HELABAN LOS CASTILLOS?" sub="cuando los romanos tenían suelos tibios en los Alpes" />
        <Place t={ta} a={552.5} b={555.3} text="EL SIGLO V" sub="el Imperio de Occidente se desmorona" />
        <NeedList t={ta} a={558.6} b={572.3} title="EL HIPOCAUSTO NECESITABA" strikeAt={571.4} items={[
          { at: 558.9, text: "CONSTRUCTORES EXPERTOS", ico: "brick" }, { at: 563.6, text: "LEÑA CONSTANTE", ico: "wood" },
          { at: 566.6, text: "MANO DE OBRA, A TODA HORA", ico: "hand" }, { at: 570.5, text: "DUEÑOS RICOS", ico: "coin" }]} />
        <Term t={ta} a={586.6} b={590.6} words={[{ la: "CALEFACTORIUM", en: "LA ÚNICA SALA TIBIA", at: 588.4 }]} y={150} />
        <Place t={ta} a={590.9} b={593.5} text="HOGARES ABIERTOS" sub="calentando solo lo que tienen enfrente" />
        <HeatUp t={ta} a={593.8} b={598.6} x={900} label="POR LA CHIMENEA" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
