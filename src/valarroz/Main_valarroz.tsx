/**
 * Main_valarroz — Doctora Valeria Alcázar · "Clara de Huevo + 1 Cucharada de Maicena: Efecto Lifting en 20 Minutos"
 * Motor de Valeria (cues anclados al ms, 100 % de cobertura) con el MONTAJE DE DR. FEDERER (kit FedKit:
 * papel clínico, Oswald/Inter, teal, sellos rojos, tarjetas 3D sobre cama de foto real).
 *   avatar = ventana InfiniteTalk · clip/foto = stock · gen = gpt-image→agnes · resto = componentes FedKit ·
 *   talk = título Federer (o sello) encima de una ventana de avatar. Audio: UN <Audio> con el máster (Fish).
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Clip, Foto, AvatarWin, Gen} from './Piezas';
import {C, FedTalk, FedChapter, BigNumber, RedFlags, CrossList, CheckList, StepsPaper, MythFlip, SplitCompare, FactorChips, QuoteCard, StoryCard, QuestionCards, LoopCards, DayTimeline, RemedyBoard, MethodsTrio, FedRecipe, FedFaceZones, FedLamina, GuideCTA} from './FedKit';
import {BEATS, TOTAL_FRAMES_VV} from './cues_valarroz.gen';

const CueScene: React.FC<{cue: any}> = ({cue}) => {
  const p = cue;
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} from={cue.from} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'gen': return <Gen src={cue.src} still={cue.still} last={cue.last} seed={cue.seed} frames={cue.frames} />;
    case 'chapter': return <FedChapter {...p} />;
    case 'stat': return <BigNumber {...p} />;
    case 'redflags': return <RedFlags {...p} />;
    case 'cross': return <CrossList {...p} />;
    case 'checklist': return <CheckList {...p} />;
    case 'steps': return <StepsPaper {...p} />;
    case 'myth': return <MythFlip {...p} />;
    case 'split': return <SplitCompare {...p} />;
    case 'chips': return <FactorChips {...p} />;
    case 'quote': return <QuoteCard {...p} />;
    case 'story': return <StoryCard {...p} />;
    case 'questions': return <QuestionCards {...p} />;
    case 'loop': return <LoopCards {...p} />;
    case 'timeline': return <DayTimeline {...p} />;
    case 'board': return <RemedyBoard {...p} />;
    case 'trio': return <MethodsTrio {...p} />;
    case 'recipe': return <FedRecipe {...p} />;
    case 'zones': return <FedFaceZones {...p} />;
    case 'lamina': return <FedLamina {...p} />;
    case 'qrcta': return <GuideCTA {...p} />;
    default: return null;
  }
};

export const MainValArroz: React.FC = () => {
  const {fps} = useVideoConfig();
  const base = BEATS.filter((b: any) => b.kind !== 'talk');
  const talks = BEATS.filter((b: any) => b.kind === 'talk');
  const seq = (cue: any, el: React.ReactNode) => (
    <Sequence key={cue.id} from={Math.round(cue.start * fps)} durationInFrames={Math.max(1, Math.round(cue.dur * fps))} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
      {el}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      <Audio src={staticFile('med/valarroz.m4a')} />
      {base.map((cue: any) => seq(cue, <CueScene cue={cue} />))}
      {talks.map((cue: any) => seq(cue, <FedTalk kicker={cue.kicker} title={cue.title} hot={cue.hot} stamp={cue.stamp} tone={cue.tone} />))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_VV;
export default MainValArroz;
