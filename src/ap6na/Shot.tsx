// ap6na — de un plano del edl.json (t = tipo, p = props) al componente. Tiempos del plan (D:/rtmp_ap6na/tools/spec.py, anclado a las palabras).
// El cuerpo arranca DESPUÉS del cold open (COLD cuadros): los tiempos del edl son del cuerpo (0 = primera palabra de la narración).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import * as K from "./comp";
import { Uniq } from "./uniq";
import EDL from "./edl.json";

export const S = (s: number) => Math.round(s * 30);
export type ShotT = { a: number; b: number; k: string; t: string; p?: any; sfx?: string; big?: boolean };
export const SHOTS: ShotT[] = (EDL as any).shots;
export const END: number = (EDL as any).end;

export const Shot: React.FC<{ s: ShotT }> = ({ s }) => {
  const d = S(s.b) - S(s.a), p = s.p || {}, o = p.o || {};
  switch (s.t) {
    case "real": return <K.RealShot v={p.v} d={d} o={o} z={p.z} pos={p.pos} from={p.from} rate={p.rate} />;
    case "arch": return <K.Arch v={p.v} d={d} ar={p.ar} year={p.year} o={o} side={p.side} />;
    case "cards": return <K.Cards bg={p.bg} cards={p.cards} o={o} />;
    case "map": return <K.PinMap d={d} at={p.at} prev={p.prev} lines={p.lines} hot={p.hot} name={p.name} />;
    case "u": return <Uniq n={p.n} d={d} p={p} o={o} />;
    case "word": return <K.WordCard d={d} o={o} tone={p.tone} bg={p.bg} />;
    case "split": return <K.DiagSplit d={d} l={p.l} r={p.r} wl={p.wl} wr={p.wr} a={p.a} />;
    case "ask": return <K.AskCard d={d} q={p.q} bell={p.bell} o={o} bg={p.bg} />;
    case "black": return <AbsoluteFill style={{ background: "#000" }} />;
    default: return <AbsoluteFill style={{ background: "#300" }} />;
  }
};

// un minuto del cuerpo: los planos que EMPIEZAN en [m0, m0+60)
export const Minute: React.FC<{ n: number }> = ({ n }) => {
  const m0 = (n - 1) * 60;
  return (
    <AbsoluteFill>
      {SHOTS.filter((s) => s.a >= m0 && s.a < m0 + 60).map((s, i) => (
        <Sequence key={i} from={S(s.a) - S(m0)} durationInFrames={S(s.b) - S(s.a)}><Shot s={s} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
