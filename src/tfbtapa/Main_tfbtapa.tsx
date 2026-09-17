/**
 * Main_tfbtapa — El Constructor Libre · "Limpiá el Sillón y las Alfombras en Minutos con una Tapa de Olla"
 * Motor valvasmix (base contigua: avatar RunPod por ventanas / stock Pexels / fotos gpt-image animadas con agnes)
 * + overlays del kit premium con THEME_TALLER + set-pieces propios (LaminaZoom, CtaColeccion, TalkOverlay).
 * Audio: UN <Audio> con el máster (Fish). Todo video va muteado. Beats en ./cues_tfbtapa.gen
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {
  HookCaption, StampBadge, FlowSteps, NumberedSteps, ChecklistReveal, MythTruth, BigStatReveal, GaugeDial, ChapterTitle,
  MapPinPoint, BeforeAfter, CutawayCallouts, TierRanking, LayerStack, HighlightSweep, PhotoCarousel, VsDuel, BulletCascade,
  FloatingCutout, TimelinePlayhead, CycleLoop, KaraokePhrase, PullQuote, DuelColumns, SplitPanel, StatGrid,
} from '../VideoEdit/kit/premium';
import {PremiumOverlay} from '../VideoEdit/scenes/PremiumOverlay';
import {Clip, Foto, AvatarWin} from './Piezas';
import {THEME_TALLER as T, TalkOverlay, LaminaZoom, CtaColeccion} from './SetPieces';
import {BEATS, TOTAL_FRAMES_TFBTAPA} from './cues_tfbtapa.gen';

const ZONE: Record<string, any> = {hook: 'full', stamp: 'full', karaoke: 'full', sweep: 'full', highlight: 'full', quote: 'left', map: 'full'};

export const Overlay: React.FC<{c: any; d: number}> = ({c, d}) => {
  const p = {durationInFrames: d, theme: T};
  switch (c.kind) {
    case 'hook': return <HookCaption {...p} words={c.words} sub={c.sub} />;
    case 'stamp': return <StampBadge {...p} text={c.text} sub={c.sub} x={c.x} y={c.y} color={T.color.accent} />;
    case 'kit': return <FlowSteps {...p} kicker={c.eyebrow} title={c.title ?? ''} nodes={c.items} />;
    case 'flow': return <FlowSteps {...p} kicker={c.kicker} title={c.title} nodes={c.nodes} />;
    case 'steps': return <NumberedSteps {...p} eyebrow={c.eyebrow} title={c.title} steps={c.steps} />;
    case 'checklist': case 'redflags': return <ChecklistReveal {...p} kicker={c.kicker ?? c.eyebrow} title={c.title ?? ''} items={c.items} stamp={c.stamp} />;
    case 'recap': return <ChecklistReveal {...p} kicker={c.eyebrow} title={c.title} items={c.steps.map((s: any) => s.title)} stamp="GUÁRDALO" />;
    case 'errorok': return <MythTruth {...p} myth={c.myth} truth={c.truth} mythLabel="Error" truthLabel="Correcto" />;
    case 'stat': return <BigStatReveal {...p} eyebrow={c.eyebrow} value={c.value} prefix={c.prefix} suffix={c.suffix} support={c.support} source="" />;
    case 'gauge': return <GaugeDial {...p} eyebrow={c.eyebrow} label={c.label} value={c.value} suffix={c.suffix} zones />;
    case 'tease': return <ChapterTitle {...p} number="?" title={c.title} sub={c.sub} />;
    case 'map': return <MapPinPoint {...p} place={c.place} region={c.region} x={c.x} y={c.y} />;
    case 'split': case 'beforeafter': return <BeforeAfter {...p} eyebrow={c.eyebrow} beforeLabel={c.beforeLabel} afterLabel={c.afterLabel} beforeImage={c.imageA} afterImage={c.imageB} caption={c.caption} />;
    case 'callouts': return <CutawayCallouts {...p} eyebrow={c.eyebrow} title={c.title} image={c.image} callouts={c.callouts} />;
    case 'tier': return <TierRanking {...p} title={c.title} rows={c.rows} />;
    case 'layers': return <LayerStack {...p} title={c.title} layers={c.layers} />;
    case 'sweep': case 'highlight': return <HighlightSweep {...p} pre={c.pre} highlight={c.highlight} post={c.post} note={c.note} />;
    case 'carousel': return <PhotoCarousel {...p} title={c.title} items={c.items} shutter />;
    case 'vs': return <VsDuel {...p} eyebrow={c.eyebrow} title={c.title} left={c.left} right={c.right} />;
    case 'bullets': return <BulletCascade {...p} eyebrow={c.eyebrow} bullets={c.bullets} />;
    case 'cutout': return <FloatingCutout {...p} image={c.image} label={c.label} sub={c.sub} />;
    case 'timeline': return <TimelinePlayhead {...p} title={c.title} events={c.events} />;
    case 'cycle': return <CycleLoop {...p} title={c.title} center={c.center} nodes={c.nodes} />;
    case 'karaoke': return <KaraokePhrase {...p} eyebrow={c.eyebrow} phrase={c.phrase} />;
    case 'quote': return <PullQuote {...p} quote={c.quote} author={c.author} role={c.role} image={c.image} />;
    case 'duel': return <DuelColumns {...p} title={c.title} leftName={c.leftName} rightName={c.rightName} rows={c.rows} />;
    case 'split2': case 'splitpanel': return <SplitPanel {...p} eyebrow={c.eyebrow} title={c.title} image={c.image} bullets={c.bullets} />;
    case 'grid': return <StatGrid {...p} title={c.title} stats={c.stats} />;
    default: return null;
  }
};

const Base: React.FC<{cue: any}> = ({cue}) => {
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'lamina': return <LaminaZoom img={cue.img} hits={cue.hits} />;
    case 'cta': return <CtaColeccion eyebrow={cue.eyebrow} title={cue.title} bullets={cue.bullets} qrP={cue.qrP} pages={cue.pages} cover={cue.cover} qr={cue.qr} />;
    default: return null;
  }
};

export const MainTfbtapa: React.FC = () => {
  const {fps} = useVideoConfig();
  const base = BEATS.filter((b: any) => !b.layer);
  const tops = BEATS.filter((b: any) => b.layer);
  const seq = (cue: any, el: (df: number) => React.ReactNode) => {
    const from = Math.round(cue.start * fps);
    const df = Math.max(1, Math.round(cue.dur * fps));
    return <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={20} name={`${cue.kind} · ${cue.id}`}>{el(df)}</Sequence>;
  };
  return (
    <AbsoluteFill style={{background: T.color.bg0, overflow: 'hidden'}}>
      <Audio src={staticFile('tfbtapa/tfbtapa.m4a')} />
      {base.map((cue: any) => seq(cue, () => <Base cue={cue} />))}
      {tops.map((cue: any) => seq(cue, (df) => (cue.kind === 'talk'
        ? <TalkOverlay kicker={cue.kicker} title={cue.title} hot={cue.hot} />
        : <PremiumOverlay durationInFrames={df} zone={ZONE[cue.kind] || 'top'} theme={T}><Overlay c={cue} d={df} /></PremiumOverlay>)))}
    </AbsoluteFill>
  );
};
export const TOTAL_FRAMES = TOTAL_FRAMES_TFBTAPA;
export default MainTfbtapa;
