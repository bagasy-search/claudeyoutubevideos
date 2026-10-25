// t30monees — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (D:/rtmp_t30monees/tools/mkplan.py, anclado a las palabras).
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
    case "tablilla": return <K.Tablilla d={d} active={p.active} final={p.final} intro={p.intro} o={o} />;
    case "wall": return <K.WallScene d={d} mode={p.mode} names={p.names} o={o} />;
    case "book": return <K.BookScene d={d} mode={p.mode} o={o} />;
    case "street": return <K.StreetScene d={d} mode={p.mode} o={o} />;
    case "scribe": return <K.ScribeScene d={d} mode={p.mode} o={o} />;
    case "payall": return <K.PayAll d={d} o={o} />;
    case "ten": return <K.TenCoins d={d} o={o} fill0={p.fill0} />;
    case "creep": return <K.CreepChart d={d} o={o} />;
    case "wants": return <K.WantsScene d={d} o={o} />;
    case "list": return <K.ListScene d={d} o={o} />;
    case "still": return <K.StillCoins d={d} o={o} />;
    case "army": return <K.CoinArmy d={d} o={o} />;
    case "tree": return <K.CoinTree d={d} o={o} gens={p.gens} />;
    case "cross": return <K.CrossChart d={d} o={o} />;
    case "map": return <K.VoyageMap d={d} o={o} ship={p.ship} />;
    case "glass": return <K.GlassReveal d={d} crack={p.crack} o={o} />;
    case "askwho": return <K.AskWho d={d} o={o} at={p.at} />;
    case "safe": return <K.SafeScale d={d} o={o} />;
    case "house": return <K.HouseScene d={d} mode={p.mode} o={o} />;
    case "life": return <K.LifeRoad d={d} o={o} />;
    case "stairs": return <K.SkillStairs d={d} o={o} />;
    case "four": return <K.FourCards d={d} at={p.at} o={o} />;
    case "walk": return <K.WalkHome d={d} o={o} b1={p.b1} b2={p.b2} />;
    case "onecoin": return <K.OneCoin d={d} o={o} />;
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
