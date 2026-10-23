// t30duraen — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (tools/mkplan.py, anclado a las palabras).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import * as K from "./comp";
import EDL from "./edl.json";

export const S = (s: number) => Math.round(s * 30);
export type ShotT = { a: number; b: number; k: string; t: string; p?: any; sfx?: string; big?: boolean };
export const SHOTS: ShotT[] = (EDL as any).shots;
export const STOPS: { n: number; a: number; q: number; w0: number; w1: number; b: number; fin: number | null; tag: string }[] = (EDL as any).stops;
export const END: number = (EDL as any).end;

export const Shot: React.FC<{ s: ShotT }> = ({ s }) => {
  const d = S(s.b) - S(s.a), p = s.p || {}, o = p.o || {};
  switch (s.t) {
    case "real": return <K.RealShot v={p.v} d={d} o={o} z={p.z} pos={p.pos} from={p.from} rate={p.rate} />;
    case "arch": return <K.Arch v={p.v} d={d} ar={p.ar} year={p.year} o={o} side={p.side} />;
    case "cards": return <K.Cards bg={p.bg} cards={p.cards} o={o} />;
    case "roster": return <K.JobRoster active={p.active} final={p.final} caption={p.caption} />;
    case "map": return <K.PinMap d={d} at={p.at} prev={p.prev} lines={p.lines} hot={p.hot} name={p.name} />;
    case "watch": return <K.Watch d={d} fz={p.fz} fin={p.fin} tag={p.tag} sub={p.sub} s0={p.s0} />;
    case "chimney": return <K.ChimneyScene d={d} mode={p.mode} o={o} />;
    case "portal": return <K.PortalScene d={d} years={p.years} o={o} />;
    case "rome": return <K.RomeScene d={d} mode={p.mode} o={o} />;
    case "village": return <K.VillageScene d={d} mode={p.mode} o={o} />;
    case "trench": return <K.TrenchScene d={d} o={o} />;
    case "flea": return <K.FleaScene d={d} o={o} />;
    case "gong": return <K.GongPit d={d} mode={p.mode} o={o} />;
    case "nightcart": return <K.NightCart d={d} o={o} gate={p.gate} />;
    case "galley": return <K.GalleyScene d={d} speed={p.speed} ramp={p.ramp} o={o} zoomChain={p.zoomChain} />;
    case "ship": return <K.ShipDecks d={d} mode={p.mode} o={o} />;
    case "match": return <K.MatchScene d={d} mode={p.mode} fines={p.fines} o={o} />;
    case "jaw": return <K.JawXray d={d} o={o} />;
    case "strike": return <K.StrikeScene d={d} o={o} />;
    case "radium": return <K.RadiumScene d={d} mode={p.mode} o={o} />;
    case "ecg": return <K.EcgScene d={d} cut={p.cut} o={o} dim={p.dim} />;
    case "pond": return <K.PondScene d={d} mode={p.mode} n0={p.n0} o={o} />;
    case "third": return <K.ThirdGrid d={d} o={o} />;
    case "timeline": return <K.Timeline100 d={d} o={o} />;
    case "coin": return <K.CoinFlip d={d} img={p.img} o={o} />;
    case "scale": return <K.PayScale d={d} o={o} l={p.l} r={p.r} />;
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

// el HUD del cronómetro: corre en cada parada (se esconde mientras está el reloj grande) y queda congelado en rojo hasta el final de la parada
export const Huds: React.FC = () => (
  <>
    {STOPS.map((st) => (
      <Sequence key={st.n} from={S(st.a)} durationInFrames={S(st.b) - S(st.a)}>
        <K.Hud n={st.n} tq={S(st.q) - S(st.a)} fin={st.fin} tag={st.tag} hide={[S(st.w0) - S(st.a), S(st.w1) - S(st.a)]} />
      </Sequence>
    ))}
  </>
);
