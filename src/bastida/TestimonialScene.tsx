/**
 * TestimonialScene — prueba social del canal Dr. Bastida (regla del creador: después de la CTA,
 * mostrar personas REALES con su resultado + foto ultra-real casual). "Ella es Rosa, de Guadalajara…".
 *
 * Foto full-bleed (gpt-image-2 low, casual real) con Ken-Burns lento + grade navy del canal + viñeta,
 * y una tarjeta de vidrio abajo-izquierda con nombre · lugar · cita corta · estrellas. Tono testimonio,
 * NO venta. Claim con cuidado (nada de "curó/reversión"): resultado suave y creíble.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, FONT_SERIF, rgba} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type TestimonialSceneProps = {
  img?: string;
  name?: string;
  place?: string;
  quote?: string;
  tag?: string;
  kb?: number; // dirección del Ken-Burns
};

export const TestimonialScene: React.FC<TestimonialSceneProps> = ({
  img = 'img/bas4_rosa_kitchen.png',
  name = 'Rosa',
  place = 'Guadalajara',
  quote = '“Cambié el jugo de naranja por mi manzana… hacía años que no me sentía con esta energía.”',
  tag = 'Historia real',
  kb = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames);

  // Ken-Burns lento
  const scale = 1.08 + p * 0.08;
  const tx = kb * interpolate(p, [0, 1], [-24, 24]);
  const ty = interpolate(p, [0, 1], [-14, 10]);

  const cardIn = spring({frame: frame - 10, fps, config: {damping: 150, mass: 0.9}});

  return (
    <AbsoluteFill style={{background: '#05121B', overflow: 'hidden'}}>
      {/* foto full-bleed */}
      <AbsoluteFill style={{transform: `scale(${scale}) translate(${tx}px, ${ty}px)`}}>
        <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* grade navy del canal + viñeta */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgba('#04121C', 0.15)} 0%, transparent 30%, ${rgba('#04121C', 0.55)} 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 42%, transparent 52%, ${rgba('#020A10', 0.6)} 100%)`, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: rgba(BAS.aquaDark, 0.1), mixBlendMode: 'soft-light'}} />

      {/* tarjeta testimonio abajo-izquierda */}
      <div style={{position: 'absolute', left: 70, bottom: 80, maxWidth: 900, opacity: cardIn, transform: `translateY(${interpolate(cardIn, [0, 1], [40, 0])}px)`}}>
        {/* tag */}
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: rgba(BAS.aqua, 0.92), color: BAS.onAqua, borderRadius: 999, padding: '8px 20px', fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 1, marginBottom: 16, boxShadow: `0 10px 24px ${rgba(BAS.aqua, 0.4)}`}}>
          <span>●</span>{tag.toUpperCase()}
        </div>
        {/* cita */}
        <div style={{fontFamily: FONT_SERIF, fontSize: 46, fontWeight: 500, fontStyle: 'italic', color: '#FBFEFF', lineHeight: 1.24, textShadow: '0 3px 18px rgba(0,0,0,0.7)'}}>{quote}</div>
        {/* nombre + estrellas */}
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 18}}>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 700, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>{name}</div>
          <div style={{width: 2, height: 30, background: rgba('#ffffff', 0.4)}} />
          <div style={{fontFamily: FONT_SANS, fontSize: 28, color: rgba('#EAF3F6', 0.85)}}>{place}</div>
          <div style={{marginLeft: 8, display: 'flex', gap: 3}}>
            {Array.from({length: 5}).map((_, i) => (
              <span key={i} style={{fontSize: 30, color: BAS.amber, opacity: interpolate(frame, [26 + i * 4, 34 + i * 4], [0, 1], clamp), textShadow: `0 0 12px ${rgba(BAS.amber, 0.6)}`}}>★</span>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
