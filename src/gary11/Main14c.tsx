// gary14c · montaje. Sin grano, sin viñeta, sin blend de pantalla (brief SESIÓN 13): los componentes solo respiran con un vaivén lento de cámara.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import { CompC14c } from "./C14c";
import * as O from "./O14c";
import { ManualCTA } from "./book3d";

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
  if (s.k === "C" && s.cta) return <ManualCTA t={0} h={{ k: "cta", at: 0, out: dur / 30 - 0.4 }} page={s.page} under={s.under} />;
  if (s.k === "C") return <Sway dur={dur} seed={s.id % 13}><CompC14c s={s} dur={dur} /></Sway>;
  return null;
};
// el CTA del manual necesita el tiempo vivo
const CtaLive: React.FC<{ s: any; dur: number }> = ({ s, dur }) => { const f = useCurrentFrame(); return <ManualCTA t={f / 30} h={{ k: "cta", at: 0, out: dur / 30 - 0.4 }} page={s.page} under={s.under} />; };

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
    case "name": return <O.Dymo text={o.text} sub={o.sub} dur={d} />;
    case "fuses": return <O.DetectorRow n={o.n} dur={d} />;
    case "conduit": return <O.GarageDoor dur={d} />;
    case "door": return <O.WindowSplit src={o.src} seed={o.seed} label={o.label} dur={d} />;
    case "clip": return <O.Slide src={o.src} note={o.note} seed={o.seed} left={o.left} dur={d} />;
    case "datatag": return <O.WarnLabel big={o.big} label={o.label} src={o.srcTxt} dur={d} />;
    case "safe": return <O.ExitSign text={o.text} dur={d} />;
    case "midcta": return <O.CabinetPeek dur={d} />;
    default: return null;
  }
};

export const MainGary14c: React.FC = () => (
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
          <Enter trans={s.trans || "cut"} seed={s.id}>{s.k === "C" && s.cta ? <CtaLive s={s} dur={s.dur} /> : <ShotBody s={s} dur={s.dur} />}</Enter>
        </Sequence>
      );
    })}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <Overlay o={o} />
      </Sequence>
    ))}
    <Audio src={staticFile("gary14c/gary14c_mix.m4a")} />
  </AbsoluteFill>
);
