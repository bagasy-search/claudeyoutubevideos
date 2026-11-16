import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import * as E from "./Escenas";
import * as HA from "./heroes_14b";
import * as HB from "./heroes_14b2";
import * as HC from "./heroes_14b3";
import { MIX } from "./cues.gen";
const HEROES: Record<string, any> = { ...HA, ...HB, ...HC };

export const TOTAL_FRAMES_LEN11 = TOTAL;
const T = 8; // frames de transición

// cámara viva sobre los componentes: deriva lenta (zoom ≤5 % + paneo) y grano, para que ningún cierre quede congelado (AUDITOR freezedetect)
const HeroDrift: React.FC<{ dur: number; seed: number; children: React.ReactNode }> = ({ dur, seed, children }) => {
  const f = useCurrentFrame(); const k = interpolate(f, [0, Math.max(1, dur)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ph = (seed * 1.7) % 6.283, w = (seed % 2 ? 1 : -1) * 6.283 / 240; const dx = 30 * Math.sin(ph + w * f), dy = 30 * Math.cos(ph + w * f);
  return (<AbsoluteFill><AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${1.08 + 0.04 * k})` }}>{children}</AbsoluteFill></AbsoluteFill>);
};

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.album) return <Q.Album src={s.src} under={s.under} seed={s.id + 1} dur={dur} />; // foto antigua como objeto
  if (s.k === "C" && HEROES[s.comp]) { const Hh = HEROES[s.comp]; return <HeroDrift dur={dur} seed={s.id}><Hh dur={dur} src={s.bg} v={s.v} /></HeroDrift>; }
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
  if (trans === "push") { // v4: el empuje dejaba ver el fondo vacío tras el avatar → corte
    return <AbsoluteFill>{children}</AbsoluteFill>;
    const dir = P.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)`, opacity: o }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// len14c v3 (EVALUADOR v2): (a) insignias de paso consecutivas del mismo n se funden en UNA (entra una vez, no en cada corte);
// (b) en el repaso final la insignia lleva la tira de 12 fotos reales (primera foto de cada paso) con la actual resaltada;
// (c) sin cortinilla (corte limpio).
const OV: any[] = (() => {
  const src = (OVERLAYS as any[]).filter((o) => o.type !== "wipe").slice().sort((a, b) => a.from - b.from);
  const out: any[] = [];
  for (const o of src) {
    const last = [...out].reverse().find((x) => x.type === "progress");
    if (o.type === "progress" && last && last.n === o.n && o.from - (last.from + last.dur) <= 150) { last.dur = o.from + o.dur - last.from; continue; }
    out.push({ ...o });
  }
  const pr = out.filter((x) => x.type === "progress");
  const i12 = pr.findIndex((x) => x.n === 12);
  const thumbs: string[] = [];
  for (let n = 1; n <= 12; n++) {
    const p = pr.find((x) => x.n === n);
    const sh = p ? (SHOTS as any[]).find((s) => s.from >= p.from && s.k === "G" && s.src && !/\.mp4$/.test(s.src)) : null;
    thumbs.push(sh ? sh.src : "");
  }
  // v4: el repaso empieza cuando el número BAJA después de llegar a 12 (antes marcaba repaso el resto del paso 12)
  const ir = i12 >= 0 ? pr.findIndex((x, j) => j > i12 && x.n < 12) : -1;
  if (ir >= 0) pr.slice(ir).forEach((x) => { x.recap = true; x.thumbs = thumbs; });
  return out;
})();

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
    case "scene": return <Q.HabitScene n={o.n} title={o.title} src={o.src} dur={d} kick={o.kick} />;
    case "progress": return <Q.Progress n={o.n} title={o.title} dur={d} of={o.of} recap={o.recap} thumbs={o.thumbs} />;
    case "split": return <Q.SplitPhoto src={o.src} seed={o.seed} dur={d} />;
    case "polaroid": return <Q.Polaroid src={o.src} caption={o.caption} seed={o.seed} dur={d} />;
    case "map": return <Q.MapJP a={o.a} b={o.b} la={o.la} ja={o.ja} lb={o.lb} jb={o.jb} dur={d} />;
    case "escena": { const K = (E as any)[o.name]; return K ? <K dur={d} {...o} /> : null; }
    case "cta": return <Q.CTA text={o.text} cards={[]} dur={d} />;
    case "wipe": return null;
    default: return null;
  }
};

export const MainLen11: React.FC = () => (
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
    {/* sin viñeta (regla len14) */}
    {/* capa 3: gráficos */}
    {OV.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    {/* audio: voz + piano premezclados, SFX por debajo */}
    <Audio src={staticFile(MIX)} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
