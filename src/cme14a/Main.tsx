import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as E from "./Escenas";
import * as M from "./Mendoza";

export const TOTAL_FRAMES_CME14A = TOTAL;
const T = 8;

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    const z = { dur, seed: s.id };
    switch (s.c) {
      case "paso": return <M.PasoCard n={s.n} title={s.title} sub={s.sub} img={s.img} {...z} />;
      case "cuaderno": return <M.Cuaderno head={s.head} lines={s.lines} total={s.total} source={s.source} {...z} />;
      case "ticket": return <M.Ticket head={s.head} lines={s.lines} total={s.total} fTotal={s.fTotal} note={s.note} {...z} />;
      case "medidor": return <M.Medidor reads={s.reads} label={s.label} sub={s.sub} fSub={s.fSub} {...z} />;
      case "aviso": return <M.Aviso kicker={s.kicker} big={s.big} sub={s.sub} source={s.source} stamp={s.stamp} fStamp={s.fStamp} tone={s.tone} fSub={s.fSub} {...z} />;
      case "recortes": return <M.Recortes items={s.items} {...z} />;
      case "pregunta": return <M.Pregunta text={s.text} who={s.who} img={s.img} {...z} />;
      case "etiqueta": return <M.Etiqueta n={s.n} items={s.items} detail={s.detail} {...z} />;
      case "bateria": return <M.Bateria p0={s.p0} p1={s.p1} f0={s.f0} f1={s.f1} big={s.big} sub={s.sub} clock={s.clock} day={s.day} {...z} />;
      case "turnos": return <M.Turnos rows={s.rows} hi={s.hi} foot={s.foot} fFoot={s.fFoot} {...z} />;
      case "dos": return <M.Dos a={s.a} b={s.b} fB={s.fB} verdict={s.verdict} fV={s.fV} good={s.good} {...z} />;
      case "recapt": return <M.RecapTira n={s.n} title={s.title} fact={s.fact} img={s.img} {...z} />;
      case "proximo": return <M.Proximo title={s.title} price={s.price} img={s.img} {...z} />;
      case "esc": { const K = (E as any)[s.name]; return K ? <K dur={dur} {...s.props} /> : null; }
      default: return null;
    }
  }
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} volume={0.1} />;
  if (s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = P.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  if (o.type === "lower") return <P.LowerThird title={o.title} sub={o.sub} dur={o.dur} />;
  return null;
};

export const MainCme14a: React.FC = () => (
  <AbsoluteFill style={{ background: "#17181A" }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        {a.still ? <AbsoluteFill><Img src={staticFile(a.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />}
      </Sequence>
    ))}
    {(() => { const L = AVATAR[AVATAR.length - 1]; const fin = L.from + L.dur; return fin < TOTAL ? (
      <Sequence from={fin} durationInFrames={TOTAL - fin}>
        <Freeze frame={L.dur - 1}><Q.AvatarFramed src={L.src} seed={AVATAR.length - 1} dur={L.dur} mods={L.mods} /></Freeze>
      </Sequence>) : null; })()}
    {SHOTS.map((s, i) => {
      if (s.k === "A") return null;
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} seed={s.id}><ShotBody s={s} dur={s.dur} /></Enter>
        </Sequence>
      );
    })}
    <P.Grade />
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    <Audio src={staticFile("cme14a_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
