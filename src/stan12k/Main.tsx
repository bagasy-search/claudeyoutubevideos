import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as E from "./Escenas";
import * as St from "./Stan";

export const TOTAL_FRAMES_STAN12K = TOTAL;
const T = 8; // frames de transición

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    switch (s.c) {
      case "tag": return <St.PriceTag n={s.n} total={12} name={s.name} img={s.img} fName={s.fName} dur={dur} seed={s.id} />;
      case "cow": return <St.CowChart src={s.src} cx={s.cx} cy={s.cy} label={s.label} sub={s.sub} fPin={s.fPin} dur={dur} />;
      case "board": return <St.ChalkBoard head={s.head} lines={s.lines} source={s.source} dur={dur} seed={s.id} />;
      case "pad": return <St.OrderPad rows={s.rows} n={s.n} fScore={s.fScore} dur={dur} seed={s.id} />;
      case "counter": return <St.CounterCard title={s.title} sub={s.sub} dur={dur} seed={s.id} />;
      case "rule": return <St.RuleSheet n={s.n} title={s.title} sub={s.sub} fSub={s.fSub} dur={dur} seed={s.id} />;
      case "recap": return <St.RecapItem n={s.n} total={s.total ?? 0} name={s.name} fact={s.fact} fFact={s.fFact} img={s.img} dur={dur} seed={s.id} big={s.big} />;
      case "notice": return <St.Notice big={s.big} sub={s.sub} source={s.source} dur={dur} seed={s.id} />;
      case "piece": return <St.PieceTray n={s.n} from={s.fromN} imgs={s.imgs} dur={dur} seed={s.id} />;
      case "plates": return <St.PlateCount from={s.fromN} fNums={s.fNums} label={s.label} img={s.img} dur={dur} seed={s.id} />;
      case "receipt": return <St.Receipt head={s.head} lines={s.lines} foot={s.foot} dur={dur} seed={s.id} />;
      case "ask": return <St.AskPaper kicker={s.kicker} text={s.text} img={s.img} dur={dur} seed={s.id} />;
      case "map": return <St.MapChi src={s.src} pins={s.pins} dur={dur} />;
      case "ruletag": return <St.RuleTag img={s.img} big={s.big} sub={s.sub} stamp={s.stamp} fBig={s.fBig} fStamp={s.fStamp} dur={dur} seed={s.id} />;
      case "gram": return <St.GramScale top={s.top} to={s.to} label={s.label} fTop={s.fTop} fRun={s.fRun} dur={dur} seed={s.id} />;
      case "cal": return <St.TearCal days={s.days} fDays={s.fDays} note={s.note} dur={dur} seed={s.id} />;
      case "probe": return <St.ProbeBox label={s.label} from={s.fromV} to={s.to} fHit={s.fHit} note={s.note} dur={dur} seed={s.id} />;
      case "five": return <St.FiveBags n={s.n} text={s.text} dur={dur} seed={s.id} />;
      case "ctags": return <St.CounterTags img={s.img} tags={s.tags} stamp={s.stamp} fStamp={s.fStamp} dur={dur} seed={s.id} />;
      case "tape": return <St.AddTape head={s.head} lines={s.lines} dur={dur} seed={s.id} />;
      case "carousel": return <Q.Carousel cards={CARDS} bg={s.bg} subAt={s.subAt} sub={s.sub} dur={dur} />;
      case "esc": { const K = (E as any)[s.name]; return K ? <K dur={dur} {...s.props} /> : null; }
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
    case "escena": { const K = (E as any)[o.name]; return K ? <K dur={d} {...o} /> : null; }
    case "cta": return <Q.CTA text={o.text} cards={CARDS} dur={d} />;
    default: return null;
  }
};

export const MainStan12k: React.FC = () => (
  <AbsoluteFill style={{ background: P.C.ink }}>
    {/* capa 1: avatar (ventanas visibles) */}
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        {a.still ? <AbsoluteFill><Img src={staticFile(a.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />}
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
    <Audio src={staticFile("stan12k_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
