// t30tornies — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (D:/rtmp_t30tornies/tools/mkplan.py, anclado a las palabras).
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
    case "cards": return <K.Cards bg={p.bg} cards={p.cards} o={o} />;
    case "gate": return <K.GateRow d={d} mode={p.mode} o={o} />;
    case "copy": return <K.Copycat d={d} o={o} />;
    case "board": return <K.ReasonBoard d={d} n={p.n ?? 0} all={p.all} at={p.at} o={o} />;
    case "sun": return <K.SunRoof d={d} mode={p.mode} at={p.at} o={o} />;
    case "car": return <K.CarTest d={d} mode={p.mode} at={p.at} o={o} />;
    case "cool": return <K.CoolCabin d={d} mode={p.mode} o={o} />;
    case "multi": return <K.Multiply d={d} at={p.at} o={o} />;
    case "xray": return <K.XRayFuse d={d} mode={p.mode} o={o} />;
    case "rules": return <K.ColorRules d={d} o={o} />;
    case "rule": return <K.RuleBook d={d} at={p.at} o={o} />;
    case "stack": return <K.PaintStack d={d} mode={p.mode} o={o} />;
    case "seesaw": return <K.PaintSeesaw d={d} o={o} />;
    case "takeoff": return <K.Takeoff d={d} mode={p.mode} o={o} />;
    case "polish": return <K.Polish d={d} mode={p.mode} o={o} />;
    case "walk": return <K.Walkaround d={d} o={o} />;
    case "lupa": return <K.Magnify d={d} mode={p.mode} find={p.find} o={o} />;
    case "lease": return <K.LeaseMap d={d} o={o} />;
    case "lessor": return <K.Lessor d={d} o={o} />;
    case "hdays": return <K.HangarDays d={d} o={o} />;
    case "tail": return <K.TailSwap d={d} o={o} />;
    case "fade": return <K.FadeYears d={d} mode={p.mode} o={o} />;
    case "patch": return <K.PatchMatch d={d} o={o} />;
    case "phangar": return <K.PaintHangar d={d} o={o} />;
    case "mask": return <K.Masking d={d} o={o} />;
    case "strip": return <K.Strip d={d} mode={p.mode} o={o} />;
    case "steps": return <K.PaintSteps d={d} o={o} />;
    case "weeks": return <K.Weeks d={d} o={o} />;
    case "black": return <K.BlackJet d={d} mode={p.mode} o={o} />;
    case "win": return <K.WindowTease d={d} o={o} />;
    case "word": return <K.WordCard d={d} o={o} tone={p.tone} />;
    case "split": return <K.DiagSplit d={d} l={p.l} r={p.r} wl={p.wl} wr={p.wr} a={p.a} />;
    case "ask": return <K.AskCard d={d} q={p.q} bell={p.bell !== false} o={o} />;
    case "fadeblack": return <AbsoluteFill style={{ background: "#000" }} />;
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
