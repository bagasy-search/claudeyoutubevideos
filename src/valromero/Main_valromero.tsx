/**
 * Main_valromero — Doctora Valeria Alcázar · "El Romero: 3 Remedios en Uno para Arrugas, Manchas y Canas"
 * Motor (clon de valvasmix): base CONTIGUA cuadro a cuadro (avatar por ventana · stock real · IA agnes · componentes)
 * + frases cinéticas encima de las ventanas de avatar + SFX en los golpes. Audio = UN <Audio> con el máster (Fish).
 * Todo video va muteado y por OffthreadVideo. Cues en ./cues_valromero.gen (build_valromero.mjs).
 */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_SERIF_FINE, CLAMP, rgba, ValMood} from '../valeria/theme';
import {Kicker, Words, ValChapter, ValHero, ValStat, ValQuote, ValMolecule, ValStep, ValBeforeAfter, ValChecklist} from '../valeria/ValeriaKit';
import {Clip, Foto, AvatarWin, AgShot} from './Piezas';
import {VrRecipe, VrDial, VrDrops, VrError, VrMyth, VrRedFlags, VrWeek, VrTimeline, VrTeaser, VrLamina, VrQr} from './VrPiezas';
import {BASE, TALK, SFX, TOTAL_FRAMES_VR} from './cues_valromero.gen';

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
      <div style={{position: 'absolute', left: '6%', bottom: '9%', width: '46%', opacity: 1 - out, transform: `translateY(${out * 26}px)`}}>
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

const CueScene: React.FC<{cue: any; totalF: number}> = ({cue, totalF}) => {
  const accent = cue.accent || VAL.gold;
  const mood = (cue.mood || 'gold') as ValMood;
  const variant = cue.variant || 'whip';
  switch (cue.kind) {
    case 'avatar': return <AvatarWin src={cue.src} />;
    case 'clip': return <Clip src={cue.src} seed={cue.seed} frames={cue.frames} />;
    case 'foto': return <Foto src={cue.src} seed={cue.seed} />;
    case 'ag': return <AgShot src={cue.src} last={cue.last} seed={cue.seed} clipDur={cue.clipDur} />;
    case 'chapter': return <ValChapter variant={variant} totalF={totalF} kicker={cue.kicker} index={cue.index} title={cue.title} sub={cue.sub} accent={accent} mood={mood} />;
    case 'hero': return <ValHero variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} side={cue.side || 'left'} />;
    case 'stat': return <ValStat variant={variant} totalF={totalF} kicker={cue.kicker} value={cue.value} suffix={cue.suffix} prefix={cue.prefix} decimals={cue.decimals} label={cue.label} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'quote': return <ValQuote variant={variant} totalF={totalF} kicker={cue.kicker} quote={cue.quote} author={cue.author} role={cue.role} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'molecule': return <ValMolecule variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} sub={cue.sub} centerLabel={cue.centerLabel} image={sf(cue.image)} nodes={cue.nodes} accent={accent} mood={mood} />;
    case 'step': return <ValStep variant={variant} totalF={totalF} step={cue.step} total={cue.total} title={cue.title} hot={cue.hot} sub={cue.sub} image={sf(cue.image)} accent={accent} mood={mood} />;
    case 'beforeafter': return <ValBeforeAfter variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} imageA={sf(cue.imageA)} imageB={sf(cue.imageB)} labelA={cue.labelA} labelB={cue.labelB} accent={accent} mood={mood} />;
    case 'checklist': return <ValChecklist variant={variant} totalF={totalF} kicker={cue.kicker} title={cue.title} hot={cue.hot} items={cue.items} accent={accent} mood={mood} />;
    case 'recipe': return <VrRecipe kicker={cue.kicker} title={cue.title} items={cue.items} ats={cue.ats} image={cue.image} note={cue.note} />;
    case 'dial': return <VrDial kicker={cue.kicker} value={cue.value} max={cue.max} unit={cue.unit} label={cue.label} image={cue.image} note={cue.note} />;
    case 'drops': return <VrDrops kicker={cue.kicker} title={cue.title} count={cue.count} image={cue.image} note={cue.note} />;
    case 'error': return <VrError index={cue.index} kicker={cue.kicker} title={cue.title} image={cue.image} hitAt={cue.hitAt} />;
    case 'myth': return <VrMyth kicker={cue.kicker} myth={cue.myth} truth={cue.truth} image={cue.image} flipAt={cue.flipAt} />;
    case 'redflags': return <VrRedFlags kicker={cue.kicker} title={cue.title} flags={cue.flags} ats={cue.ats} stamp={cue.stamp} stampAt={cue.stampAt} image={cue.image} />;
    case 'week': return <VrWeek kicker={cue.kicker} title={cue.title} rows={cue.rows} ats={cue.ats} image={cue.image} />;
    case 'timeline': return <VrTimeline kicker={cue.kicker} title={cue.title} marks={cue.marks} ats={cue.ats} image={cue.image} />;
    case 'teaser': return <VrTeaser kicker={cue.kicker} title={cue.title} note={cue.note} image={cue.image} />;
    case 'lamina': return <VrLamina image={cue.image} focus={cue.focus} />;
    case 'qr': return <VrQr kicker={cue.kicker} title={cue.title} sub={cue.sub} url={cue.url} qr={cue.qr} cover={cue.cover} pages={cue.pages} image={cue.image} tvLabel={cue.tvLabel} phoneLabel={cue.phoneLabel} hand={cue.hand} />;
    default: return null;
  }
};

export const MainValRomero: React.FC = () => (
  <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
    <Audio src={staticFile('valromero/valromero.m4a')} />
    {BASE.map((cue: any) => (
      <Sequence key={cue.id} from={cue.from} durationInFrames={cue.dur} premountFor={20} name={`${cue.kind} · ${cue.id}`}>
        <CueScene cue={cue} totalF={cue.dur} />
      </Sequence>
    ))}
    {TALK.map((cue: any) => (
      <Sequence key={cue.id} from={cue.from} durationInFrames={cue.dur} premountFor={20} name={`talk · ${cue.id}`}>
        <TalkOverlay cue={cue} beatF={cue.dur} />
      </Sequence>
    ))}
    {SFX.map((s: any, k: number) => (
      <Sequence key={`sfx${k}`} from={s.from} durationInFrames={75} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const TOTAL_FRAMES = TOTAL_FRAMES_VR;
export default MainValRomero;
