/**
 * Main_valvaselina15 — Doctora Valeria Alcázar · "15 Trucos de Belleza con Vaselina"
 * Cada cue cubre su tramo (el build garantiza 100% de cobertura): avatar = ventana InfiniteTalk · clip/foto = stock
 * Pexels / gpt-image+agnes · Val* = kit valeria · set-pieces 2.5D portados de Rowe (rebrandeados) · qr/lamina = conversión.
 * Audio: UN <Audio> con el máster (Fish) + SFX. Todo video va muteado.
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_SERIF_FINE, CLAMP, rgba, ValMood} from '../valeria/theme';
import {
  Kicker, Words, ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep,
  ValBeforeAfter, ValChecklist, ValOilCarousel, ValCarouselCard,
} from '../valeria/ValeriaKit';
import {Clip, Foto, AvatarWin} from './Piezas';
import {RecetarioQR, Lamina} from './Recetario';
import {MythTruth} from './rowe/MythTruth';
import {RedFlags} from './rowe/RedFlags';
import {RoutineSwap} from './rowe/RoutineSwap';
import {SelfCheck} from './rowe/SelfCheck';
import {FallTease} from './rowe/FallTease';
import {BEATS, SFX, TOTAL_FRAMES_VVS} from './cues_valvaselina15.gen';

const sf = (p?: string): string | undefined => (p ? (/^https?:|^\//.test(p) ? p : staticFile(p)) : undefined);
const ACC: Record<string, string> = {terracotta: VAL.terracotta, gold: VAL.gold, sage: VAL.sage};

const TalkOverlay: React.FC<{cue: any; beatF: number}> = ({cue, beatF}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const accent = ACC[cue.accent] || VAL.gold;
  const words = (cue.title ?? '').trim().split(/\s+/).filter(Boolean);
  const stagger = words.length > 1 ? Math.min(0.24, Math.max(0.09, 2.2 / words.length)) : 0;
  const out = interpolate(frame, [beatF - Math.round(0.45 * fps), beatF - 2], [0, 1], CLAMP);
  const k = spring({frame: frame - Math.round(0.22 * fps), fps, config: {damping: 20, stiffness: 100, mass: 0.8}});
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);
  const fontSize = Math.round(Math.min(width * 0.034, height * 0.054));
  return (
    <>
      <AbsoluteFill style={{opacity: 0.92 * scrimO, pointerEvents: 'none', background: `linear-gradient(to top, ${rgba(VAL.paper, 0.86)} 0%, ${rgba(VAL.paper, 0.32)} 26%, transparent 50%), radial-gradient(70% 60% at 14% 86%, ${rgba(VAL.paper, 0.55)}, transparent 72%)`}} />
      <div style={{position: 'absolute', left: '6%', bottom: '9.5%', width: '50%', opacity: 1 - out, transform: `translateY(${out * 26}px)`}}>
        {cue.kicker ? <Kicker text={cue.kicker} accent={accent} startSec={0.24} /> : null}
        {cue.title ? (
          <div style={{marginTop: height * 0.02}}>
            <Words text={cue.title} hot={cue.hot} accent={accent} startSec={0.5} size={fontSize} staggerSec={stagger} uppercase={false} />
          </div>
        ) : null}
        {cue.sub ? <div style={{marginTop: height * 0.02, paddingLeft: 16, borderLeft: `2px solid ${accent}`, fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: Math.round(fontSize * 0.5), color: VAL.ink2}}>{cue.sub}</div> : null}
      </div>
    </>
  );
};

const CueScene: React.FC<{cue: any; totalF: number}> = ({cue, totalF}) => {
  const accent = ACC[cue.accent] || VAL.gold;
  const mood = (cue.mood || 'gold') as ValMood;
  const variant = cue.variant || 'whip';
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} lastImg={cue.lastImg} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'chapter': return <ValChapter variant={variant} totalF={totalF} kicker={cue.kicker} index={cue.index} title={cue.title} sub={cue.sub} accent={accent} mood={mood} />;
    case 'hero': return <ValHero variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} side={cue.side || 'left'} />;
    case 'stat': return <ValStat variant={variant} totalF={totalF} kicker={cue.kicker} value={cue.value} suffix={cue.suffix} prefix={cue.prefix} decimals={cue.decimals} label={cue.label} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'quote': return <ValQuote variant={variant} totalF={totalF} kicker={cue.kicker} quote={cue.quote} author={cue.author} role={cue.role} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'molecule': return <ValMolecule variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} centerLabel={cue.centerLabel} image={sf(cue.image)} nodes={cue.nodes} accent={accent} mood={mood} />;
    case 'step': return <ValStep variant={variant} totalF={totalF} step={cue.step} total={cue.total} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'beforeafter': return <ValBeforeAfter variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} imageA={sf(cue.imageA)} imageB={sf(cue.imageB)} labelA={cue.labelA} labelB={cue.labelB} accent={accent} mood={mood} />;
    case 'checklist': return <ValChecklist variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} items={cue.items} accent={accent} mood={mood} />;
    case 'carousel':
      return <ValOilCarousel cards={(cue.cards || []).map((c: any) => ({...c, image: sf(c.image) as string})) as ValCarouselCard[]} focus={cue.focus} kicker={cue.kicker} accent={accent} intro={cue.intro} />;
    case 'mythtruth': return <MythTruth kicker={cue.kicker} myth={cue.myth} truth={cue.truth} mythImg={cue.mythImg} truthImg={cue.truthImg} hitAt={cue.hitAt} truthAt={cue.truthAt} durationInFrames={totalF} />;
    case 'redflags': return <RedFlags kicker={cue.kicker} img={cue.image} flags={cue.flags} stamp={cue.stamp} stampAt={cue.stampAt} durationInFrames={totalF} />;
    case 'routineswap': return <RoutineSwap mode={cue.mode} kicker={cue.kicker} title={cue.title} items={cue.items} chip={cue.chip} chipAt={cue.chipAt} durationInFrames={totalF} />;
    case 'selfcheck': return <SelfCheck kicker={cue.kicker} questions={cue.questions} offset={cue.offset} durationInFrames={totalF} />;
    case 'falltease': return <FallTease kicker={cue.kicker} title={cue.title} img={cue.image} sideL={cue.sideL} sideR={cue.sideR} hitAt={cue.hitAt} durationInFrames={totalF} />;
    case 'qr': return <RecetarioQR kicker={cue.kicker} title={cue.title} sub={cue.sub} pageImg={cue.pageImg} qrImg={cue.qrImg} url={cue.url} dur={totalF} />;
    case 'lamina': return <Lamina image={cue.image} stops={cue.stops || []} dur={totalF} />;
    default: return null;
  }
};

export const MainValVaselina15: React.FC = () => {
  const {fps} = useVideoConfig();
  const base = BEATS.filter((b: any) => b.kind !== 'talk');
  const talks = BEATS.filter((b: any) => b.kind === 'talk');
  const seq = (cue: any, el: (df: number) => React.ReactNode) => {
    const from = Math.round(cue.start * fps);
    const df = Math.max(1, Math.round(cue.dur * fps));
    return (
      <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
        {el(df)}
      </Sequence>
    );
  };
  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      <Audio src={staticFile('med/valvaselina15.m4a')} />
      {SFX.map((s: any, k: number) => (
        <Sequence key={`sfx${k}`} from={s.from} durationInFrames={75} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      {base.map((cue: any) => seq(cue, (df) => <CueScene cue={cue} totalF={df} />))}
      {talks.map((cue: any) => seq(cue, (df) => <TalkOverlay cue={cue} beatF={df} />))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_VVS;
export default MainValVaselina15;
