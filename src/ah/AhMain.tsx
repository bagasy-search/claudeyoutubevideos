// AhMain — montaje del canal Ancient Humans a partir de un plan (mismo contrato que YcMain, registro PROPIO:
// no se comparte con otros canales para que ninguna sesión paralela lo pise).
//   beats[]    = plano base (foto/clip), contiguos; `tr` "dissolve" funde con el anterior
//   cards[]    = componentes a pantalla completa
//   overlays[] = componentes encima del base (callouts, rótulos, brasas)
//   clock[]    = tramos del reloj chico de esquina (hora del capítulo en curso)
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Media, KB, setClipLens, setClipSkip } from "../yc/Media";
import { Vignette, Grain } from "../yc/Grade";
import { LightLeak } from "../yc/NumberCard3D";
import { NightClock, ClockBug, YouThem, Counter, StudyCard, Callout, SleepBars, SentinelRing, MoonTally, Words, PlaceStamp, Embers, TalkBars, Recap } from "./Kit";
import { Globe3D } from "./Globe3D";
import { EmberType, OchreWall, ShadowWall, SkyClock, CampWatch, DotTrail, MatchCut, TitleCard, Flash, Nightfall, Shot, EmberWords, FlashSeq } from "./Cine";
import { clamp } from "./theme";

export type Beat = { from: number; dur: number; src: string; start?: number; rate?: number; kb?: KB; zoom?: number; filter?: string; pos?: string; tr?: "cut" | "dissolve" };
export type Cue = { from: number; dur: number; comp: string; props: any };
export type ClockSpan = { from: number; dur: number; time: string; label?: string };
export type Plan = { fps: number; total: number; audio?: string; beats: Beat[]; cards: Cue[]; overlays: Cue[]; clock?: ClockSpan[]; trans?: { from: number; dur: number; src: string }[]; lens?: Record<string, number>; skip?: Record<string, number> };

const Prerendered: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: clamp(f / 8) }}><Media src={src} start={8 / 30} kb="none" zoom={1} /></AbsoluteFill>;
};

const COMPS: Record<string, React.FC<any>> = {
  NightClock, ClockBug, YouThem, Counter, StudyCard, Callout, SleepBars, SentinelRing, MoonTally, Words, PlaceStamp, Embers, TalkBars, Recap, LightLeak, Globe3D, Prerendered,
  EmberType, OchreWall, ShadowWall, SkyClock, CampWatch, DotTrail, MatchCut, TitleCard, Flash, Nightfall, Shot, EmberWords, FlashSeq,
};
const XF = 14;
const TOP = new Set(["Embers", "LightLeak", "EmberWords"]);

export const AhCard: React.FC<{ comp: string; props: any; lens?: Record<string, number>; dur?: number }> = ({ comp, props, lens }) => {
  setClipLens(lens ?? {});
  const C = COMPS[comp];
  return <AbsoluteFill style={{ background: "#000" }}>{C ? <C {...props} /> : null}</AbsoluteFill>;
};

const BeatView: React.FC<{ b: Beat; fadeIn: boolean }> = ({ b, fadeIn }) => {
  const f = useCurrentFrame();
  const o = fadeIn ? clamp(f / XF) : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Media src={b.src} start={b.start} rate={b.rate} kb={b.kb ?? "in"} zoom={b.zoom ?? 1.1} filter={b.filter} pos={b.pos} />
    </AbsoluteFill>
  );
};

export const AhMain: React.FC<{ plan: Plan }> = ({ plan }) => {
  setClipLens(plan.lens ?? {});
  setClipSkip(plan.skip ?? {});
  const R = (arr: Cue[], k: string) => arr.map((c, i) => {
    const C = COMPS[c.comp];
    return C ? <Sequence key={k + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {plan.beats.map((b, i) => {
        const dis = b.tr === "dissolve" && i > 0;
        const from = dis ? Math.max(0, b.from - XF) : b.from;
        return (
          <Sequence key={"b" + i} from={from} durationInFrames={b.dur + (b.from - from)} layout="none">
            <BeatView b={b} fadeIn={dis} />
          </Sequence>
        );
      })}
      {R(plan.overlays.filter((c) => !TOP.has(c.comp)), "o")}
      {(plan.clock ?? []).map((c, i) => <Sequence key={"k" + i} from={c.from} durationInFrames={c.dur}><ClockBug time={c.time} label={c.label} /></Sequence>)}
      {R(plan.cards, "c")}
      {R(plan.overlays.filter((c) => TOP.has(c.comp)), "t")}
      <Vignette strength={0.42} />
      <Grain opacity={0.06} />
      {/* transiciones sin corte (agnes keyframe): van ENCIMA de todo, sus extremos son cuadros renderizados ya con el acabado */}
      {(plan.trans ?? []).map((t, i) => <Sequence key={"x" + i} from={t.from} durationInFrames={t.dur}><Media src={t.src} kb="none" zoom={1} /></Sequence>)}
      {plan.audio ? <Audio src={staticFile(plan.audio)} /> : null}
    </AbsoluteFill>
  );
};
