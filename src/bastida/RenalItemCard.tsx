/**
 * RenalItemCard — opener 2.5D de UN queso (reemplaza el NumTag plano).
 * Microescena dirigida: fondo navy con bokeh + tarjeta de vidrio flotante con la FOTO del queso
 * (blur→foco), número acrílico grande, nombre y nota; profundidad real (perspective+translateZ),
 * parallax y cámara viva (push lento + drift). Acento por color (rojo=daña / verde=protege).
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba, shade} from './theme';

type Props = {
  n: string;
  name: string;
  note?: string;
  img: string; // 'img/qr_xxx.jpg'
  accent?: string;
  side?: 'left' | 'right';
};

export const RenalItemCard: React.FC<Props> = ({n, name, note, img, accent = BAS.aqua, side = 'right'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const easeIO = Easing.bezier(0.4, 0, 0.2, 1);
  const easeOut = Easing.out(Easing.cubic);
  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  // cámara: push lento + drift lateral suave (nunca vuelve a 0)
  const camZ = interpolate(frame, [0, durationInFrames], [-60, 40]);
  const camX = interpolate(frame, [0, durationInFrames], [side === 'right' ? -26 : 26, 0], {easing: easeIO});
  const breathe = Math.sin((frame / fps) * Math.PI * 0.9) * 6;

  // reveal de la tarjeta: entra desde abajo con overshoot + blur→foco
  const enter = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: easeOut});
  const focus = interpolate(frame, [18, 46], [0, 1], {...clamp, easing: easeIO}); // blur del lock
  const cardY = interpolate(enter, [0, 1], [130, 0]) + breathe * 0.4;
  const cardZ = interpolate(enter, [0, 1], [-240, 0]);

  // número acrílico: sube y se asienta
  const numP = interpolate(frame, [8, 34], [0, 1], {...clamp, easing: easeOut});

  const dir = side === 'right' ? 1 : -1;

  return (
    <AbsoluteFill style={{background: `radial-gradient(78% 92% at ${side === 'right' ? 60 : 40}% 40%, #0C1B27 0%, #071019 56%, #03080C 100%)`, perspective: 1500, overflow: 'hidden'}}>
      {/* bokeh de profundidad */}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateZ(${camZ - 300}px) translateX(${camX * 0.4}px)`}}>
        {[...Array(6)].map((_, i) => {
          const px = [12, 78, 30, 62, 45, 88][i];
          const py = [22, 30, 74, 68, 50, 15][i];
          const s = [120, 90, 150, 80, 110, 70][i];
          const tw = 0.25 + 0.2 * Math.sin((frame / fps) * 1.3 + i);
          return <div key={i} style={{position: 'absolute', left: `${px}%`, top: `${py}%`, width: s, height: s, borderRadius: '50%', background: `radial-gradient(circle, ${rgba(accent, 0.18 * tw)}, transparent 70%)`, filter: 'blur(8px)'}} />;
        })}
      </AbsoluteFill>

      {/* escena con cámara */}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateZ(${camZ}px) translateX(${camX}px)`}}>
        {/* número acrílico grande, detrás/al lado de la tarjeta */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: side === 'right' ? '30%' : '70%',
            transform: `translate(-50%,-50%) translateZ(-120px) translateY(${interpolate(numP, [0, 1], [40, 0])}px)`,
            opacity: numP * 0.9,
            fontFamily: FONT_DISPLAY,
            fontSize: 440,
            fontWeight: 800,
            color: rgba(accent, 0.16),
            textShadow: `0 0 90px ${rgba(accent, 0.35)}`,
            lineHeight: 1,
          }}
        >
          {n}
        </div>

        {/* tarjeta de vidrio con la foto */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: side === 'right' ? '62%' : '38%',
            width: 470,
            height: 600,
            transform: `translate(-50%,-50%) translateZ(${cardZ}px) translateY(${cardY}px) rotateY(${dir * interpolate(enter, [0, 1], [dir * 10, -4])}deg)`,
            opacity: enter,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 34,
              overflow: 'hidden',
              border: `1px solid ${rgba('#ffffff', 0.7)}`,
              boxShadow: `0 50px 100px ${rgba('#02121b', 0.6)}, 0 12px 30px ${rgba('#02121b', 0.4)}, 0 0 0 3px ${rgba(accent, 0.85 * focus)}, 0 0 70px ${rgba(accent, 0.5 * focus)}`,
            }}
          >
            <Img src={staticFile(img)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${interpolate(focus, [0, 1], [18, 0])}px) saturate(${0.7 + focus * 0.4})`, transform: `scale(${1.12 - focus * 0.1})`}} />
            {/* velo frosted mientras enfoca (sin backdrop-filter) */}
            <div style={{position: 'absolute', inset: 0, background: rgba('#eaf3f5', interpolate(focus, [0, 1], [0.5, 0]))}} />
            {/* highlight de vidrio */}
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: `linear-gradient(${rgba('#ffffff', 0.5)}, transparent)`}} />
            {/* nombre + nota */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '54px 28px 26px', background: `linear-gradient(transparent, ${rgba('#06202f', 0.82)})`, opacity: focus, transform: `translateY(${interpolate(focus, [0, 1], [18, 0])}px)`}}>
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
                <span style={{width: 44, height: 44, borderRadius: '50%', background: accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 900}}>{n}</span>
              </div>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: '#ffffff', lineHeight: 1.05}}>{name}</div>
              {note && <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 600, color: rgba('#EAF2F4', 0.92), marginTop: 6}}>{note}</div>}
            </div>
          </div>
          {/* borde de acento sutil detrás (grosor de vidrio) */}
          <div style={{position: 'absolute', inset: -6, borderRadius: 40, background: `linear-gradient(150deg, ${rgba(accent, 0.25 * focus)}, transparent)`, transform: 'translateZ(-20px)', filter: 'blur(6px)'}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
