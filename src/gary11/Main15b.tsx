// scr15b · montaje (copia de gary14a con componentes y overlays propios). Sin grano, sin viñeta, sin blend de pantalla (brief SESIÓN 13): los componentes solo respiran con un vaivén lento de cámara.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import { CompC15b } from "./C15b";
import * as O from "./O15b";

export const TOTAL_FRAMES = TOTAL;
const T = 8;

// vaivén de cámara en mano (lento, sin sacudón) para que el componente a pantalla completa nunca quede congelado
const Sway: React.FC<{ dur: number; seed: number; children: React.ReactNode }> = ({ dur, seed, children }) => {
  const f = useCurrentFrame();
  const s = 1.015 + 0.03 * Math.min(1, f / Math.max(1, dur));
  const x = Math.sin(f / 52 + seed) * 6, y = Math.cos(f / 67 + seed) * 4;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#1d2430" }}><AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s})` }}>{children}</AbsoluteFill></AbsoluteFill>;
};

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  // Veo: zoom 1,11 para dejar la estrellita de la marca fuera de cuadro
  if (s.veo) return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: "scale(1.11)" }}><P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} /></AbsoluteFill></AbsoluteFill>;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} />;
  if (s.k === "W" || s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  if (s.k === "C") return <Sway dur={dur} seed={s.id % 13}><CompC15b s={s} dur={dur} /></Sway>;
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

// cada cortina de capítulo es una foto real distinta de cartón, lata o cera del video
const SHEET_SRC = ["g/g0910", "g/g0590", "g/g1010", "g/g1560", "g/g1980", "g/g0430", "g/g2110", "g/g1870", "g/g2060", "g/g3140"];
const SHEET_FROM = (OVERLAYS as any[]).filter((o) => o.type === "sheet").map((o) => o.from);
const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "name": return <O.CanLabel text={o.text} sub={o.sub} dur={d} />;
    case "tape": return <O.PartStrip n={o.n} dur={d} />;
    case "sheet": return <O.CardFlap dur={d} src={`scr15b/${SHEET_SRC[Math.max(0, SHEET_FROM.indexOf(o.from)) % SHEET_SRC.length]}.png`} />;
    case "door": return <O.TapedCard src={o.src} seed={o.seed} label={o.label} dur={d} />;
    case "datatag": return <O.TapeData big={o.big} label={o.label} src={o.srcTxt} dur={d} />;
    case "safe": return <O.Enamel text={o.text} dur={d} />;
    default: return null;
  }
};

export const MainScr15b: React.FC = () => (
  <AbsoluteFill style={{ background: "#1d2430" }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <Q.AvatarFramed src={a.src} off={a.off} seed={i} dur={a.dur} mods={a.mods} />
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
    <Audio src={staticFile("scr15b/scr15b_mix.m4a")} />
  </AbsoluteFill>
);
