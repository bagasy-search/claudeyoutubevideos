/**
 * BRollCard — foto de b-roll (objeto/comida) en una TARJETA DE VIDRIO FLOTANTE con profundidad.
 * Reemplaza la foto plana a pantalla completa: mismo idioma que el carrusel/RenalItemCard pero sin
 * número — para todos los planos de objeto del video. Fondo: la MISMA foto, ampliada y desenfocada
 * (cama de profundidad), + tarjeta nítida flotando con parallax y push lento + chip de caption.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_SANS, rgba} from './theme';

type Props = {img: string; caption?: string; dur: number; side?: 'left' | 'right'; accent?: string};

export const BRollCard: React.FC<Props> = ({img, caption, dur, side = 'right', accent = BAS.aqua}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const easeOut = Easing.out(Easing.cubic);
  const easeIO = Easing.bezier(0.4, 0, 0.2, 1);
  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const src = img.includes('.') ? `img/${img}` : `img/${img}.png`;

  const enter = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: easeOut});
  const focus = interpolate(frame, [10, 34], [0, 1], {...clamp, easing: easeIO});
  const breathe = Math.sin((frame / fps) * Math.PI * 0.85) * 5;
  const camX = interpolate(frame, [0, dur], [side === 'right' ? -18 : 18, 10 * (side === 'right' ? 1 : -1)], {easing: easeIO});
  const push = interpolate(frame, [0, dur], [1.0, 1.05]);
  const dir = side === 'right' ? 1 : -1;

  return (
    <AbsoluteFill style={{background: '#05161f', perspective: 1400, overflow: 'hidden'}}>
      {/* cama de profundidad: la misma foto ampliada y desenfocada */}
      <AbsoluteFill style={{transform: `scale(1.25) translateX(${camX * 0.3}px)`}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(26px) saturate(0.8) brightness(0.5)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(90% 100% at 50% 45%, transparent 40%, ${rgba('#03080C', 0.72)} 100%)`}} />

      {/* tarjeta nítida flotante */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d', transform: `translateX(${camX}px)`}}>
        <div
          style={{
            width: 1180,
            height: 700,
            transform: `translateY(${interpolate(enter, [0, 1], [80, 0]) + breathe}px) translateZ(${interpolate(enter, [0, 1], [-180, 0])}px) rotateY(${dir * interpolate(enter, [0, 1], [dir * 6, -2])}deg) scale(${push})`,
            opacity: enter,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
              overflow: 'hidden',
              border: `1px solid ${rgba('#ffffff', 0.65)}`,
              boxShadow: `0 55px 110px ${rgba('#02121b', 0.62)}, 0 14px 34px ${rgba('#02121b', 0.42)}, 0 0 0 3px ${rgba(accent, 0.5 * focus)}, 0 0 60px ${rgba(accent, 0.34 * focus)}`,
            }}
          >
            <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${interpolate(focus, [0, 1], [14, 0])}px) saturate(${0.78 + focus * 0.32})`, transform: `scale(${1.1 - focus * 0.08})`}} />
            <div style={{position: 'absolute', inset: 0, background: rgba('#eaf3f5', interpolate(focus, [0, 1], [0.45, 0]))}} />
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '38%', background: `linear-gradient(${rgba('#ffffff', 0.4)}, transparent)`}} />
          </div>
        </div>
      </AbsoluteFill>

      {/* chip de caption */}
      {caption && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: rgba('#04121A', 0.82), borderRadius: 999, padding: '13px 30px', borderLeft: `5px solid ${accent}`, boxShadow: '0 16px 36px rgba(0,0,0,0.5)', opacity: focus, transform: `translateY(${interpolate(focus, [0, 1], [18, 0])}px)`}}>
            <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: '#F4F1E9'}}>{caption}</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
