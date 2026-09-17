/**
 * Main_valojeras — Doctora Valeria Alcázar · "Contorno de Ojos de $1: Elimine Bolsas y Ojeras"
 * Audio = UN <Audio> con el máster Fish (voz `valeria`). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
 * (reel `valojeras_avatar.mp4`, recortado con trimBefore). Todo video por OffthreadVideo, muteado.
 * Base (avatar/clip/foto) cubre 100 %; encima componentes Val* + set-pieces Valeria (claro) + SFX.
 * ⛔ Todas las props de texto e imagen llegan por props (el kit trae defaults de otros videos).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Foto, Clip, AvatarWin } from "./Piezas";
import { BASE, COMPS, SFX, TOTAL_FRAMES } from "./cues.gen";
import { ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep, ValBeforeAfter, ValChecklist } from "../valeria/ValeriaKit";
import { VAL } from "../valeria/theme";
import { MythTruth } from "./MythTruth";
import { RedFlags } from "./RedFlags";
import { RoutineSwap } from "./RoutineSwap";
import { SelfCheck } from "./SelfCheck";
import { FallTease } from "./FallTease";
import { RecipePanel, Lamina, QrCta, Timeline, TalkOverlay } from "./Custom";

export const TOTAL_FRAMES_VALOJERAS = TOTAL_FRAMES;
const AVATAR_REEL = "valojeras_avatar.mp4";
const sf = (p?: string) => (p ? staticFile(p) : undefined);

const renderComp = (b: any, d: number) => {
  const acc = b.accent || VAL.gold;
  switch (b.kind) {
    case "chapter": return <ValChapter variant="whip" totalF={d} kicker={b.kicker} index={b.index} title={b.title} sub={b.sub ?? ""} accent={acc} mood="gold" />;
    case "hero": return <ValHero variant="whip" totalF={d} kicker={b.kicker} title={b.title} hot={b.hot} sub={b.sub ?? ""} image={sf(b.img)} accent={acc} mood="gold" side={b.side || "left"} />;
    case "stat": return <ValStat variant="whip" totalF={d} kicker={b.kicker} value={b.value} suffix={b.suffix} prefix={b.prefix ?? ""} decimals={0} label={b.label} sub={b.sub ?? ""} image={sf(b.img)} accent={acc} mood="gold" />;
    case "quote": return <ValQuote variant="whip" totalF={d} kicker={b.kicker} quote={b.quote} author={b.author} role={b.role} image={sf(b.img)} accent={acc} mood="gold" />;
    case "molecule": return <ValMolecule variant="whip" totalF={d} kicker={b.kicker} title={b.title} hot={b.hot} sub={b.sub ?? ""} centerLabel={b.centerLabel} image={sf(b.img)} nodes={b.nodes} accent={acc} mood="gold" />;
    case "step": return <ValStep variant="whip" totalF={d} step={b.step} total={b.total} title={b.title} hot={b.hot} sub={b.sub ?? ""} image={sf(b.img)} accent={acc} mood="gold" />;
    case "beforeafter": return <ValBeforeAfter variant="whip" totalF={d} kicker={b.kicker} title={b.title} hot={b.hot} imageA={sf(b.imageA)} imageB={sf(b.imageB)} labelA={b.labelA} labelB={b.labelB} accent={acc} mood="gold" />;
    case "checklist": return <ValChecklist variant="whip" totalF={d} kicker={b.kicker} title={b.title} hot={b.hot} items={b.items} accent={acc} mood="gold" />;
    case "talk": return <TalkOverlay durationInFrames={d} kicker={b.kicker} title={b.title} hot={b.hot} />;
    case "recipe": return <RecipePanel durationInFrames={d} kicker={b.kicker} title={b.title} img={b.img} items={b.items} />;
    case "lamina": return <Lamina durationInFrames={d} img={b.img} zooms={b.zooms} />;
    case "qrcta": return <QrCta durationInFrames={d} kicker={b.kicker} title={b.title} sub={b.sub} page={b.page} cover={b.cover} qr={b.qr} tvAt={b.tv} phoneAt={b.phone} />;
    case "timeline": return <Timeline durationInFrames={d} kicker={b.kicker} title={b.title} marks={b.marks} />;
    case "myth2": return <MythTruth durationInFrames={d} kicker={b.kicker} myth={b.myth} truth={b.truth} mythImg={b.mythImg} truthImg={b.truthImg} bed={b.mythImg} hitAt={b.hitAt} truthAt={b.truthAt} />;
    case "redflags": return <RedFlags durationInFrames={d} kicker={b.kicker} img={b.img} bed={b.img} flags={b.flags} stamp={b.stamp} stampAt={b.stampAt} />;
    case "routineswap": return <RoutineSwap durationInFrames={d} mode={b.mode} kicker={b.kicker} title={b.title} items={b.items} bed={b.items?.[0]?.img} chip={b.chip} chipAt={b.chipAt} />;
    case "falltease": return <FallTease durationInFrames={d} kicker={b.kicker} title={b.title} img={b.img} bed={b.img} hitAt={b.hitAt} />;
    case "selfcheck": return <SelfCheck durationInFrames={d} kicker={b.kicker} questions={(b.questions || []).map((q: any) => ({ ...q, img: q.img ?? b.img }))} offset={0} bed={b.img} />;
    default: return null;
  }
};

export const MainValojeras: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: VAL.paper }}>
    <Audio src={staticFile("valojeras.m4a")} />
    {BASE.map((b: any, i: number) => (
      <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
        {b.kind === "avatar" ? <AvatarWin src={AVATAR_REEL} trimFrames={b.trim} seed={b.seed} />
          : b.kind === "clip" ? <Clip src={b.src} seed={b.seed} frames={b.frames} last={b.last} kbN={b.kbN} />
          : <Foto src={b.src} seed={b.seed} cont={b.cont} />}
      </Sequence>
    ))}
    {COMPS.map((c: any, i: number) => (
      <Sequence key={`c${i}`} from={c.from} durationInFrames={c.dur} layout="none" premountFor={20}>
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
export default MainValojeras;
