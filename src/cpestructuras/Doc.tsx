// cpestructuras · dibuja la EDL (edl.json) que arma armar_edl.py desde las escaletas.
// Cada plano viene anclado a la voz (arranque de palabra acentuada o pausa) y trae SU cámara; acá sólo se dibuja.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import * as C from "./comps";
import EDL from "./edl.json";

type S = Shot & { k?: string; props?: Record<string, any> };
type O = { n: string; a: number; b: number; p: Record<string, any> };
const SHOTS = (EDL as any).shots as S[];
const OVERS = (EDL as any).over as O[];
export const DOC_FRAMES = Math.round((EDL as any).end * FPS);

const FULL: Record<string, React.FC<any>> = { GlobeVec: C.GlobeVec, RouteUK: C.RouteUK, CarveDown: C.CarveDown, ObeliskScale: C.ObeliskScale };
const OVER: Record<string, React.FC<any>> = { TonsRoll: C.TonsRoll, Tag: C.Tag, TitleStone: C.TitleStone };

const firstNear = (t: number) => { let lo = 0, hi = SHOTS.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (SHOTS[m].b < t - 2) lo = m + 1; else hi = m; } return lo; };

export const Doc: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const t = useCurrentFrame() / FPS;
  const i0 = firstNear(t), vis: number[] = [];
  for (let i = i0; i < SHOTS.length && SHOTS[i].a < t + 2; i++) vis.push(i);
  const renderComp = (s: Shot) => {
    const x = s as S;
    if (x.comp === "Black") return <AbsoluteFill style={{ background: "#000" }} />;
    const Cm = FULL[x.comp ?? ""]; if (!Cm) return null;
    return <Cm t={t} {...x.props} a={x.props?.a0 ?? x.a} b={x.props?.b0 ?? x.b} />;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("cpestructuras/mix.wav")} />}
      {vis.map((i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {vis.filter((i) => SHOTS[i].out?.type === "mask").map((i) => { const s = SHOTS[i], d = s.out!.d ?? 0.42; return <C.ColumnWipe key={"w" + i} t={t} a={s.b - d / 2 - 0.12} b={s.b + d / 2 + 0.12} dir={s.out!.dir ?? 1} />; })}
        {OVERS.filter((o) => t >= o.a - 0.1 && t <= o.b + 1.0).map((o, j) => { const Cm = OVER[o.n]; return Cm ? <Cm key={j} t={t} a={o.a} b={o.b} {...o.p} /> : null; })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
