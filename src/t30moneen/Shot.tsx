// t30moneen — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (D:/rtmp_t30moneen/tools/mkplan.py, anclado a las palabras).
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
    case "split": return <K.DiagSplit d={d} l={p.l} r={p.r} wl={p.wl} wr={p.wr} a={p.a} />;
    case "wall": return <K.WallScene d={d} mode={p.mode} o={o} cues={p.cues} />;
    case "cast": return <K.CastScene d={d} focus={p.focus} o={o} />;
    case "house": return <K.HouseScene d={d} mode={p.mode} o={o} say={p.say} sayAt={p.sayAt} />;
    case "scribe": return <K.ScribeScene d={d} mode={p.mode} o={o} cue={p.cue} />;
    case "pay": return <K.PayScene d={d} mode={p.mode} o={o} cues={p.cues} />;
    case "purse": return <K.PurseScene d={d} mode={p.mode} p0={p.p0} p1={p.p1} o={o} owner={p.owner} />;
    case "ten": return <K.TenCoins d={d} mode={p.mode} o={o} />;
    case "creep": return <K.CreepBars d={d} mode={p.mode} o={o} />;
    case "sort": return <K.SortScene d={d} mode={p.mode} o={o} />;
    case "cage": return <K.CageMap d={d} mode={p.mode} o={o} />;
    case "army": return <K.CoinArmy d={d} mode={p.mode} o={o} />;
    case "tree": return <K.CoinTree d={d} gens={p.gens} years={p.years} o={o} />;
    case "cross": return <K.CrossLines d={d} o={o} />;
    case "voyage": return <K.VoyageMap d={d} mode={p.mode} o={o} />;
    case "glass": return <K.GlassScene d={d} mode={p.mode} at={p.at} o={o} />;
    case "expert": return <K.AskExpert d={d} mode={p.mode} cues={p.cues} o={o} />;
    case "rodan": return <K.RodanScene d={d} mode={p.mode} cues={p.cues} o={o} />;
    case "tokens": return <K.TokenBox d={d} mode={p.mode} cues={p.cues} o={o} />;
    case "q3": return <K.Questions3 d={d} cues={p.cues} o={o} />;
    case "balance": return <K.Balance d={d} l={p.l} r={p.r} tip={p.tip} o={o} />;
    case "home": return <K.HomeScene d={d} mode={p.mode} o={o} />;
    case "age": return <K.AgeScene d={d} mode={p.mode} o={o} />;
    case "stairs": return <K.SkillStairs d={d} o={o} />;
    case "virtues": return <K.Virtues d={d} cues={p.cues} o={o} />;
    case "roster": return <K.RuleTablet d={d} active={p.active} final={p.final} caption={p.caption} o={o} hot={p.hot} />;
    case "quote": return <K.QuoteTablet d={d} lines={p.lines} o={o} a={p.a} />;
    case "book": return <K.BookCover d={d} mode={p.mode} o={o} />;
    case "word": return <K.WordCard d={d} o={o} tone={p.tone} />;
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
