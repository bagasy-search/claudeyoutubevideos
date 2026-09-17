// Piezas.tsx — tfbtapa (clon de valvasmix): planos crudos (clip, foto, ventana de avatar) con Ken-Burns AL AZAR.
// ⛔ OffthreadVideo siempre (nunca <Video>), sin filtros de color.
// ⭐ Clip más corto que su plano: el clip corre hasta su último cuadro y ahí se CONGELA (Freeze), con la MISMA curva
//    de Ken-Burns calculada sobre el plano entero → sin loop, sin repetir movimiento, sin tirón.
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const rnd = (s: number): number => {
  let t = (Math.floor(s) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number, pan: number) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r = (o: number) => rnd(seed * 7919 + o * 104729);
  const acerca = r(1) < 0.5;
  const amp = ampMin + r(2) * (ampMax - ampMin);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
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
  const frame = useCurrentFrame();
  const t = useKenBurns(seed, 1.03, 0.03, 0.07, 0.7);
  const v = <OffthreadVideo src={staticFile(src)} muted style={FILL} />;
  const last = frames && frames > 1 ? frames - 2 : 0;
  return (
    <AbsoluteFill style={{background: '#1b1512', overflow: 'hidden'}}>
      <AbsoluteFill style={t}>{last && frame > last ? <Freeze frame={last}>{v}</Freeze> : v}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Foto: React.FC<{src: string; seed: number}> = ({src, seed}) => {
  const t = useKenBurns(seed, 1.06, 0.06, 0.16, 1.3);
  return (
    <AbsoluteFill style={{background: '#1b1512', overflow: 'hidden'}}>
      <AbsoluteFill style={t}><Img src={staticFile(src)} style={FILL} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ventana de avatar: el clip ya viene cortado al audio de la ventana → startFrom 0, muteado, push lento
export const AvatarWin: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, Math.max(2, durationInFrames)], [1.0, 1.045], CL);
  return (
    <AbsoluteFill style={{background: '#1b1512', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z.toFixed(4)})`, transformOrigin: '50% 38%'}}>
        <OffthreadVideo src={staticFile(src)} muted style={FILL} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
