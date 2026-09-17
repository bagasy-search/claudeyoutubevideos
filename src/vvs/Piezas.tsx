// Piezas.tsx — valvaselina15: planos crudos (clip de stock / agnes, foto, ventana de avatar) con Ken-Burns AL AZAR.
// ⛔ OffthreadVideo siempre (nunca <Video>), sin filtros de color. Clip más corto que el plano → sigue con su
//    ÚLTIMO CUADRO (jpg extraído) con la MISMA curva de Ken-Burns (nunca Loop: el salto se ve).
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const rnd = (s: number): number => {
  let t = (Math.floor(s) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const kenBurns = (frame: number, n: number, seed: number, base: number, ampMin: number, ampMax: number, pan: number) => {
  const r = (o: number) => rnd(seed * 7919 + o * 104729);
  const acerca = r(1) < 0.5;
  const amp = ampMin + r(2) * (ampMax - ampMin);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 35 + r(3) * 30, oy = 35 + r(4) * 30;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(pan, Math.max(0, techo));
  const ang = r(5) * Math.PI * 2;
  const k = interpolate(frame, [0, Math.max(2, n)], [0, 1], CL);
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};
const FILL: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover'};

export const Clip: React.FC<{src: string; seed: number; frames?: number; lastImg?: string}> = ({src, seed, frames, lastImg}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = kenBurns(frame, durationInFrames, seed, 1.03, 0.03, 0.07, 0.7);
  const cut = frames && lastImg && frames < durationInFrames ? frames - 1 : null;
  return (
    <AbsoluteFill style={{background: '#EFE3CC', overflow: 'hidden'}}>
      <AbsoluteFill style={t}>
        {cut == null ? (
          <OffthreadVideo src={staticFile(src)} muted style={FILL} />
        ) : (
          <>
            <Sequence durationInFrames={cut} layout="none"><OffthreadVideo src={staticFile(src)} muted style={FILL} /></Sequence>
            {frame >= cut ? <Img src={staticFile(lastImg as string)} style={{...FILL, position: 'absolute', inset: 0}} /> : null}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Foto: React.FC<{src: string; seed: number}> = ({src, seed}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = kenBurns(frame, durationInFrames, seed, 1.06, 0.07, 0.16, 1.3);
  return (
    <AbsoluteFill style={{background: '#EFE3CC', overflow: 'hidden'}}>
      <AbsoluteFill style={t}><Img src={staticFile(src)} style={FILL} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ventana de avatar: el clip ya viene cortado al audio de la ventana → muteado, push lento
export const AvatarWin: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, Math.max(2, durationInFrames)], [1.0, 1.05], CL);
  return (
    <AbsoluteFill style={{background: '#EFE3CC', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z.toFixed(4)})`, transformOrigin: '62% 36%'}}>
        <OffthreadVideo src={staticFile(src)} muted style={FILL} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
