/**
 * GuideCTAScene — el CTA final al ESTÁNDAR (microescena 2.5D).
 * Metáfora: la GUÍA como objeto de PAPEL que se materializa (papel clínico con grosor, curl y sombra),
 * con las miniaturas de las 5 bebidas y una FLECHA física que apunta a la descripción.
 * Va como overlay sobre el avatar (bg transparente). Cámara: leve descenso + micro-drift.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const THUMBS = ['img/ill/bas_ill_lemon_water.png', 'img/ill/bas_ill_barley.png', 'img/ill/bas_ill_ginger.png', 'img/ill/bas_ill_hibiscus.png', 'img/ill/bas_ill_water_drop.png'];

export const GuideCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 150, mass: 0.9}});
  const arrow = 8 + Math.sin(frame / fps * Math.PI * 2) * 10;
  const bob = Math.sin(frame / fps * 1.1) * 5;

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1400}}>
      <div style={{transformStyle: 'preserve-3d', transform: `translateY(${interpolate(inP, [0, 1], [60, 0]) + bob}px) rotateX(${interpolate(inP, [0, 1], [12, 4])}deg) scale(${interpolate(inP, [0, 1], [0.9, 1])})`, opacity: inP}}>
        {/* sombra amplia */}
        <div style={{position: 'absolute', left: 20, top: 40, right: -10, bottom: -30, background: 'rgba(0,0,0,0.5)', filter: 'blur(40px)', borderRadius: 24}} />
        {/* papel clínico con grosor */}
        <div style={{position: 'absolute', left: 6, top: 8, width: 900, height: 340, borderRadius: 22, background: '#CFC8B6'}} />
        <div style={{position: 'relative', width: 900, height: 340, borderRadius: 20, padding: '38px 54px',
          background: 'linear-gradient(160deg, #FBF7EE 0%, #EFE7D4 100%)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.7), 0 40px 80px rgba(0,0,0,0.45)', borderTop: `6px solid ${BAS.aqua}`, overflow: 'hidden'}}>
          {/* textura papel */}
          <div style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"}} />
          <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: BAS.aquaDark}}>Gratis · en la descripción</div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 700, color: BAS.brand, marginTop: 6, lineHeight: 1.05}}>La guía completa de las 5 bebidas</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 26, color: BAS.ink2, marginTop: 6}}>Cantidades exactas · cómo prepararlas · a qué hora</div>
          {/* miniaturas de las bebidas */}
          <div style={{display: 'flex', gap: 14, marginTop: 18}}>
            {THUMBS.map((t, i) => {
              const tp = spring({frame: frame - 12 - i * 4, fps, config: {damping: 160}});
              return <div key={i} style={{width: 76, height: 76, opacity: tp, transform: `scale(${tp})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))'}}><Img src={staticFile(t)} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>;
            })}
          </div>
        </div>
      </div>
      {/* flecha física a la descripción */}
      <div style={{position: 'absolute', bottom: 60, opacity: interpolate(frame, [16, 30], [0, 1], clamp), transform: `translateY(${arrow}px)`}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: BAS.aqua, textAlign: 'center'}}>BAJE A LA DESCRIPCIÓN</div>
        <div style={{fontSize: 64, color: BAS.aqua, textAlign: 'center', textShadow: `0 0 20px ${rgba(BAS.aqua, 0.6)}`}}>▾</div>
      </div>
    </AbsoluteFill>
  );
};
