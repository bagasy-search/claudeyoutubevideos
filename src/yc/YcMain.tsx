// YcMain — montaje del canal Yesterday's Classroom a partir de un plan:
//   beats[]    = plano base (foto/clip real), contiguos; `tr` "dissolve" funde con el anterior
//   cards[]    = componentes a pantalla completa (tapan el base mientras duran)
//   overlays[] = componentes encima del base (sellos, rótulos, contadores)
// Encima de todo va el acabado de película (Grade). El audio final (voz + música + sfx) viene mezclado.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Media, KB, setClipLens, setClipSkip } from "./Media";
import { Grade } from "./Grade";
import { NumberCard3D, LightLeak } from "./NumberCard3D";
import { Timeline3D } from "./Timeline3D";
import { ThenNow, Kinetic, BanStamp, Clipping, MapRoute, FilmStrip, Ticket, ChalkBars, PlaceTag, BigCount } from "./Cards";
import { PrintPush } from "./PrintPush";
import { Diorama3D } from "./Diorama3D";
import { Projector3D } from "./Hero3D";
import { ExamRoom3D } from "./ExamRoom3D";
import { ReportCard3D } from "./ReportCard3D";
import { BayouMap3D } from "../hank/BayouMap3D";
import { SpeciesFile, TailCounter, DamageChart, TrailCam, FieldNote } from "../hank/FieldKit";
import { HankCam } from "../hank/HankCam";
import { Vignette, Grain } from "./Grade";
import { Rulebook3D } from "./Rulebook3D";
import { CourtRuling3D } from "./CourtRuling3D";
import { PrincipalDoor3D } from "./PrincipalDoor3D";
import { VerdictStamp, DetentionSlip, StateHexMap, ChalkWipe, BellFlash, PagePeel } from "./Verdict";
import { clamp } from "./theme";

export type Beat = { from: number; dur: number; src: string; start?: number; rate?: number; kb?: KB; zoom?: number; filter?: string; pos?: string; tr?: "cut" | "dissolve" };
export type Cue = { from: number; dur: number; comp: string; props: any };
export type Plan = { fps: number; total: number; audio?: string; beats: Beat[]; cards: Cue[]; overlays: Cue[]; lens?: Record<string, number>; skip?: Record<string, number>; grade?: "film" | "clean" };

// ⚠️ Este registro lo comparten varios canales (Yesterday's Classroom y Hank Out Back): agregá en su lugar, nunca reescribas el bloque entero.
const COMPS: Record<string, React.FC<any>> = {
  NumberCard3D, Timeline3D, ThenNow, Kinetic, BanStamp, Clipping, MapRoute, FilmStrip, Ticket, ChalkBars, PlaceTag, BigCount, LightLeak, PrintPush, Diorama3D, Projector3D, ExamRoom3D, ReportCard3D,
  Rulebook3D, CourtRuling3D, PrincipalDoor3D, VerdictStamp, DetentionSlip, StateHexMap, ChalkWipe, BellFlash, PagePeel,
  BayouMap3D, SpeciesFile, TailCounter, DamageChart, TrailCam, FieldNote, HankCam,
};
const XF = 14; // frames de fundido
// transiciones firmadas: van por encima de las tarjetas (cubren el corte base↔tarjeta)
const TOP = new Set(["ChalkWipe", "BellFlash", "PagePeel"]);

// escena pre-renderizada localmente con GPU (las 3D pesadas no entran en los 25 min del farm por software)
// salta el fundido desde negro de la escena (8 cuadros) y en cambio funde sobre el plano anterior
const Prerendered: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: clamp(f / 8) }}><Media src={src} start={8 / 30} kb="none" zoom={1} /></AbsoluteFill>;
};
COMPS.Prerendered = Prerendered;

export const YcCard: React.FC<{ comp: string; props: any; lens?: Record<string, number>; dur?: number }> = ({ comp, props, lens }) => {
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

export const YcMain: React.FC<{ plan: Plan }> = ({ plan }) => {
  const { fps } = useVideoConfig();
  setClipLens(plan.lens ?? {});
  setClipSkip(plan.skip ?? {});
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {plan.beats.map((b, i) => {
        const dis = b.tr === "dissolve" && i > 0;
        const from = dis ? Math.max(0, b.from - XF) : b.from;
        const dur = b.dur + (b.from - from);
        return (
          <Sequence key={"b" + i} from={from} durationInFrames={dur} layout="none">
            <BeatView b={b} fadeIn={dis} />
          </Sequence>
        );
      })}
      {plan.overlays.filter((c) => !TOP.has(c.comp)).map((c, i) => {
        const C = COMPS[c.comp];
        return C ? <Sequence key={"o" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      {plan.cards.map((c, i) => {
        const C = COMPS[c.comp];
        return C ? <Sequence key={"c" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      {plan.overlays.filter((c) => TOP.has(c.comp)).map((c, i) => {
        const C = COMPS[c.comp];
        return C ? <Sequence key={"t" + i} from={c.from} durationInFrames={c.dur}><C {...c.props} /></Sequence> : null;
      })}
      {plan.grade === "clean" ? <><Vignette strength={0.4} /><Grain opacity={0.05} /></> : <Grade />}
      {plan.audio ? <Audio src={staticFile(plan.audio)} /> : null}
      {void fps}
    </AbsoluteFill>
  );
};
