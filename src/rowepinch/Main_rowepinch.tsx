import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Foto, Clip, AvatarWin } from "./Piezas";
import { BASE, COMPS, TOTAL_FRAMES } from "./cues.gen";
import { LowerThird } from "../_fed6/VideoEdit/scenes/LowerThird";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { DatoImpacto } from "../_fed6/VideoEdit/scenes/DatoImpacto";
import { ListaFlotante } from "../_fed6/VideoEdit/scenes/ListaFlotante";
import { MitoRevelado } from "../_fed6/VideoEdit/scenes/MitoRevelado";
import { FreezeZoom } from "../_fed6/VideoEdit/scenes/FreezeZoom";
import { Carrusel3D } from "../_fed6/VideoEdit/scenes/Carrusel3D";
import { CalloutMark } from "../_fed6/VideoEdit/scenes/CalloutMark";
import { MallaColageno } from "../_fed6/VideoEdit/scenes/MallaColageno";
import { LineaTiempoPiel } from "./LineaTiempoEN";
import { PruebaPliegueEN } from "./PruebaPliegueEN";
import { SplitCompareEN } from "./SplitCompareEN";

// ── CANAL "Dr. Emmett Rowe" (EN) · rowepinch ────────────────────────────────
// Audio = máster Fish (voz `rowe`). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
// (reel `rowepinch_avatar.mp4`, recortado con trimBefore). Todo video por OffthreadVideo.
export const TOTAL_FRAMES_ROWEPINCH = TOTAL_FRAMES;
const AVATAR_REEL = "rowepinch_avatar.mp4";
const TAG = "DR. EMMETT ROWE";

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker ?? TAG} tag={TAG} tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "datoimpacto" ? <DatoImpacto durationInFrames={d} figure={b.figure} unit={b.unit} eyebrow={b.eyebrow} caption={b.caption} image={b.image} tone={b.tone} />
  : b.kind === "checklist" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} items={b.items} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoRevelado durationInFrames={d} myth={b.myth} truth={b.truth} image={b.image} flipAt={b.flipAt}
      mythLabel="THE MYTH" truthLabel="WHAT'S REALLY TRUE" />
  : b.kind === "lineatiempo" ? <LineaTiempoPiel durationInFrames={d} title={b.title} marks={b.marks} tone={b.tone} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "carrusel" ? <Carrusel3D durationInFrames={d} title={b.title} items={b.items} focus={b.focus} tone={b.tone} />
  : b.kind === "callout" ? <CalloutMark durationInFrames={d} figure={b.figure} eyebrow={b.eyebrow} caption={b.caption} image={b.image} medico />
  : b.kind === "malla" ? <MallaColageno durationInFrames={d} phase={b.phase} labels={b.labels} />
  : b.kind === "pliegue" ? <PruebaPliegueEN durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftLabel={b.leftLabel} rightLabel={b.rightLabel}
      leftSeconds={b.leftSeconds} rightSeconds={b.rightSeconds} verdict={b.verdict} leftCaption={b.leftCaption} rightCaption={b.rightCaption} />
  : b.kind === "split" ? <SplitCompareEN durationInFrames={d} left={b.left} right={b.right} eyebrow={b.eyebrow} title={b.title} winner={b.winner} unit={b.unit} />
  : null;

// SFX puntuales (bajos) para los componentes que no traen los suyos
const SFX_IN: Record<string, [string, number]> = {
  lowerthird: ["sfx/sfx_pop.mp3", 0.22], frasecinetica: ["sfx/sfx_text_thud.mp3", 0.2], datoimpacto: ["sfx/number_slam.mp3", 0.24],
  checklist: ["sfx/sfx_whoosh_soft.mp3", 0.22], mitoverdad: ["sfx/sfx_whoosh_soft.mp3", 0.22], lineatiempo: ["sfx/line_draw.mp3", 0.2],
  freezezoom: ["sfx/cam_zoom_punch.mp3", 0.22], carrusel: ["sfx/sfx_whoosh_soft.mp3", 0.22], malla: ["sfx/section_swell.mp3", 0.18],
  pliegue: ["sfx/sfx_whoosh_soft.mp3", 0.22],
};

export const MainRowepinch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1D23" }}>
    <Audio src={staticFile("rowepinch.m4a")} />

    {BASE.map((b: any, i: number) => (
      <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
        {b.kind === "avatar" ? <AvatarWin src={AVATAR_REEL} trimFrames={b.trim} seed={b.seed} />
          : b.kind === "clip" ? <Clip src={b.src} seed={b.seed} frames={b.frames} last={b.last} kbN={b.kbN} />
          : <Foto src={b.src} seed={b.seed} cont={b.cont} />}
      </Sequence>
    ))}

    {COMPS.map((c: any, i: number) => (
      <Sequence key={`c${i}`} from={c.from} durationInFrames={c.dur} layout="none">
        {renderComp(c, c.dur)}
        {SFX_IN[c.kind] ? <Audio src={staticFile(SFX_IN[c.kind][0])} volume={SFX_IN[c.kind][1]} /> : null}
      </Sequence>
    ))}
  </AbsoluteFill>
);
