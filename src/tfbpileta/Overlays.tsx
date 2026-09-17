// Overlays.tsx — tfbpileta: capas LIVIANAS encima del avatar (no tapan la cara, no desenfocan).
//   Kinetic = frase cinética ≤5 palabras (cinta de taller + palabra en óxido)
//   Eyebrow = rótulo tipo ficha técnica con cinta métrica, arriba a la izquierda
//   Sello   = sello de goma óxido/oro que golpea en la esquina
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {F_PLAYFAIR, F_GARAMOND} from '../VideoEdit/kit/premium/theme';
import {MARCA} from './Piezas';

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Sfx: React.FC<{src: string; at?: number; vol?: number}> = ({src, at = 0, vol = 0.35}) => (
  <Sequence from={at} durationInFrames={45} layout="none"><Audio src={staticFile(src)} volume={vol} /></Sequence>
);
const useOut = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], CL);
};

// cinta métrica dibujada (marcas cada cm)
const Cinta: React.FC<{w: number; p: number}> = ({w, p}) => (
  <svg width={w} height={26} style={{display: 'block'}}>
    <rect x={0} y={0} width={w * p} height={26} fill={MARCA.oro} rx={3} />
    {Array.from({length: Math.floor((w * p) / 12)}, (_, i) => (
      <line key={i} x1={i * 12 + 6} x2={i * 12 + 6} y1={0} y2={i % 5 === 0 ? 16 : 9} stroke={MARCA.espresso} strokeWidth={2} />
    ))}
  </svg>
);

export const Kinetic: React.FC<{words: {t: string; hl?: boolean}[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = useOut();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(46,33,25,0.72) 0%, rgba(46,33,25,0.25) 28%, transparent 46%)'}} />
      <Sfx src="sfx/sfx_whoosh_soft.mp3" at={2} vol={0.3} />
      <div style={{position: 'absolute', left: 110, bottom: 96, display: 'flex', flexWrap: 'wrap', gap: '10px 24px', maxWidth: 1200, alignItems: 'baseline'}}>
        {words.map((w, i) => {
          const at = 4 + i * 7;
          const p = spring({frame: frame - at, fps, config: {damping: 14, mass: 0.55, stiffness: 170}});
          if (frame < at - 1) return null;
          return (
            <span key={i} style={{position: 'relative', display: 'inline-block', transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`, opacity: p}}>
              {w.hl && <span style={{position: 'absolute', inset: '10px -14px 2px', background: MARCA.oxido, transform: `scaleX(${interpolate(p, [0.2, 1], [0, 1], CL)}) rotate(-1deg)`, transformOrigin: 'left', borderRadius: 4}} />}
              <span style={{position: 'relative', fontFamily: F_PLAYFAIR, fontWeight: 900, fontSize: 96, letterSpacing: -1, color: w.hl ? MARCA.crema : '#FFF8EA', textShadow: w.hl ? 'none' : '0 6px 26px rgba(0,0,0,0.65)'}}>{w.t}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{eyebrow: string; text: string}> = ({eyebrow, text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = useOut();
  const p = spring({frame: frame - 3, fps, config: {damping: 18, stiffness: 120}});
  const q = spring({frame: frame - 12, fps, config: {damping: 18, stiffness: 110}});
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <Sfx src="sfx/sfx_paper_tick.mp3" at={3} vol={0.35} />
      <div style={{position: 'absolute', left: 90, top: 80, transform: `translateX(${(1 - p) * -60}px)`, opacity: p}}>
        <div style={{background: 'rgba(241,228,201,0.95)', padding: '18px 30px 20px', borderLeft: `10px solid ${MARCA.oxido}`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)', borderRadius: 4, maxWidth: 820}}>
          <div style={{fontFamily: F_GARAMOND, fontSize: 30, letterSpacing: 5, textTransform: 'uppercase', color: MARCA.oxido, fontWeight: 700}}>{eyebrow}</div>
          <div style={{fontFamily: F_PLAYFAIR, fontSize: 56, fontWeight: 800, color: MARCA.espresso, lineHeight: 1.1, marginTop: 6, opacity: q, transform: `translateY(${(1 - q) * 14}px)`}}>{text}</div>
        </div>
        <div style={{marginTop: 8}}><Cinta w={420} p={q} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Sello: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = useOut();
  const s = spring({frame: frame - 6, fps, config: {damping: 11, mass: 0.6, stiffness: 200}});
  const scale = interpolate(s, [0, 1], [2.2, 1]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: out}}>
      <Sfx src="sfx/sfx_thump.mp3" at={8} vol={0.45} />
      <div style={{position: 'absolute', right: 110, top: 110, transform: `rotate(-8deg) scale(${scale})`, opacity: interpolate(s, [0, 0.3], [0, 1], CL), transformOrigin: 'center'}}>
        <div style={{border: `8px solid ${MARCA.oxido}`, outline: `3px solid ${MARCA.oxido}`, outlineOffset: 6, padding: '14px 34px', background: 'rgba(241,228,201,0.9)', textAlign: 'center', borderRadius: 6}}>
          <div style={{fontFamily: F_PLAYFAIR, fontWeight: 900, fontSize: 74, color: MARCA.oxido, letterSpacing: 3, lineHeight: 1}}>{text}</div>
          {sub ? <div style={{fontFamily: F_GARAMOND, fontSize: 32, color: MARCA.espresso, marginTop: 6, fontStyle: 'italic'}}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
