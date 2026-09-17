/**
 * Main_tfbpileta — El Constructor Libre · "NUNCA Destapes la Pileta con Bicarbonato y Vinagre — Usá Esto"
 * Base contigua (build garantiza cobertura): avatar (ventana RunPod) · clip (stock Pexels / agnes) · foto ·
 *   comp (kit premium sobre foto de cama) · lamina · cta. Encima: overlays livianos sobre el avatar.
 * Audio: UN <Audio> con el máster (Fish). Todo video muteado. Beats en ./cues_tfbpileta.gen
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {PremiumOverlay} from '../VideoEdit/scenes/PremiumOverlay';
import {
  HookCaption, FlowSteps, CutawayCallouts, ChapterTitle, BigStatReveal, KaraokePhrase, VsDuel, ChecklistReveal,
  TierRanking, MythTruth, MapPinPoint, TimelinePlayhead, BeforeAfter, LayerStack, PhotoCarousel, NumberedSteps,
  DuelColumns, BulletCascade, SplitPanel, PullQuote, CycleLoop, StampBadge,
} from '../VideoEdit/kit/premium';
import {Clip, Foto, AvatarWin, THEME_CONSTRUCTOR as TH} from './Piezas';
import {Kinetic, Eyebrow, Sello} from './Overlays';
import {LaminaZoom, ColeccionCta} from './Ficha';
import {BEATS, TOTAL_FRAMES_TFBPILETA} from './cues_tfbpileta.gen';

const Comp: React.FC<{cue: any; d: number}> = ({cue, d}) => {
  const p = {durationInFrames: d, theme: TH};
  switch (cue.ck) {
    case 'hook': return <HookCaption {...p} words={cue.words} sub={cue.sub} />;
    case 'flow': return <FlowSteps {...p} kicker={cue.kicker} title={cue.title} nodes={cue.nodes} />;
    case 'cutaway': return <CutawayCallouts {...p} eyebrow={cue.eyebrow} title={cue.title} image={cue.image} callouts={cue.callouts} />;
    case 'chapter': return <ChapterTitle {...p} number={cue.number} title={cue.title} sub={cue.sub} />;
    case 'stat': return <BigStatReveal {...p} eyebrow={cue.eyebrow} value={cue.value} prefix={cue.prefix} suffix={cue.suffix} support={cue.support} source={cue.source} />;
    case 'karaoke': return <KaraokePhrase {...p} eyebrow={cue.eyebrow} phrase={cue.phrase} />;
    case 'vs': return <VsDuel {...p} eyebrow={cue.eyebrow} title={cue.title} left={cue.left} right={cue.right} />;
    case 'checklist': return <ChecklistReveal {...p} kicker={cue.kicker} title={cue.title} items={cue.items} stamp={cue.stamp} />;
    case 'tier': return <TierRanking {...p} title={cue.title} rows={cue.rows} />;
    case 'myth': return <MythTruth {...p} myth={cue.myth} truth={cue.truth} mythLabel={cue.mythLabel} truthLabel={cue.truthLabel} />;
    case 'map': return <MapPinPoint {...p} place={cue.place} region={cue.region} x={cue.x} y={cue.y} />;
    case 'timeline': return <TimelinePlayhead {...p} title={cue.title} events={cue.events} />;
    case 'beforeafter': return <BeforeAfter {...p} eyebrow={cue.eyebrow} beforeLabel={cue.beforeLabel} afterLabel={cue.afterLabel} beforeImage={cue.beforeImage} afterImage={cue.afterImage} caption={cue.caption} />;
    case 'layers': return <LayerStack {...p} title={cue.title} layers={cue.layers} />;
    case 'carousel': return <PhotoCarousel {...p} title={cue.title} items={cue.items} shutter />;
    case 'steps': return <NumberedSteps {...p} eyebrow={cue.eyebrow} title={cue.title} steps={cue.steps} />;
    case 'duel': return <DuelColumns {...p} title={cue.title} leftName={cue.leftName} rightName={cue.rightName} rows={cue.rows} />;
    case 'bullets': return <BulletCascade {...p} eyebrow={cue.eyebrow} bullets={cue.bullets} />;
    case 'split': return <SplitPanel {...p} eyebrow={cue.eyebrow} title={cue.title} image={cue.image} bullets={cue.bullets} />;
    case 'quote': return <PullQuote {...p} quote={cue.quote} author={cue.author} role={cue.role} image={cue.image} />;
    case 'cycle': return <CycleLoop {...p} title={cue.title} center={cue.center} nodes={cue.nodes} />;
    case 'karaoke2': return <KaraokePhrase {...p} eyebrow={cue.eyebrow} phrase={cue.phrase} />;
    case 'stamp': return <StampBadge {...p} text={cue.text} sub={cue.sub} />;
    default: return null;
  }
};

const Base: React.FC<{cue: any; d: number}> = ({cue, d}) => {
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} punch={cue.punch} seed={cue.seed} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'comp':
      return (
        <AbsoluteFill>
          <Foto src={cue.bed} seed={cue.seed} />
          <PremiumOverlay durationInFrames={d} zone={cue.zone || 'center'} theme={TH}><Comp cue={cue} d={d} /></PremiumOverlay>
        </AbsoluteFill>
      );
    case 'lamina': return <LaminaZoom src={cue.src} keys={cue.keys} />;
    case 'cta': return <ColeccionCta v={cue.v} cover={cue.cover} peeks={cue.peeks} qr={cue.qr} bed={cue.bed} url={cue.url} kicker={cue.kicker} items={cue.items} />;
    default: return null;
  }
};

const Over: React.FC<{cue: any}> = ({cue}) => {
  switch (cue.ok) {
    case 'frase': return <Kinetic words={cue.words} />;
    case 'eyebrow': return <Eyebrow eyebrow={cue.eyebrow} text={cue.text} />;
    case 'stamp': return <Sello text={cue.text} sub={cue.sub} />;
    default: return null;
  }
};

export const MainTfbpileta: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (cue: any, el: (df: number) => React.ReactNode) => {
    const from = Math.round(cue.start * fps);
    const df = Math.max(1, Math.round(cue.dur * fps));
    return (
      <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
        {el(df)}
      </Sequence>
    );
  };
  const base = BEATS.filter((b: any) => b.kind !== 'over');
  const over = BEATS.filter((b: any) => b.kind === 'over');
  return (
    <AbsoluteFill style={{background: '#2E2119', overflow: 'hidden'}}>
      <Audio src={staticFile('tfbpileta.m4a')} />
      {base.map((cue: any) => seq(cue, (df) => <Base cue={cue} d={df} />))}
      {over.map((cue: any) => seq(cue, () => <Over cue={cue} />))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_TFBPILETA;
export default MainTfbpileta;
