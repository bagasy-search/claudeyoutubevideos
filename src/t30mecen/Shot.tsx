// t30mecen — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (D:/rtmp_t30mecen/tools/mkplan.py, anclado a las palabras).
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
    case "street": return <K.Street d={d} mode={p.mode} at={p.at} o={o} />;
    case "porch": return <K.Porch d={d} mode={p.mode} at={p.at} o={o} />;
    case "kitchen": return <K.Kitchen d={d} mode={p.mode} at={p.at} ats={p.ats} bubbles={p.bubbles} o={o} />;
    case "table": return <K.TableFive d={d} mode={p.mode} at={p.at} o={o} />;
    case "waiting": return <K.Waiting d={d} o={o} />;
    case "years": return <K.Years d={d} o={o} />;
    case "route": return <K.Route40 d={d} mode={p.mode} o={o} />;
    case "fall": return <K.FallNight d={d} o={o} />;
    case "kids": return <K.Kids d={d} o={o} lines={p.lines} at={p.at} ats={p.ats} mode={p.mode} hl={p.hl} />;
    case "hosp": return <K.Hospital d={d} mode={p.mode} o={o} />;
    case "tracks": return <K.Tracks d={d} o={o} />;
    case "env": return <K.Envelope d={d} mode={p.mode} at={p.at} o={o} />;
    case "will": return <K.WillPage d={d} hl={p.hl} o={o} />;
    case "letter": return <K.Letter d={d} lines={p.lines} hl={p.hl} head={p.head} at={p.at} per={p.per} o={o} />;
    case "willmap": return <K.WillMap d={d} at={p.at} o={o} />;
    case "office": return <K.Office d={d} mode={p.mode} at={p.at} o={o} />;
    case "memory": return <K.Memory d={d} mode={p.mode} at={p.at} o={o} />;
    case "tl": return <K.Timeline d={d} idx={p.idx} o={o} />;
    case "key": return <K.KeyCard d={d} at={p.at} o={o} />;
    case "list": return <K.Checklist d={d} items={p.items} at={p.at} o={o} />;
    case "word": return <K.WordCard d={d} o={o} tone={p.tone} />;
    case "split": return <K.DiagSplit d={d} l={p.l} r={p.r} wl={p.wl} wr={p.wr} a={p.a} />;
    case "ask": return <K.AskCard d={d} q={p.q} bell={p.bell !== false} o={o} />;
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
