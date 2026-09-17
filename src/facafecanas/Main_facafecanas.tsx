import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Foto, Clip, AvatarWin } from "./Piezas";
import { BASE, COMPS, SFX, TOTAL_FRAMES } from "./cues.gen";
import { LowerThird } from "../_fed6/VideoEdit/scenes/LowerThird";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { HourDial } from "../_fed6/VideoEdit/scenes/HourDial";
import { ListaFlotante } from "../_fed6/VideoEdit/scenes/ListaFlotante";
import { ScalpDive } from "../_fed6/VideoEdit/scenes/ScalpDive";
import { MythTruth, RedFlags, RoutineSwap, LockTease, Carousel } from "./Sets";
import { HookSplit, Lamina, GuiaCTA, Compare2, DatoCard, Hitos, Presenter } from "./Hero";

// ── CANAL "Federer Archivos" (ES) · facafecanas ─────────────────────────────────────────────
// Audio = máster Fish (voz federer_s4). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
// (reel conformado a 30 CFR, recortado con trimBefore). Todo video por OffthreadVideo.
// ⛔ Todas las props de texto se pasan desde el plan (los defaults del kit son de otros videos).
export const TOTAL_FRAMES_FACAFECANAS = TOTAL_FRAMES;
const AVATAR_REEL = "facafecanas/facafecanas_avatar.mp4";

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker ?? "DR. FEDERER"} tag="DR. FEDERER" tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "listaflotante" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} items={b.items} prompt={b.prompt} tone={b.tone} />
  : b.kind === "scalpdive" ? <ScalpDive durationInFrames={d} labelTop={b.labelTop} labelRoot={b.labelRoot} />
  : b.kind === "myth2" ? <MythTruth durationInFrames={d} kicker={b.kicker} myth={b.myth} truth={b.truth} mythImg={b.mythImg} truthImg={b.truthImg} bed={b.bed} hitAt={b.hitAt} truthAt={b.truthAt} />
  : b.kind === "redflags" ? <RedFlags durationInFrames={d} kicker={b.kicker} img={b.img} bed={b.bed} flags={b.flags} stamp={b.stamp} stampAt={b.stampAt} />
  : b.kind === "routineswap" ? <RoutineSwap durationInFrames={d} kicker={b.kicker} title={b.title} items={b.items} bed={b.bed} />
  : b.kind === "locktease" ? <LockTease durationInFrames={d} kicker={b.kicker} title={b.title} img={b.img} sideL={b.sideL} sideR={b.sideR} bed={b.bed} hitAt={b.hitAt} openAt={b.openAt} />
  : b.kind === "carousel" ? <Carousel durationInFrames={d} mode={b.mode} cards={b.cards} reveals={b.reveals} offset={0} kicker={b.kicker} title={b.title} bed={b.bed} />
  : b.kind === "hooksplit" ? <HookSplit durationInFrames={d} before={b.before} after={b.after} beforeLabel={b.beforeLabel} afterLabel={b.afterLabel} badge={b.badge} />
  : b.kind === "lamina" ? <Lamina durationInFrames={d} image={b.image} points={b.points} />
  : b.kind === "guiacta" ? <GuiaCTA durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} kicker={b.kicker} title={b.title} tvLine={b.tvLine} phoneLine={b.phoneLine} bed={b.bed} />
  : b.kind === "compare2" ? <Compare2 durationInFrames={d} kicker={b.kicker} left={b.left} right={b.right} rightAt={b.rightAt} bed={b.bed} />
  : b.kind === "datocard" ? <DatoCard durationInFrames={d} figure={b.figure} unit={b.unit} caption={b.caption} image={b.image} side={b.side} tone={b.tone} />
  : b.kind === "hitos" ? <Hitos durationInFrames={d} kicker={b.kicker} title={b.title} items={b.items} bed={b.bed} />
  : b.kind === "presenter" ? <Presenter durationInFrames={d} name={b.name} role={b.role} img={b.img} />
  : null;

export const MainFacafecanas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FBF7EE" }}>
    <Audio src={staticFile("facafecanas/facafecanas.m4a")} />
    {BASE.map((b: any, i: number) => (
      <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
        {b.kind === "avatar" ? <AvatarWin src={AVATAR_REEL} trimFrames={b.trim} seed={b.seed} />
          : b.kind === "clip" ? <Clip src={b.src} seed={b.seed} frames={b.frames} />
          : <Foto src={b.src} seed={b.seed} />}
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
