import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Foto, Clip, AvatarWin } from "./Piezas";
import { BASE, COMPS, SFX, TOTAL_FRAMES } from "./cues.gen";
import { LowerThird } from "../_fed6/VideoEdit/scenes/LowerThird";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { DatoImpacto } from "../_fed6/VideoEdit/scenes/DatoImpacto";
import { ListaFlotante } from "../_fed6/VideoEdit/scenes/ListaFlotante";
import { MitoRevelado } from "../_fed6/VideoEdit/scenes/MitoRevelado";
import { FreezeZoom } from "../_fed6/VideoEdit/scenes/FreezeZoom";
import { Carrusel3D } from "../_fed6/VideoEdit/scenes/Carrusel3D";
import { CalloutMark } from "../_fed6/VideoEdit/scenes/CalloutMark";
import { LineaTiempoPiel } from "./LineaTiempoEN";
import { BarCompare } from "../_fed6/VideoEdit/scenes/BarCompare";
import { BeforeAfterPush } from "../_fed6/VideoEdit/scenes/BeforeAfterPush";
import { PhotoTriptych } from "../_fed6/VideoEdit/scenes/PhotoTriptych";
import { RowePresenter } from "./RowePresenter";
import { RoweCarousel } from "./RoweCarousel";
import { MythTruth } from "./MythTruth";
import { RedFlags } from "./RedFlags";
import { RoutineSwap } from "./RoutineSwap";
import { FallTease } from "./FallTease";
import { SelfCheck } from "./SelfCheck";

// ── CANAL "Dr. Emmett Rowe" (EN) · rowetowel ─────────────────────────────────
// Audio = máster Fish (voz `rowe`). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
// (reel `rowetowel_avatar.mp4`, recortado con trimBefore). Todo video por OffthreadVideo.
export const TOTAL_FRAMES_ROWETOWEL = TOTAL_FRAMES;
const AVATAR_REEL = "rowetowel_avatar.mp4";
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
  : b.kind === "barcompare" ? <BarCompare durationInFrames={d} eyebrow={b.eyebrow} title={b.title} bars={b.bars} medico />
  : b.kind === "beforeafter" ? <BeforeAfterPush durationInFrames={d} before={b.before} after={b.after} beforeLabel={b.beforeLabel} afterLabel={b.afterLabel} caption={b.caption} bed={b.before} />
  : b.kind === "triptych" ? <PhotoTriptych durationInFrames={d} items={b.items} title={b.title} eyebrow={b.eyebrow} />
  : b.kind === "presenter" ? <RowePresenter durationInFrames={d} name="Dr. Emmett Rowe" mode={b.mode} img={b.img} bg={b.bg} kicker={b.kicker} role={b.role} cta="SUBSCRIBE" />
  : b.kind === "carousel" ? <RoweCarousel durationInFrames={d} mode={b.mode} cards={b.cards} reveals={b.reveals} offset={b.offset ?? 0} kicker={b.kicker} title={b.title} bed={b.bed} />
  : b.kind === "myth2" ? <MythTruth durationInFrames={d} kicker={b.kicker} myth={b.myth} truth={b.truth} mythImg={b.mythImg} truthImg={b.truthImg} bed={b.bed} hitAt={b.hitAt} truthAt={b.truthAt} />
  : b.kind === "redflags" ? <RedFlags durationInFrames={d} kicker={b.kicker} img={b.img} bed={b.bed} flags={b.flags} stamp={b.stamp} stampAt={b.stampAt} />
  : b.kind === "routineswap" ? <RoutineSwap durationInFrames={d} mode={b.mode} kicker={b.kicker} title={b.title} items={b.items} bed={b.bed} />
  : b.kind === "falltease" ? <FallTease durationInFrames={d} kicker={b.kicker} title={b.title} img={b.img} sideL={b.sideL} sideR={b.sideR} bed={b.bed} hitAt={b.hitAt} />
  : b.kind === "selfcheck" ? <SelfCheck durationInFrames={d} kicker={b.kicker} questions={b.questions} offset={b.offset ?? 0} bed={b.bed} />
  : null;

export const MainRowetowel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1D23" }}>
    <Audio src={staticFile("rowetowel.m4a")} />

    {BASE.map((b: any, i: number) => (
      <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
        {b.kind === "avatar" ? <AvatarWin src={b.reel ?? AVATAR_REEL} trimFrames={b.trim} seed={b.seed} />
          : b.kind === "clip" ? <Clip src={b.src} seed={b.seed} frames={b.frames} last={b.last} kbN={b.kbN} />
          : <Foto src={b.src} seed={b.seed} cont={b.cont} />}
      </Sequence>
    ))}

    {COMPS.map((c: any, i: number) => (
      <Sequence key={`c${i}`} from={c.from} durationInFrames={c.dur} layout="none">
        {renderComp(c, c.dur)}
      </Sequence>
    ))}

    {SFX.map((s: any, k: number) => (
      <Sequence key={`sfx${k}`} from={s.from} durationInFrames={75} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
