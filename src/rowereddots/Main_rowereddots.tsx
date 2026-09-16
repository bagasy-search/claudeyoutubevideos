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
import { GlassTestScene } from "../_fed6/VideoEdit/scenes/GlassTestScene";
import { BodyMapScene } from "../_fed6/VideoEdit/scenes/BodyMapScene";
import { FdSplitCompare } from "../_fed6/VideoEdit/scenes/FdSplitCompare";
import { SfxCue, SFX } from "../_fed6/VideoEdit/components/Sfx";
import { LineaTiempoPiel } from "./LineaTiempoEN";

// ── CANAL "Dr. Emmett Rowe" (EN) · rowereddots ──────────────────────────────
// Audio = máster Fish (voz `rowe`). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
// (reel `rowereddots_avatar.mp4`, recortado con trimBefore). Todo video por OffthreadVideo.
export const TOTAL_FRAMES_ROWEREDDOTS = TOTAL_FRAMES;
const AVATAR_REEL = "rowereddots_avatar.mp4";
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
  : b.kind === "glasstest" ? <GlassTestScene durationInFrames={d} image={b.image} bed={b.bed ?? b.image} leftLabel={b.leftLabel} rightLabel={b.rightLabel} leftVerdict={b.leftVerdict} rightVerdict={b.rightVerdict} />
  : b.kind === "bodymap" ? <BodyMapScene durationInFrames={d} title={b.title} stops={b.stops} bed={b.bed} />
  : b.kind === "splitcompare" ? <FdSplitCompare durationInFrames={d} eyebrow={b.eyebrow} title={b.title} left={b.left} right={b.right} winner={b.winner} unit={b.unit ?? ""} />
  : null;

// Diseño de sonido de los componentes que NO traen SFX propio (ErrorStinger, CalloutMark y
// FdSplitCompare ya los traen). Suave, por debajo de la voz.
const sfxFor = (b: any, d: number): React.ReactNode => {
  const w = <SfxCue at={0} src={SFX.whoosh} volume={0.22} />;
  switch (b.kind) {
    case "lowerthird": return <>{w}<SfxCue at={10} src={SFX.kickerType} volume={0.22} /></>;
    case "frasecinetica": return <>{(b.words || []).map((_: any, i: number) => <SfxCue key={i} at={i * (b.perWord || 9)} src={SFX.popUp} volume={0.16} />)}</>;
    case "datoimpacto": return <>{w}<SfxCue at={14} src={SFX.numberSlam} volume={0.24} /></>;
    case "checklist": return <>{w}{(b.items || []).map((_: any, i: number) => <SfxCue key={i} at={18 + i * 12} src={SFX.kickerType} volume={0.2} />)}</>;
    case "mitoverdad": return <>{w}{b.flipAt ? <SfxCue at={b.flipAt} src={SFX.winnerChime} volume={0.22} /> : null}</>;
    case "lineatiempo": return <>{w}{(b.marks || []).map((_: any, i: number) => <SfxCue key={i} at={Math.round(8 + (i * (d - 20)) / Math.max(1, (b.marks || []).length))} src={SFX.chipPop3d} volume={0.2} />)}</>;
    case "freezezoom": return <><SfxCue at={0} src={SFX.shutter} volume={0.2} /><SfxCue at={8} src={SFX.whoosh} volume={0.18} /></>;
    case "carrusel": return <>{w}<SfxCue at={12} src={SFX.chipPop3d} volume={0.2} /></>;
    case "glasstest": return <><SfxCue at={6} src={SFX.whoosh} volume={0.2} /><SfxCue at={28} src={SFX.numberSlam} volume={0.2} /><SfxCue at={44} src={SFX.kickerType} volume={0.2} /><SfxCue at={54} src={SFX.chipPop3d} volume={0.22} /></>;
    case "bodymap": {
      const n = Math.max(1, (b.stops || []).length);
      const slot = Math.max(30, d - 12 - 8 - 40) / n;
      return <>{w}{(b.stops || []).map((_: any, i: number) => <SfxCue key={i} at={Math.round(8 + 40 + i * slot)} src={SFX.chipPop3d} volume={0.2} />)}</>;
    }
    default: return null;
  }
};

export const MainRowereddots: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1D23" }}>
    <Audio src={staticFile("rowereddots.m4a")} />

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
        {sfxFor(c, c.dur)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
