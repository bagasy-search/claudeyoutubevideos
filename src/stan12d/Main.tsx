import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as S from "./St";
import * as E from "./Escenas";

export const TOTAL_FRAMES_STAN12D = TOTAL;
const T = 8;

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    switch (s.c) {
      case "scene": return <S.MethodScene n={s.n} rank={s.rank} total={8} title={s.title} src={s.src} dur={dur} />;
      case "score": return <S.ScoreBoard rows={s.rows} now={s.now} dur={dur} />;
      case "sheet": return <S.Sheet kicker={s.kicker} title={s.title} lines={s.lines} dur={dur} seed={s.id} />;
      case "chapter": return <S.Chapter kicker={s.kicker} title={s.title} dur={dur} />;
      case "seven": return <S.Seven items={s.items} dur={dur} />;
      case "cta": return <S.CTA text={s.text} dur={dur} seed={s.id} />;
      case "map": return <S.MapPins src={s.src} pins={s.pins} dur={dur} />;
      case "carousel": return <S.Carousel cards={CARDS} bg={s.bg} head={s.head} sub={s.sub} subAt={s.subAt} dur={dur} />;
      case "recap": return <S.Recap cards={CARDS} marks={s.marks} bg={s.bg} head={s.head} dur={dur} />;
      case "esc": { const K = (E as any)[s.name]; return K ? <K dur={dur} {...s.props} /> : null; }
      default: return null;
    }
  }
  if (s.album) return <S.Album src={s.src} seed={s.id + 1} dur={dur} board={s.board} caption={s.caption} />;
  if (s.veo) return <S.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <S.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} volume={0.1} />;
  if (s.k === "G") return <S.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = S.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "lower": return <S.Lower title={o.title} sub={o.sub} dur={d} />;
    case "kinetic": return <S.Kin lines={o.lines} accent={o.accent} dur={d} />;
    case "tag": return <S.Tag text={o.text} dur={d} />;
    case "thermo": return <S.Thermo deg={o.deg} label={o.label} dur={d} />;
    case "timer": return <S.Timer min={o.min} label={o.label} dur={d} />;
    case "counter": return <S.Count to={o.to} suffix={o.suffix} label={o.label} dur={d} />;
    case "mis": return <S.Mis n={o.n} text={o.text} dur={d} />;
    case "rec": return <S.Rec n={o.n} title={o.title} score={o.score} dur={d} />;
    case "progress": return <S.Progress n={o.n} total={8} title={o.title} dur={d} />;
    case "top": return <S.Top n={o.n} text={o.text} dur={d} />;
    default: return null;
  }
};

export const MainStan12d: React.FC = () => (
  <AbsoluteFill style={{ background: S.K.ink }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <S.Avatar src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
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
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    <Audio src={staticFile("stan12d_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
