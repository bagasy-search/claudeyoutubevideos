/**
 * Main_valnivea — Doctora Valeria Alcázar · "Prepare la Crema de NIVEA, Póngala Antes de Dormir"
 * Motor (clon de valvasmix): cada cue cubre su tramo (el build garantiza 100 % de cobertura):
 *   avatar = ventana InfiniteTalk · clip/foto = stock Pexels · gen = gpt-image→agnes · Val y Nv = componentes ·
 *   talk = frase cinética encima de una ventana de avatar. Audio: UN <Audio> con el máster (Fish). Videos muteados.
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_SERIF_FINE, CLAMP, rgba, ValMood} from '../valeria/theme';
import {Kicker, Words, ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep, ValBeforeAfter, ValChecklist} from '../valeria/ValeriaKit';
import {Clip, Foto, AvatarWin, Gen} from './Piezas';
import {NvRecipe, NvDots, NvRedFlags, NvSwap, NvTin, NvLayers, NvMeasure, NvSelfCheck, NvSkinType, NvTimeline, NvMyth, NvLamina, NvQrCta} from './Sets';
import {BEATS, TOTAL_FRAMES_VN} from './cues_valnivea.gen';

const sf = (p?: string): string | undefined => (p ? (/^https?:|^\//.test(p) ? p : staticFile(p)) : undefined);

const TalkOverlay: React.FC<{cue: any; beatF: number}> = ({cue, beatF}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const accent = cue.accent || VAL.gold;
  const words = (cue.title ?? '').trim().split(/\s+/).filter(Boolean);
  const stagger = words.length > 1 ? Math.min(0.24, Math.max(0.09, 2.2 / words.length)) : 0;
  const subStart = 0.55 + stagger * Math.max(0, words.length - 1) + 0.35;
  const out = interpolate(frame, [beatF - Math.round(0.45 * fps), beatF - 2], [0, 1], CLAMP);
  const k = spring({frame: frame - Math.round(0.22 * fps), fps, config: {damping: 20, stiffness: 100, mass: 0.8}});
  const scrimO = interpolate(k, [0, 1], [0, 1], CLAMP) * (1 - out);
  const fontSize = Math.round(Math.min(width * 0.033, height * 0.052));
  return (
    <>
      <AbsoluteFill style={{opacity: 0.9 * scrimO, pointerEvents: 'none', background: `linear-gradient(to top, ${rgba(VAL.paper, 0.82)} 0%, ${rgba(VAL.paper, 0.3)} 26%, transparent 52%), radial-gradient(75% 65% at 16% 84%, ${rgba(VAL.paper, 0.5)}, transparent 72%)`}} />
      <div style={{position: 'absolute', left: '7%', bottom: '10.5%', width: '52%', opacity: 1 - out, transform: `translateY(${out * 26}px)`}}>
        {cue.kicker ? <Kicker text={cue.kicker} accent={accent} startSec={0.24} /> : null}
        {cue.title ? (
          <div style={{marginTop: height * 0.02}}>
            <Words text={cue.title} hot={cue.hot} accent={accent} startSec={0.5} size={fontSize} staggerSec={stagger} uppercase={false} />
          </div>
        ) : null}
        {cue.sub ? (
          <div style={{marginTop: height * 0.02, paddingLeft: 16, borderLeft: `2px solid ${accent}`, fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: Math.round(fontSize * 0.5), color: VAL.ink2, opacity: interpolate(frame, [Math.round(subStart * fps), Math.round((subStart + 0.5) * fps)], [0, 1], CLAMP)}}>
            {cue.sub}
          </div>
        ) : null}
      </div>
    </>
  );
};

const VARIANTS = ['whip', 'lift', 'iris', 'fold'] as const;

const CueScene: React.FC<{cue: any; totalF: number; n: number}> = ({cue, totalF, n}) => {
  const accent = cue.accent || VAL.gold;
  const mood = (cue.mood || 'gold') as ValMood;
  const variant = cue.variant && VARIANTS.includes(cue.variant) ? cue.variant : VARIANTS[n % VARIANTS.length];
  const p = {...cue, totalF};
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} from={cue.from} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'gen': return <Gen src={cue.src} still={cue.still} last={cue.last} seed={cue.seed} frames={cue.frames} />;
    case 'chapter': return <ValChapter variant={variant} totalF={totalF} kicker={cue.kicker} index={cue.index} title={cue.title} sub={cue.sub} accent={accent} mood={mood} />;
    case 'hero': return <ValHero variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} side={cue.side || 'left'} />;
    case 'stat': return <ValStat variant={variant} totalF={totalF} kicker={cue.kicker} value={cue.value} suffix={cue.suffix} prefix={cue.prefix} decimals={cue.decimals} label={cue.label} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'quote': return <ValQuote variant={variant} totalF={totalF} kicker={cue.kicker} quote={cue.quote} author={cue.author} role={cue.role} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'molecule': return <ValMolecule variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} centerLabel={cue.centerLabel} image={sf(cue.image)} nodes={cue.nodes} accent={accent} mood={mood} />;
    case 'step': return <ValStep variant={variant} totalF={totalF} step={cue.step} total={cue.total} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'beforeafter': return <ValBeforeAfter variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} imageA={sf(cue.imageA)} imageB={sf(cue.imageB)} labelA={cue.labelA} labelB={cue.labelB} accent={accent} mood={mood} />;
    case 'checklist': return <ValChecklist variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} items={cue.items} accent={accent} mood={mood} />;
    case 'recipe': return <NvRecipe {...p} />;
    case 'dots': return <NvDots {...p} />;
    case 'redflags': return <NvRedFlags {...p} />;
    case 'swap': return <NvSwap {...p} />;
    case 'tin': return <NvTin {...p} />;
    case 'layers': return <NvLayers {...p} />;
    case 'measure': return <NvMeasure {...p} />;
    case 'selfcheck': return <NvSelfCheck {...p} />;
    case 'skintype': return <NvSkinType {...p} />;
    case 'timeline': return <NvTimeline {...p} />;
    case 'myth': return <NvMyth {...p} />;
    case 'lamina': return <NvLamina {...p} />;
    case 'qrcta': return <NvQrCta {...p} />;
    default: return null;
  }
};

const SFX_IN: Record<string, string> = {chapter: 'sfx/cp_whoosh.wav', myth: 'sfx/chip_pop3d.mp3', lamina: 'sfx/cam_zoom_punch.mp3', qrcta: 'sfx/cp_whoosh.wav'};
const COMP = new Set(['chapter', 'hero', 'stat', 'quote', 'molecule', 'step', 'beforeafter', 'checklist', 'recipe', 'dots', 'redflags', 'swap', 'tin', 'layers', 'measure', 'selfcheck', 'skintype', 'timeline', 'myth', 'lamina', 'qrcta']);

export const MainValNivea: React.FC = () => {
  const {fps} = useVideoConfig();
  const base = BEATS.filter((b: any) => b.kind !== 'talk');
  const talks = BEATS.filter((b: any) => b.kind === 'talk');
  let nComp = 0;
  const seq = (cue: any, el: (df: number) => React.ReactNode, sfx?: string) => {
    const from = Math.round(cue.start * fps);
    const df = Math.max(1, Math.round(cue.dur * fps));
    return (
      <Sequence key={cue.id} from={from} durationInFrames={df} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
        {el(df)}
        {sfx ? <Audio src={staticFile(sfx)} volume={0.22} /> : null}
      </Sequence>
    );
  };
  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      <Audio src={staticFile('med/valnivea.m4a')} />
      {base.map((cue: any) => {
        const n = COMP.has(cue.kind) ? nComp++ : 0;
        return seq(cue, (df) => <CueScene cue={cue} totalF={df} n={n} />, COMP.has(cue.kind) ? SFX_IN[cue.kind] || 'sfx/cam_travel.mp3' : undefined);
      })}
      {talks.map((cue: any) => seq(cue, (df) => <TalkOverlay cue={cue} beatF={df} />))}
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = TOTAL_FRAMES_VN;
export default MainValNivea;
