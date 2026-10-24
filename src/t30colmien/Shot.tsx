// t30colmien — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (tools/mkplan.py, anclado a las palabras).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import * as K from "./comp";
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
    case "river": return <K.RiverScene d={d} mode={p.mode} o={o} />;
    case "score": return <K.Scoreboard d={d} upto={p.upto} active={p.active} verdict={p.verdict} o={o} />;
    case "weigh": return <K.WeighScene d={d} o={o} />;
    case "prey": return <K.PreyRange d={d} o={o} />;
    case "jaw": return <K.JawXray d={d} mode={p.mode} o={o} />;
    case "skin": return <K.SkinCut d={d} o={o} />;
    case "neck": return <K.NeckScene d={d} mode={p.mode} o={o} />;
    case "rivercut": return <K.RiverCut d={d} mode={p.mode} o={o} />;
    case "race": return <K.RaceScene d={d} o={o} />;
    case "pod": return <K.PodScene d={d} mode={p.mode} o={o} />;
    case "sweat": return <K.SweatScene d={d} mode={p.mode} o={o} />;
    case "budget": return <K.BudgetScene d={d} mode={p.mode} o={o} />;
    case "home": return <K.PrideHome d={d} mode={p.mode} o={o} />;
    case "wins": return <K.WinCards d={d} active={p.active} o={o} />;
    case "pin": return <K.AfricaPin d={d} at={p.at} lines={p.lines} name={p.name} hot={p.hot} area={p.area} />;
    case "dots": return <K.AfricaDots d={d} o={o} />;
    case "math": return <K.MathScale d={d} o={o} />;
    case "ecg": return <K.EcgScene d={d} cut={p.cut} o={o} dim={p.dim} />;
    case "word": return <K.WordCard d={d} o={o} tone={p.tone} />;
    case "split": return <K.DiagSplit d={d} l={p.l} r={p.r} wl={p.wl} wr={p.wr} a={p.a} />;
    case "ask": return <K.AskCard d={d} q={p.q} bell={p.bell} o={o} />;
    case "black": return <AbsoluteFill style={{ background: "#000" }} />;
    default: return <AbsoluteFill style={{ background: "#300" }} />;
  }
};

// un minuto del video: los planos que EMPIEZAN en [m0, m0+60) (pueden pasarse del minuto: la Sequence de afuera no corta)
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
