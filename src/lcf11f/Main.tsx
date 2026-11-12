import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as L from "./Lor";

export const TOTAL_FRAMES_LCF11F = TOTAL;
const T = 8; // frames de transición

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    switch (s.c) {
      case "card": return <L.RecipeCard kicker={s.kicker} title={s.title} lines={s.lines} img={s.img} photo={s.photo} dur={dur} seed={s.id} />;
      case "book": return <L.BookPage src={s.src} qr={s.qr} qrFrom={s.qrFrom} label={s.label} cover={s.cover} bg={s.bg} dur={dur} seed={s.id} />;
      case "chapter": return <L.Chapter kicker={s.kicker} title={s.title} bg={s.bg} dur={dur} seed={s.id} />;
      case "scene": return <Q.HabitScene n={s.n} title={s.title} src={s.src} dur={dur} />;
      case "carousel": return <Q.Carousel cards={CARDS} bg={s.bg} subAt={s.subAt} sub={s.sub} dur={dur} />;
      case "recap": return <Q.RecapGrid items={s.items} cards={CARDS} bg={s.bg} dur={dur} />;
      case "cta": return <AbsoluteFill><P.Photo src={s.bg} seed={s.id} dur={dur} /><Q.CTA text={s.text} cards={CARDS} dur={dur} /></AbsoluteFill>;
      case "lista": return <L.Lista head={s.head} title={s.title} items={s.items} bg={s.bg} cols={s.cols} dur={dur} seed={s.id} />;
      default: return null;
    }
  }
  if (s.album) return <Q.Album src={s.src} seed={s.id + 1} dur={dur} />;
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} volume={0.1} />;
  if (s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
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
    case "cta": return <Q.CTA text={o.text} cards={CARDS} dur={d} />;
    default: return null;
  }
};

export const MainLcf11f: React.FC = () => (
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
    {/* audio: voz premezclada (sin música); SFX y sonido real de los clips por debajo */}
    <Audio src={staticFile("lcf11f_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
