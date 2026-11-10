import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import { Biombo } from "./escenas";

export const TOTAL_FRAMES_PEGGY01 = TOTAL;
const T = 8; // frames de transición

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.biombo) return <Biombo src={s.src} marks={s.biombo.marks} labels={s.biombo.labels} title={s.biombo.title} titleAt={s.biombo.titleAt} serif={P.FONTS.SERIF} dur={dur} />;
  if (s.album) return <Q.Album src={s.src} under={s.under} seed={s.id + 1} dur={dur} />; // foto de época como objeto
  if (s.k === "C" && s.comp === "recap") return <Q.RecapGrid items={s.items} cards={CARDS} bg={s.bgv || s.bg} endAt={s.endAt} dur={dur} />;
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />; // foto animada con Veo (primer cuadro)
  if (s.k === "W" || s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

// entrada del plano: corte seco, fundido o empuje lateral
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
  const d = o.dur;
  switch (o.type) {
    case "lower": return <P.LowerThird title={o.title} sub={o.sub} dur={d} />;
    case "place": return <P.Place text={o.text} jp={o.jp} dur={d} />;
    case "kinetic": return <P.Kinetic lines={o.lines} accent={o.accent} dur={d} />;
    case "quote": return <P.Quote text={o.text} who={o.who} dur={d} />;
    case "clock": return <P.Clock h={o.h} m={o.m} label={o.label} dur={d} />;
    case "tag": return <P.Tag text={o.text} left={o.left} dur={d} />;
    case "stat": return <P.Stat title={o.title} lines={o.lines} foot={o.foot} dur={d} />;
    case "greet": return <P.Greet jp={o.jp} ro={o.ro} en={o.en} low={o.low} dur={d} />;
    case "ring": return <P.Ring secs={o.secs} label={o.label} left={o.left} dur={d} />;
    case "drops": return <P.Drops n={o.n} label={o.label} marks={o.marks} dur={d} />;
    case "layers": return <P.Layers marks={o.marks} labels={o.labels} dur={d} />;
    case "price": return <P.Price big={o.big} sub={o.sub} to={o.to} prefix={o.prefix} left={o.left} dur={d} />;
    case "chips": return <P.Chips items={o.items} marks={o.marks} left={o.left} dur={d} />;
    case "stroke": return <P.Stroke a={o.a} b={o.b} times={o.times} dur={d} />;
    case "carousel": return <Q.Carousel cards={CARDS} bg={o.bg} marks={o.marks} subAt={o.subAt} dur={d} />;
    case "scene": return <Q.StepScene n={o.n} title={o.title} src={o.src} dur={d} />;
    case "progress": return <Q.Progress n={o.n} title={o.title} dur={d} />;
    case "split": return <Q.SplitPhoto src={o.src} seed={o.seed} dur={d} />;
    case "polaroid": return <Q.Polaroid src={o.src} caption={o.caption} seed={o.seed} left dur={d} />;
    case "map": return <Q.MapJP a={o.a} b={o.b} la={o.la} ja={o.ja} lb={o.lb} jb={o.jb} dur={d} />;
    case "cta": return <Q.CTA text={o.text} cards={CARDS} dur={d} />;
    default: return null;
  }
};

export const MainPeggy01: React.FC = () => (
  <AbsoluteFill style={{ background: P.C.ink }}>
    {/* capa 1: avatar (ventanas visibles) */}
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
    {/* capa 2: material (fotos animadas, fotos, componentes) */}
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
    {/* capa 3: gráficos */}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    {/* audio: voz + piano premezclados, SFX por debajo (el audio final se rearma en local) */}
    <Audio src={staticFile("peggy01_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
