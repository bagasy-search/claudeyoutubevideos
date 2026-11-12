import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL, SIDES } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as K from "./Cookbook";
import * as E from "./Escenas";

export const TOTAL_FRAMES_CK11B = TOTAL;
const T = 8; // frames de transición

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  switch (s.comp) {
    case "card": return <K.RecipeCard r={s.r} n={s.n} bg={s.bg} dur={dur} seed={s.id} />;
    case "sched": return <K.Sched slots={s.slots} warmF={s.warmF} bg={s.bg} dur={dur} title={s.title} t0={s.t0} t1={s.t1} x0={s.x0} head={s.head} warmAt={s.warmAt} warmLabel={s.warmLabel} />;
    case "cta": return <K.BookCTA page={s.page} head={s.head} title={s.title} qrF={s.qrF} bg={s.bg} dur={dur} cover={s.cover} />;
    case "sum": return <K.SumCard n={s.n} title={s.title} lines={s.lines} src={s.src} bg={s.bg} dur={dur} head={s.head} />;
    case "chapter": return <K.ChapterOpen n={0} total={0} label={s.label} title={s.title} src={s.src} dur={dur} />;
    case "carousel": return <Q.Carousel cards={SIDES} bg={s.bg} subAt={s.subAt} sub={s.sub} dur={dur} />;
    case "map": return <Q.MapJP a={s.a} b={s.b} la={s.la} lb={s.lb} dur={dur} />;
  }
  if (s.album) return <Q.Album src={s.src} under={s.under} seed={s.id + 1} dur={dur} />; // foto antigua como objeto
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.5} />;
  if (s.k === "Y") return <P.Clip src={s.src} seed={Math.floor(s.id) + 1} dur={dur} clipDur={s.clipDur} start={s.start || 0} />;
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
  const d = o.dur;
  switch (o.type) {
    case "lower": return <P.LowerThird title={o.title} sub={o.sub} dur={d} />;
    case "place": return <P.Place text={o.text} dur={d} />;
    case "kinetic": return <P.Kinetic lines={o.lines} accent={o.accent} dur={d} />;
    case "clock": return <P.Clock h={o.h} m={o.m} label={o.label} night={o.night} dur={d} />;
    case "tag": return <P.Tag text={o.text} dur={d} />;
    case "counter": return <P.Counter to={o.to} suffix={o.suffix} label={o.label} dur={d} />;
    case "stat": return <P.Stat head={o.head} title={o.title} lines={o.lines} foot={o.foot} dur={d} />;
    case "thermo": return <P.Thermo deg={o.deg} label={o.label} sub={o.sub} subAt={o.subAt} dur={d} />;
    case "timer": return <P.Timer min={o.min} tickAt={o.tickAt} label={o.label} dur={d} />;
    case "three": return <P.Three head={o.head} items={o.items} marks={o.marks} dur={d} />;
    case "progress": return <Q.Progress n={o.n} title={o.title} dur={d} />;
    case "escena": { const X = (E as any)[o.name]; return X ? <X dur={d} {...o} /> : null; }
    case "cta": return <Q.CTA text={o.text} cards={SIDES} dur={d} />;
    default: return null;
  }
};

export const MainCk11f: React.FC = () => (
  <AbsoluteFill style={{ background: P.C.ink }}>
    {/* capa 1: avatar (ventanas visibles) */}
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
    {/* capa 2: material (clips reales, fotos, piezas del recetario) */}
    {SHOTS.map((s, i) => {
      if (s.k === "A" || s.esc) return null; // tapadas por una escena: no se dibujan (y un .mp4 como foto rompe el render)
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id + "_" + i} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} seed={s.id}><ShotBody s={s} dur={s.dur} /></Enter>
        </Sequence>
      );
    })}
    {/* capa 3: rótulos y escenas */}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    {/* audio: voz + audio real de los clips + SFX se mezclan en la nube (ck11f_mix.wav) y encfin los pega */}
  </AbsoluteFill>
);
