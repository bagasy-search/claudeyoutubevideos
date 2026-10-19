// cpciudades · VIDEO ENTERO: dibuja la EDL (edl.json) que sale de las escaletas a mano (E:/videos/cpciudades/edl/*.esc → armar_edl.py).
// Cada plano está anclado a la palabra exacta de la voz; acá sólo se dibuja: planos, mapas, componentes y overlays.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { GeoFly } from "./GeoFly";
import { BigWord, Place, Counter, ThermalDefs, Embers, Snow, Letterbox } from "./comps";
import { EmberForm } from "./comps3";
import * as D from "./dis";
import EDL from "./edl.json";

type S = Shot & { k?: string; props?: Record<string, any> };
type O = { n: string; a: number; b: number; p: Record<string, any> };
const SHOTS = (EDL as any).shots as S[];
const OVERS = (EDL as any).over as O[];
export const DOC_FRAMES = Math.round((EDL as any).end * FPS);

const FULL: Record<string, React.FC<any>> = {
  ArchFrame: D.ArchFrame, Liquefy: D.Liquefy, Density: D.Density, Balance: D.Balance, Column: D.Column, LogScale: D.LogScale,
  Race: D.Race, Strata: D.Strata, Sonar: D.Sonar, Profile: D.Profile, IceCap: D.IceCap, Plates: D.Plates, RainCols: D.RainCols,
  TenRoofs: D.TenRoofs, Heights: D.Heights, Cell: D.Cell, Gaiola: D.Gaiola,
};
const OVER: Record<string, React.FC<any>> = {
  BigWord, Place, Counter, EmberForm, Clock: D.Clock, Stopwatch: D.Stopwatch, Timeline: D.Timeline, Fraction: D.Fraction,
  Waver: D.Waver, GlowWord: D.GlowWord,
};

// primer plano que todavía puede estar en pantalla en t (búsqueda binaria sobre a)
const firstNear = (t: number) => { let lo = 0, hi = SHOTS.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (SHOTS[m].b < t - 2) lo = m + 1; else hi = m; } return lo; };

export const Doc: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const t = useCurrentFrame() / FPS;
  const i0 = firstNear(t), vis: number[] = [];
  for (let i = i0; i < SHOTS.length && SHOTS[i].a < t + 2; i++) vis.push(i);
  const renderComp = (s: Shot) => {
    const x = s as S;
    if (x.comp === "GeoFly") return <GeoFly t={t} {...(x.props as any)} />;
    if (x.comp === "Black") return <AbsoluteFill style={{ background: "#000" }} />;
    const C = FULL[x.comp ?? ""]; if (!C) return null;
    return <C t={t} a={x.a} b={x.b} {...x.props} />;
  };
  const cur = SHOTS[vis.find((i) => t >= SHOTS[i].a && t < SHOTS[i].b) ?? 0];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {!farm && <Audio src={staticFile("cpciudades/voz.wav")} />}
      {vis.map((i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v && /sp_04|li_04\.4|he_02\.5|he_02\.6/.test(cur.v + "." + (cur as any).src) && <Embers t={t} n={50} />}
        {cur?.v && /sp_01\.6|ar_01\.3|ar_01\.4|he_02\.2/.test((cur as any).src ?? "") && <Snow t={t} n={90} wind={0.25} op={0.55} />}
        {OVERS.filter((o) => t >= o.a - 0.1 && t <= o.b + 1.0).map((o, j) => { const C = OVER[o.n]; return C ? <C key={j} t={t} a={o.a} b={o.b} {...o.p} /> : null; })}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
