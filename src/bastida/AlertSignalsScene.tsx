/**
 * AlertSignalsScene — AlertSignals al ESTÁNDAR (microescena 2.5D).
 * Metáfora: el RIÑÓN pidiendo ayuda. Hero = ilustración de riñón con anillo de ALERTA ámbar que
 * PULSA (acción semántica = "avisa"). Las señales entran como placas de vidrio con borde ámbar,
 * numeradas, escalonadas. Material ámbar de advertencia. Cámara dolly-in + micro-órbita.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, FONT_SERIF, rgba} from './theme';

const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type AlertSignalsSceneProps = {title?: string; signals?: string[]; footer?: string};

export const AlertSignalsScene: React.FC<AlertSignalsSceneProps> = ({
  title = '¿Sus riñones ya piden ayuda?',
  signals = ['Orina espumosa por la mañana', 'Hinchazón en tobillos y párpados', 'Cansancio que no se va', 'Picazón en la piel sin causa'],
  footer = 'Si reconoce 2 o más, consulte a su médico',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const ry = interpolate(camP, [0, 1], [5, 1]) + Math.sin(frame / fps * 0.5) * 0.3;
  const dolly = interpolate(camP, [0, 1], [0.97, 1.015]) + interpolate(frame, [55, 120], [0, 0.004], clamp);
  const pulse = 0.55 + 0.45 * Math.sin(frame / fps * Math.PI * 2.2);

  const titleP = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeIO});
  const heroS = spring({frame: frame - 4, fps, config: {damping: 150}});
  const footP = interpolate(frame, [50, 64], [0, 1], clamp);
  const cx = width / 2, cy = height / 2;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(85% 95% at 40% 42%, #12130A 0%, #071019 55%, #03080C 100%)', perspective: 1600, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(42% 50% at 30% 46%, ${rgba(BAS.amber, 0.14 * (0.7 + pulse * 0.3))}, transparent 70%)`}} />
      {/* título */}
      <div style={{position: 'absolute', top: 66, left: 0, right: 0, textAlign: 'center', opacity: titleP, transform: `translateY(${interpolate(titleP, [0, 1], [-16, 0])}px)`}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
          <span style={{fontSize: 30, color: BAS.amber, opacity: pulse}}>⚠</span>
          <span style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: BAS.amber}}>Señales de alerta</span>
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 700, color: BAS.onDark, marginTop: 6}}>{title}</div>
      </div>

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg) scale(${dolly})`, transformOrigin: '40% 50%'}}>
        {/* HERO: riñón con anillo de alerta que pulsa */}
        <div style={{position: 'absolute', left: cx - 640, top: cy - 200, width: 420, height: 420, opacity: heroS, transform: `scale(${interpolate(heroS, [0, 1], [0.85, 1])}) translateY(${Math.sin(frame / fps * 1.2) * 6}px)`}}>
          <div style={{position: 'absolute', inset: '4%', borderRadius: '50%', border: `4px solid ${rgba(BAS.amber, 0.4 + pulse * 0.5)}`, boxShadow: `0 0 ${30 + pulse * 40}px ${rgba(BAS.amber, 0.4 + pulse * 0.3)}, inset 0 0 40px ${rgba(BAS.amber, 0.2)}`}} />
          <div style={{position: 'absolute', inset: '14%', filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.55))'}}>
            <Img src={staticFile('img/ill/bas_ill_kidney.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </div>

        {/* señales — placas de vidrio con borde ámbar, escalonadas (derecha) */}
        <div style={{position: 'absolute', left: cx - 40, top: cy - 250, width: 780, display: 'flex', flexDirection: 'column', gap: 16}}>
          {signals.map((s, i) => {
            const ip = spring({frame: frame - 14 - i * 7, fps, config: {damping: 160, mass: 0.8}});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: ip, transform: `translateX(${interpolate(ip, [0, 1], [50, 0])}px)`,
                background: 'linear-gradient(150deg, rgba(20,18,10,0.9), rgba(8,7,4,0.94))', borderRadius: 16, borderLeft: `6px solid ${BAS.amber}`, border: `1px solid ${rgba(BAS.amber, 0.28)}`,
                boxShadow: `0 24px 46px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`, padding: '20px 30px'}}>
                <span style={{width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(150deg, ${BAS.amber}, ${BAS.amberDark})`, color: BAS.onAmber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS, fontSize: 26, fontWeight: 800, flexShrink: 0, boxShadow: `0 0 16px ${rgba(BAS.amber, 0.5)}`}}>{i + 1}</span>
                <span style={{fontFamily: FONT_SERIF, fontSize: 38, color: '#F2ECE0', fontWeight: 500}}>{s}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* footer */}
      <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', opacity: footP}}>
        <span style={{fontFamily: FONT_SANS, fontSize: 28, fontWeight: 600, color: BAS.onDark, opacity: 0.85}}>{footer}</span>
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 44% 50%, transparent 54%, rgba(2,7,11,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
