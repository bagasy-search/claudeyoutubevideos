// scr14a · montaje (copia de Main15b con componentes y overlays propios de la estufa a pellets). Sin grano, sin viñeta.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL } from "./cues.gen";
import * as P from "./Piezas";
import * as Q from "./Piezas2";
import { CompC14p } from "./C14p";
import * as O from "./O14p";

export const TOTAL_FRAMES = TOTAL;
const T = 8;

// vaivén de cámara en mano (lento, sin sacudón) para que el componente a pantalla completa nunca quede congelado
const Sway: React.FC<{ dur: number; seed: number; children: React.ReactNode }> = ({ dur, seed, children }) => {
  const f = useCurrentFrame();
  const s = 1.015 + 0.03 * Math.min(1, f / Math.max(1, dur));
  const x = Math.sin(f / 52 + seed) * 6, y = Math.cos(f / 67 + seed) * 4;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#141517" }}><AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s})` }}>{children}</AbsoluteFill></AbsoluteFill>;
};

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  // Veo: zoom 1,11 para dejar la estrellita de la marca fuera de cuadro
  if (s.veo) return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: "scale(1.11)" }}><P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.42} /></AbsoluteFill></AbsoluteFill>;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} />;
  if (s.k === "W" || s.k === "G") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  if (s.k === "C") return <Sway dur={dur} seed={s.id % 13}><CompC14p s={s} dur={dur} /></Sway>;
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

// cada cortina de capítulo es una foto real distinta de chatarra o de la estufa
const SHEET_SRC = ["g/g0220", "g/g0540", "g/g0680", "g/g0980", "g/g1220", "g/g1350", "g/g1620", "g/g1780", "g/g2250", "g/g2620"];
const SHEET_FROM = (OVERLAYS as any[]).filter((o) => o.type === "sheet").map((o) => o.from);
const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "name": return <O.StampPlate text={o.text} sub={o.sub} dur={d} />;
    case "tape": return <O.StepRule n={o.n} dur={d} />;
    case "sheet": return <O.PlateWipe dur={d} src={`scr14a/${SHEET_SRC[Math.max(0, SHEET_FROM.indexOf(o.from)) % SHEET_SRC.length]}.png`} />;
    case "door": return <O.WeldFrame src={o.src} seed={o.seed} label={o.label} dur={d} />;
    case "datatag": return <O.ShipTag big={o.big} label={o.label} src={o.srcTxt} dur={d} />;
    case "safe": return <O.Hazard text={o.text} dur={d} />;
    default: return null;
  }
};

export const MainScr14a: React.FC = () => (
  <AbsoluteFill style={{ background: "#141517" }}>
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
    <Audio src={staticFile("scr14a/scr14a_mix.m4a")} />
  </AbsoluteFill>
);
