// joan16 — Main genérico de la serie: cada index_<slug>.tsx le pasa su cues (generado por D:/rtmp/joan16/tools/gen16.mjs)
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import * as P from "../joan/Piezas";
import * as Q from "../joan/Piezas2";
import * as L from "./Lista";

export type Cues = { SHOTS: any[]; AVATAR: any[]; OVERLAYS: any[]; SFX: any[]; TOTAL: number; CARDS: L.Card[]; LISTA: { n: number; head: string; tag: string; short: string }; MIX: string };
const T = 8;

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

const Drift: React.FC<{ dur: number; to: number; children: React.ReactNode }> = ({ dur, to, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, dur], [1, to], { extrapolateRight: "clamp" })})` }}>{children}</AbsoluteFill>;
};

export const makeMain = (cu: Cues) => {
  Object.assign(Q.LIST, cu.LISTA);   // carrusel / progreso / CTA de joan01 leen LIST
  const Body: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
    if (s.k === "V") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} minRate={0.5} />;
    if (s.k === "N") return <L.NBPhoto src={s.src} seed={s.id + 1} dur={dur} />;
    if (s.k === "C" && s.comp === "progreso") return <L.ChapterOpen n={s.n} total={cu.LISTA.n} title={s.title} src={s.bg} dur={dur} />;
    if (s.k === "C" && s.comp === "carrusel") return <Drift dur={dur} to={1.06}><Q.Carousel cards={cu.CARDS} bg={s.bg} subAt={s.subAt} sub={s.sub} dur={dur} /></Drift>;
    if (s.k === "C" && s.comp === "recap") return <L.Recap9 items={s.items} cards={cu.CARDS} bg={s.bg} head={cu.LISTA.head} dur={dur} />;
    if (s.k === "C" && s.comp === "reloj") return <L.Reloj label={s.label} sub={s.sub} unit={s.unit} amount={s.amount} bg={s.bg} dur={dur} />;
    return null;
  };
  const Ov: React.FC<{ o: any }> = ({ o }) => {
    const d = o.dur;
    switch (o.type) {
      case "lower": return <P.LowerThird title={o.title} sub={o.sub} dur={d} />;
      case "place": return <P.Place text={o.text} dur={d} />;
      case "kinetic": return <P.Kinetic lines={o.lines} accent={o.accent} dur={d} />;
      case "quote": return <P.Quote text={o.text} dur={d} />;
      case "tag": return <P.Tag text={o.text} dur={d} />;
      case "progress": return <Q.Progress n={o.n} title={o.title} dur={d} />;
      case "cta": return <Q.CTA text={o.text} cards={cu.CARDS} dur={d} />;
      default: return null;
    }
  };
  const Main: React.FC = () => (
    <AbsoluteFill style={{ background: P.C.ink }}>
      {cu.AVATAR.map((a, i) => (
        <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
          <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />
        </Sequence>
      ))}
      {cu.SHOTS.map((s, i) => {
        if (s.k === "A") return null;
        const nx = cu.SHOTS[i + 1];
        const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
        return (
          <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, cu.TOTAL - s.from)} premountFor={45}>
            <Enter trans={s.trans || "cut"} seed={s.id}><Body s={s} dur={s.dur} /></Enter>
          </Sequence>
        );
      })}
      <P.Grade />
      {cu.OVERLAYS.map((o, i) => (
        <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, cu.TOTAL - o.from)}>
          <Ov o={o} />
        </Sequence>
      ))}
      <Audio src={staticFile(cu.MIX)} />
    </AbsoluteFill>
  );
  return Main;
};
