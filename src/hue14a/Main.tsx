import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, SFX, TOTAL, CARDS } from "./cues.gen";
import * as K from "./Huerto";
import * as E from "./Escenas";

export const TOTAL_FRAMES_HUE14A = TOTAL;
const T = 8;

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.k === "C") {
    switch (s.c) {
      case "carousel": return <K.Carrusel cards={CARDS} dur={dur} />;
      case "recap": return <K.RecapPaquetes n={s.n} cards={CARDS} lines={s.lines} dur={dur} />;
      case "estaca": return <K.Estaca n={s.n} title={s.title} img={s.img} dur={dur} />;
      case "libro": return <K.Libro src={s.src} tabs={s.tabs} dur={dur} />;
      case "mapa": return <K.Mapa img={s.img} pins={s.pins} dur={dur} />;
      case "marcadores": return <K.Marcadores img={s.img} seed={s.id} items={s.items} dur={dur} />;
      case "tendedero": return <K.Tendedero img={s.img} items={s.items} sweep={s.sweep} dur={dur} />;
      case "recuerdo": return <K.Recuerdo img={s.img} head={s.head} quote={s.quote} fQuote={s.fQuote} dur={dur} />;
      case "baldosas": return <K.Baldosas img={s.img} foot={s.foot} marks={s.marks} dur={dur} />;
      case "colgantes": return <K.Colgantes img={s.img} seed={s.id} items={s.items} dur={dur} />;
      case "ficha": return <K.Ficha img={s.img} quote={s.quote} source={s.source} dur={dur} />;
      case "sobre": return <K.Sobre img={s.img} head={s.head} lines={s.lines} dur={dur} />;
      case "papelito": return <K.Papelito img={s.img} n={s.n} text={s.text} dur={dur} />;
      case "cta": return <K.CTAsobre img={s.img} next={s.next} nextImg={s.nextImg} dur={dur} />;
      case "esc": { const C = (E as any)[s.name]; return C ? <C dur={dur} {...s.props} /> : null; }
      default: return null;
    }
  }
  if (s.veo) return <K.Video src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} />;
  if (s.k === "Y") return <K.Video src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} volume={0.1} />;
  if (s.k === "G") return <K.Foto src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = seed % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  if (trans === "arpillera") return <AbsoluteFill>{children}<K.Arpillera dir={seed % 2 ? 1 : -1} /></AbsoluteFill>;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "progress": return <K.Progreso n={o.n} title={o.title} dur={d} />;
    case "split": return <K.SplitTabla src={o.src} seed={o.seed} dur={d} />;
    case "polaroid": return <K.PolaroidH src={o.src} caption={o.caption} seed={o.seed} dur={d} />;
    default: return null;
  }
};

export const MainHue14a: React.FC = () => (
  <AbsoluteFill style={{ background: K.H.ink }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        {a.still ? <AbsoluteFill><Img src={staticFile(a.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : <K.AvatarH src={a.src} seed={i} dur={a.dur} mods={a.mods} />}
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
    <Audio src={staticFile("hue14a_mix.m4a")} />
    {SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}>
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
