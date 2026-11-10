import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as E from "./Escenas";

export const TOTAL_FRAMES_DEE01 = TOTAL;
const T = 8; // frames de transición

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.album) return <Q.Album src={s.src} under={s.under} seed={s.id + 1} dur={dur} />; // foto antigua como objeto
  if (s.k === "C" && s.comp === "recap") return <Q.RecapGrid items={s.items} cards={CARDS} bg={s.bgv || s.bg} dur={dur} />;
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />; // foto animada con Veo (primer cuadro)
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} />;
  if (s.k === "W" || s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  if (s.k === "C" && s.comp === "shopping") return <P.Shopping items={s.items} bg={s.bg} dur={dur} />;
  if (s.k === "C" && s.comp === "recap") return <P.Recap items={s.items} bg={s.bg} dur={dur} />;
  return null;
};

// entrada del plano: corte seco, fundido o empuje lateral
const Enter: React.FC<{ trans: string; dur: number; children: React.ReactNode; seed: number }> = ({ trans, dur, children, seed }) => {
  const f = useCurrentFrame();
  const o = 1;
  if (trans === "fade") return <AbsoluteFill style={{ opacity: Math.min(interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }), o) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = P.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)`, opacity: o }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "lower": return <P.LowerThird title={o.title} sub={o.sub} dur={d} />;
    case "place": return <P.Place text={o.text} jp={o.jp} dur={d} />;
    case "kinetic": return <P.Kinetic lines={o.lines} accent={o.accent} dur={d} />;
    case "quote": return <P.Quote text={o.text} dur={d} />;
    case "habit": return <P.HabitCard n={o.n} title={o.title} dur={d} />;
    case "clock": return <P.Clock h={o.h} m={o.m} label={o.label} night={o.night} dur={d} />;
    case "tag": return <P.Tag text={o.text} dur={d} />;
    case "gauge": return <P.Gauge pct={o.pct} jp={o.jp} label={o.label} dur={d} />;
    case "counter": return <P.Counter to={o.to} suffix={o.suffix} label={o.label} dur={d} />;
    case "stat": return <P.Stat head={o.head} title={o.title} lines={o.lines} foot={o.foot} dur={d} />;
    case "route": return <P.Route a={o.a} b={o.b} dur={d} />;
    case "thermo": return <P.Thermo deg={o.deg} label={o.label} sub={o.sub} subAt={o.subAt} dur={d} />;
    case "seasons": return <P.Seasons marks={o.marks} items={o.items} dur={d} />;
    case "letter": return <P.Letter lines={o.lines} at2={o.at2} dur={d} />;
    case "timer": return <P.Timer min={o.min} tickAt={o.tickAt} label={o.label} dur={d} />;
    case "greet": return <P.Greet jp={o.jp} en={o.en} dur={d} />;
    case "three": case "ticket": return <P.Three head={o.head} items={o.items} marks={o.marks} dur={d} />;
    case "soft": return <P.Soft text={o.text} dur={d} />;
    case "carousel": return <Q.Carousel cards={CARDS} bg={o.bg} subAt={o.subAt} sub={o.sub} dur={d} />;
    case "scene": return <Q.HabitScene n={o.n} title={o.title} src={o.src} dur={d} />;
    case "progress": return <Q.Progress n={o.n} title={o.title} dur={d} />;
    case "split": return <Q.SplitPhoto src={o.src} seed={o.seed} dur={d} />;
    case "polaroid": return <Q.Polaroid src={o.src} caption={o.caption} seed={o.seed} dur={d} />;
    case "map": return <Q.MapJP a={o.a} b={o.b} la={o.la} ja={o.ja} lb={o.lb} jb={o.jb} dur={d} />;
    case "escena": { const K = (E as any)[o.name]; return K ? <K dur={d} {...o} /> : null; }
    case "cta": return <Q.CTA text={o.text} cards={CARDS} dur={d} />;
    default: return null;
  }
};

export const MainDee01: React.FC = () => (
  <AbsoluteFill style={{ background: P.C.ink }}>
    {/* capa 1: avatar (ventanas visibles) */}
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
    {/* capa 2: material (clips reales, fotos, componentes) */}
    {SHOTS.map((s, i) => {
      if (s.k === "A") return null;
      // si el plano siguiente entra con fundido/empuje sobre material (no avatar), este se queda T frames debajo
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} dur={s.dur} seed={s.id}><ShotBody s={s} dur={s.dur} /></Enter>
        </Sequence>
      );
    })}
    <P.Grade />
    {/* capa 3: gráficos */}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    {/* audio: voz + piano premezclados, SFX por debajo */}
    <Audio src={staticFile("dee01_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
