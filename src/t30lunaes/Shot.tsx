// t30lunaes — de un plano del edl.json (t = tipo, p = props) al componente. Los tiempos salen del plan (D:/rtmp_t30lunaes/tools/mkplan_es.py, anclado a las palabras).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import * as K from "./comp";
import EDL from "./edl.json";

export const S = (s: number) => Math.round(s * 30);
export type ShotT = { a: number; b: number; k: string; t: string; p?: any; sfx?: string; big?: boolean };
export const SHOTS: ShotT[] = (EDL as any).shots;
export const STOPS: { a: number; b: number; m0: number; m1: number }[] = (EDL as any).stops;
export const END: number = (EDL as any).end;

export const Shot: React.FC<{ s: ShotT }> = ({ s }) => {
  const d = S(s.b) - S(s.a), p = s.p || {}, o = p.o || {};
  switch (s.t) {
    case "real": return <K.RealShot v={p.v} d={d} o={o} z={p.z} pos={p.pos} from={p.from} rate={p.rate} />;
    case "arch": return <K.Arch v={p.v} d={d} ar={p.ar} year={p.year} o={o} side={p.side} />;
    case "cards": return <K.Cards bg={p.bg} cards={p.cards} o={o} />;
    case "clock": return <K.ClockCard d={d} from={p.frm} to={p.to} idx={p.idx} title={p.title} sub={p.sub} far={p.far} />;
    case "bedroom": return <K.Bedroom d={d} mode={p.mode} at={p.at} o={o} />;
    case "vanish": return <K.MoonVanish d={d} at={p.at} o={o} sea={p.sea} />;
    case "hand": return <K.HandPull d={d} at={p.at} o={o} />;
    case "scale": return <K.ScaleScene d={d} at={p.at} o={o} />;
    case "farm": return <K.FarmSky d={d} at={p.at} mode={p.mode} o={o} />;
    case "laser": return <K.LaserScene d={d} mode={p.mode} o={o} />;
    case "orbits": return <K.Orbits d={d} at={p.at} o={o} />;
    case "bary": return <K.Barycenter d={d} mode={p.mode} at={p.at} o={o} />;
    case "tides": return <K.Tides d={d} mode={p.mode} at={p.at} o={o} />;
    case "slosh": return <K.Slosh d={d} mode={p.mode} o={o} />;
    case "pier": return <K.PierScene d={d} o={o} />;
    case "tidechart": return <K.TideChart d={d} o={o} small={p.small} />;
    case "sunrise": return <K.Sunrise d={d} o={o} />;
    case "calendar": return <K.MoonCalendar d={d} o={o} at={p.at} />;
    case "fundy": return <K.Fundy d={d} mode={p.mode} o={o} />;
    case "plant": return <K.TidalPlant d={d} mode={p.mode} o={o} />;
    case "nights": return <K.DarkNights d={d} o={o} />;
    case "savanna": return <K.Savanna d={d} mode={p.mode} o={o} />;
    case "beetle": return <K.BeetleScene d={d} mode={p.mode} o={o} />;
    case "lookup": return <K.LookUp d={d} mode={p.mode} o={o} />;
    case "eclipse": return <K.Eclipse d={d} mode={p.mode} o={o} />;
    case "eclipsenone": return <K.Eclipse d={d} mode="none" o={o} />;
    case "reef": return <K.Reef d={d} mode={p.mode} o={o} />;
    case "grunion": return <K.Grunion d={d} mode={p.mode} o={o} />;
    case "arctic": return <K.Arctic d={d} mode={p.mode} o={o} />;
    case "port": return <K.PortScene d={d} o={o} />;
    case "board": return <K.Board72 d={d} o={o} />;
    case "daylen": return <K.DayLength d={d} o={o} flat={p.flat} />;
    case "tilt": return <K.TiltTop d={d} mode={p.mode} o={o} />;
    case "myth": return <K.AsteroidMyth d={d} o={o} />;
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

// el HUD de la hora (3:18 AM · T+00:01): corre en cada tramo y se esconde en los relojes grandes, preguntas y tablero
const HIDE = new Set(["clock", "ask", "board", "split"]);
export const Huds: React.FC = () => (
  <>
    {STOPS.map((st, i) => {
      const hide = SHOTS.filter((s) => HIDE.has(s.t) && s.b > st.a && s.a < st.b).map((s) => [S(s.a) - S(st.a), S(s.b) - S(st.a)]);
      return <Sequence key={i} from={S(st.a)} durationInFrames={S(st.b) - S(st.a)}><K.Hud m0={st.m0} m1={st.m1} d={S(st.b) - S(st.a)} hide={hide} /></Sequence>;
    })}
  </>
);
