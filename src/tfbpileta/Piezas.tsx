// Piezas.tsx — tfbpileta: planos crudos (clip, foto, ventana de avatar) + tema de marca del Constructor Libre.
// ⛔ OffthreadVideo siempre, clip SIN loop: si el plano dura más que el clip, se congela el último cuadro
//    y la MISMA curva Ken-Burns sigue (regla agnes_qc: nunca repetir un clip).
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME_EARTH, F_PLAYFAIR, type Theme} from '../VideoEdit/kit/premium/theme';

export const MARCA = {crema: '#F1E4C9', espresso: '#2E2119', oxido: '#8B2D22', oro: '#B1832F', madera: '#6B4A2F'};

export const THEME_CONSTRUCTOR: Theme = {
  ...THEME_EARTH,
  name: 'constructor',
  fontDisplay: F_PLAYFAIR,
  color: {
    ...THEME_EARTH.color,
    bg0: '#F1E4C9', bg1: '#E9D9B8', bg2: '#DCC79F',
    surface: 'rgba(241,228,201,0.94)', surfaceStrong: '#F4EAD3',
    text: '#2E2119', textSoft: 'rgba(46,33,25,0.72)', textDim: 'rgba(46,33,25,0.45)',
    accent: '#8B2D22', accentSoft: '#C98A73', accent2: '#6B4A2F', gold: '#B1832F',
    danger: '#8B2D22', good: '#5F7A3A', ink: '#2E2119',
    line: 'rgba(46,33,25,0.18)', glow: 'rgba(177,131,47,0.5)', shadow: 'rgba(46,33,25,0.25)', onAccent: '#F7EEDC',
  },
  raysColor: 'rgba(177,131,47,0.16)',
};

export const rnd = (s: number): number => {
  let t = (Math.floor(s) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number, pan: number) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed * 7919 + o * 104729);
  const acerca = r(1) < 0.5;
  const amp = ampMin + r(2) * (ampMax - ampMin);
  const desde = acerca ? base : base + amp, hasta = acerca ? base + amp : base;
  const ox = 35 + r(3) * 30, oy = 35 + r(4) * 30;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(pan, Math.max(0, techo));
  const ang = r(5) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], CL);
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

const FILL: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover'};

export const Clip: React.FC<{src: string; seed: number; frames?: number}> = ({src, seed, frames}) => {
  const t = useKenBurns(seed, 1.03, 0.03, 0.06, 0.6);
  const {durationInFrames} = useVideoConfig();
  const n = frames && frames > 1 ? frames - 1 : durationInFrames;
  return (
    <AbsoluteFill style={{background: MARCA.espresso, overflow: 'hidden'}}>
      <AbsoluteFill style={t}>
        {durationInFrames <= n ? (
          <OffthreadVideo src={staticFile(src)} muted style={FILL} />
        ) : (
          <>
            <Sequence durationInFrames={n} layout="none"><OffthreadVideo src={staticFile(src)} muted style={FILL} /></Sequence>
            <Sequence from={n} layout="none"><Freeze frame={n - 1}><OffthreadVideo src={staticFile(src)} muted style={FILL} /></Freeze></Sequence>
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Foto: React.FC<{src: string; seed: number}> = ({src, seed}) => {
  const t = useKenBurns(seed, 1.06, 0.06, 0.16, 1.3);
  return (
    <AbsoluteFill style={{background: MARCA.espresso, overflow: 'hidden'}}>
      <AbsoluteFill style={t}><Img src={staticFile(src)} style={FILL} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ventana de avatar: clip cortado exacto al audio de la ventana → muteado. punch = zoom-punch de entrada.
export const AvatarWin: React.FC<{src: string; punch?: number; seed?: number}> = ({src, punch, seed = 0}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const lento = rnd(seed * 31 + 7) < 0.5 ? [1.0, 1.05] : [1.05, 1.0];
  let z = interpolate(frame, [0, Math.max(2, durationInFrames)], lento, CL);
  if (punch) z *= interpolate(frame, [0, 3, 9], [1.14, 1.1, 1.0], CL);
  return (
    <AbsoluteFill style={{background: MARCA.espresso, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z.toFixed(4)})`, transformOrigin: '50% 36%'}}>
        <OffthreadVideo src={staticFile(src)} muted style={FILL} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
