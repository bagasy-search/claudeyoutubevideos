import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as E from "./Escenas";
import * as V from "./Solar";

export const TOTAL_FRAMES_CME14D = TOTAL;
const T = 8;

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    const z: any = { dur, seed: s.id, lf0: s.lf0, prev: s.prev };
    switch (s.c) {
      case "paso": return <V.PasoCelda n={s.n} title={s.title} sub={s.sub} img={s.img} {...z} />;
      case "recap": return <V.RecapCelda n={s.n} title={s.title} fact={s.fact} img={s.img} {...z} />;
      case "indice": return <V.IndiceCeldas titles={s.titles} {...z} />;
      case "placa": return <V.Placa rows={s.rows} n={s.n} detail={s.detail} head={s.head} {...z} />;
      case "pantalla": return <V.Pantalla a={s.a} b={s.b} fB={s.fB} verdict={s.verdict} fV={s.fV} {...z} />;
      case "pizarra": return <V.Pizarra head={s.head} lines={s.lines} total={s.total} source={s.source} {...z} />;
      case "curva": return <V.Curva bars={s.bars} head={s.head} total={s.total} {...z} />;
      case "anaquel": return <V.Anaquel head={s.head} rows={s.rows} big={s.big} fBig={s.fBig} old={s.old} fOld={s.fOld} note={s.note} {...z} />;
      case "lamina": return <V.Lamina kicker={s.kicker} big={s.big} sub={s.sub} fSub={s.fSub} tone={s.tone} source={s.source} {...z} />;
      case "corcho": return <V.Corcho text={s.text} who={s.who} kicker={s.kicker} {...z} />;
      case "rueda": return <V.Rueda segs={s.segs} hi={s.hi} label={s.label} foot={s.foot} fFoot={s.fFoot} {...z} />;
      case "termo": return <V.Termo d0={s.d0} d1={s.d1} label={s.label} sub={s.sub} fSub={s.fSub} {...z} />;
      case "brujula": return <V.Brujula mode={s.mode} {...z} />;
      case "relojsol": return <V.RelojSol h={s.h} label={s.label} {...z} />;
      case "caja": return <V.Caja k={s.kk} items={s.items} inner={s.inner} {...z} />;
      case "ciclos": return <V.Ciclos n={s.n} max={s.max} label={s.label} sub={s.sub} {...z} />;
      case "balance": return <V.Balance a={s.a} b={s.b} max={s.max} fB={s.fB} verdict={s.verdict} fV={s.fV} {...z} />;
      case "compresor": return <V.Compresor on={s.on} label={s.label} sub={s.sub} span={s.span} {...z} />;
      case "energia": return <V.Energia mx={s.mx} kwh={s.kwh} sub={s.sub} {...z} />;
      case "tres": return <V.Tres k={s.kk} {...z} />;
      case "guarda": return <V.Guarda k={s.kk} rules={s.rules} {...z} />;
      case "rango": return <V.Rango a={s.a} b={s.b} lo={s.lo} hi={s.hi} unit={s.unit} label={s.label} sub={s.sub} fSub={s.fSub} {...z} />;
      case "mapa": return <V.Mapa place={s.place} sub={s.sub} {...z} />;
      case "recuerdo": return <V.Recuerdo img={s.img} caption={s.caption} {...z} />;
      case "proximo": return <V.ProximoRefri title={s.title} img={s.img} {...z} />;
      case "esc": { const K = (E as any)[s.name]; return K ? <K dur={dur} {...s.props} /> : null; }
      default: return null;
    }
  }
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} volume={0.1} />;
  if (s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

// pieza con línea de tiempo: el mismo componente cambia de estado sin reiniciarse
const TL: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const f = useCurrentFrame();
  let i = 0; for (let j = 0; j < s.tl.length; j++) if (f >= s.tl[j].f) i = j;
  const st = s.tl[i]; const pv = i > 0 ? s.tl[i - 1].p : undefined;
  return <ShotBody s={{ ...s, ...st.p, tl: undefined, lf0: st.f, prev: pv }} dur={dur} />;
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

export const MainCme14d: React.FC = () => (
  <AbsoluteFill style={{ background: "#17181A" }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        {a.still ? <AbsoluteFill><Img src={staticFile(a.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />}
      </Sequence>
    ))}
    {SHOTS.map((s, i) => {
      if (s.k === "A") return null;
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} seed={s.id}>{s.tl ? <TL s={s} dur={s.dur} /> : <ShotBody s={s} dur={s.dur} />}</Enter>
        </Sequence>
      );
    })}
    <P.Grade />
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    <Audio src={staticFile("cme14d_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
