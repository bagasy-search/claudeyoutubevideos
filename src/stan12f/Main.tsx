import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as B from "./Base";
import * as S from "./Stan";
import * as E from "./Escenas";

export const TOTAL_FRAMES_STAN12F = TOTAL;
const T = 8; // frames de transición

export const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    switch (s.c) {
      case "scene": return <S.TechScene n={s.n} label={s.label} title={s.title} src={s.src} dur={dur} total={s.total} />;
      case "carousel": return <S.Carousel cards={s.cards ?? CARDS} bg={s.bg} head={s.head} sub={s.sub} subAt={s.subAt} dur={dur} />;
      case "card": return <S.Ticket kicker={s.kicker} title={s.title} lines={s.lines} img={s.img} dur={dur} seed={s.id} />;
      case "board": return <E.Board head={s.head} rows={s.rows} foot={s.foot} dur={dur} seed={s.id} />;
      case "src": return <S.Source head={s.head} big={s.big} lines={s.lines} foot={s.foot} bg={s.bg} strike={s.strike} dur={dur} seed={s.id} />;
      case "vs": return <E.Versus a={s.a} la={s.la} b={s.b} lb={s.lb} dur={dur} />;
      case "counter": return <S.Counter kicker={s.kicker} title={s.title} bg={s.bg} dur={dur} seed={s.id} />;
      case "ask": return <S.Ask text={s.text} bg={s.bg} dur={dur} seed={s.id} />;
            case "steps": return <E.Steps stops={s.stops} dur={dur} />;
      case "recap": return <S.Recap cards={s.cards ?? CARDS} items={s.items} bg={s.bg} dur={dur} />;
      case "esc": { const K = (E as any)[s.name]; return K ? <K dur={dur} {...s.props} /> : null; }
      default: return null;
    }
  }
  if (s.album) return <S.Album src={s.src} seed={s.id + 1} dur={dur} />;
  if (s.veo) return <B.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <B.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} />;
  if (s.k === "G") return <B.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

// entrada del plano: corte seco, fundido o empuje lateral
const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = B.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

export const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "tag": return <S.PriceTag text={o.text} dur={d} />;
    case "chalk": return <S.Chalk lines={o.lines} dur={d} />;
    case "tape": return <S.Tape title={o.title} sub={o.sub} dur={d} />;
    case "dial": return <S.Dial deg={o.deg} label={o.label} dur={d} />;
    case "windup": return <S.WindUp min={o.min} label={o.label} dur={d} />;
    case "scale": return <S.Scale to={o.to} suffix={o.suffix} label={o.label} dur={d} />;
    case "rail": return <S.Rail n={o.n} total={o.total} word={o.word} asc title={o.title} dur={d} />;
    default: return null;
  }
};

export const MainStan12f: React.FC = () => (
  <AbsoluteFill style={{ background: S.K.ink }}>
    {/* capa 1: Stan sentado (ventanas visibles del reel) */}
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <S.Avatar src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
    {/* capa 2: material (clips reales, fotos, Veo, componentes) */}
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
    {/* capa 3: rótulos de la casa */}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    {/* audio: mezcla hecha en la nube (voz + sonido real de los clips + foley); encfin la monta sobre el video */}
    <Audio src={staticFile("stan12f_mix.m4a")} />
    {SFX.length < 0 ? null : null}
  </AbsoluteFill>
);
