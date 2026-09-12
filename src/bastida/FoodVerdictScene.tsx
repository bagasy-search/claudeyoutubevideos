/**
 * FoodVerdictScene — FoodVerdict al ESTÁNDAR (microescena 2.5D, familia "ensamblaje / comparación lateral").
 * Dos PANELES DE VIDRIO (SÍ verde / NO rojo) que se ensamblan desde los costados, cada uno con
 * ILUSTRACIONES REALES de cada ítem. El lado NO entra desaturado. Cámara dolly-in + micro-órbita.
 * Materiales: vidrio + ilustraciones flotantes con sombra. Acción semántica = comparar/elegir.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';

const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Item = {img: string; name: string};
export type FoodVerdictSceneProps = {
  title?: string;
  good?: Item[];
  bad?: Item[];
};

const DEF_GOOD: Item[] = [
  {img: 'img/ill/bas_ill_lemon_water.png', name: 'Agua + limón'},
  {img: 'img/ill/bas_ill_barley.png', name: 'Cebada'},
  {img: 'img/ill/bas_ill_ginger.png', name: 'Jengibre'},
  {img: 'img/ill/bas_ill_hibiscus.png', name: 'Hibisco'},
];
const DEF_BAD: Item[] = [
  {img: 'img/ill/bas_ill_cola.png', name: 'Refrescos'},
  {img: 'img/ill/bas_ill_sugar.png', name: 'Azúcar'},
  {img: 'img/ill/bas_ill_coffee.png', name: 'Exceso de café'},
  {img: 'img/ill/bas_ill_alcohol.png', name: 'Alcohol'},
];

export const FoodVerdictScene: React.FC<FoodVerdictSceneProps> = ({title = 'Lo que suma vs lo que daña', good = DEF_GOOD, bad = DEF_BAD}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const dolly = interpolate(camP, [0, 1], [0.97, 1.015]) + interpolate(frame, [55, 120], [0, 0.004], clamp);
  const driftX = Math.sin(frame / fps * 0.4) * 3;

  const titleP = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeIO});
  const cx = width / 2, cy = height * 0.54;

  const Panel: React.FC<{items: Item[]; tone: 'si' | 'no'; delay: number}> = ({items, tone, delay}) => {
    const color = tone === 'si' ? BAS.si : BAS.no;
    const enter = spring({frame: frame - delay, fps, config: {damping: 150, mass: 0.9}});
    const fromX = tone === 'si' ? -120 : 120;
    return (
      <div style={{position: 'relative', width: 680, height: 560, transform: `translateX(${interpolate(enter, [0, 1], [fromX, 0])}px)`, opacity: enter}}>
        {/* grosor */}
        <div style={{position: 'absolute', left: 8, top: 12, width: 680, height: 560, borderRadius: 26, background: '#02060A'}} />
        {/* cuerpo vidrio */}
        <div style={{position: 'absolute', inset: 0, borderRadius: 24,
          background: 'linear-gradient(150deg, rgba(16,22,28,0.85), rgba(5,9,13,0.93))',
          borderTop: `6px solid ${color}`, border: `1px solid ${rgba(color, 0.35)}`,
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.12), 0 60px 110px rgba(0,0,0,0.6), 0 0 60px ${rgba(color, 0.2)}`, overflow: 'hidden'}}>
          {/* header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '26px 34px 6px'}}>
            <span style={{width: 52, height: 52, borderRadius: '50%', background: color, color: tone === 'si' ? BAS.onSi : BAS.onNo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, boxShadow: `0 0 20px ${rgba(color, 0.6)}`}}>{tone === 'si' ? '✓' : '✕'}</span>
            <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, letterSpacing: 2, color}}>{tone === 'si' ? 'SUMAN' : 'DAÑAN'}</span>
          </div>
          {/* grilla de ilustraciones */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 30px 24px'}}>
            {items.map((it, i) => {
              const ip = spring({frame: frame - delay - 8 - i * 5, fps, config: {damping: 160}});
              return (
                <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ip, transform: `translateY(${interpolate(ip, [0, 1], [20, 0])}px) translateY(${Math.sin(frame / fps * 1.1 + i) * 4}px)`}}>
                  <div style={{width: 150, height: 150, filter: `drop-shadow(0 14px 20px rgba(0,0,0,0.5)) ${tone === 'no' ? 'saturate(0.55) brightness(0.85)' : ''}`}}>
                    <Img src={staticFile(it.img)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                  </div>
                  <span style={{fontFamily: FONT_SERIF_OR_SANS, fontSize: 26, color: BAS.onDark, marginTop: 2}}>{it.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{background: 'radial-gradient(85% 95% at 50% 40%, #0C1B27 0%, #071019 55%, #03080C 100%)', perspective: 1600, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(50% 40% at 50% 30%, rgba(52,198,224,0.08), transparent 70%)'}} />
      {/* título */}
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', opacity: titleP, transform: `translateY(${interpolate(titleP, [0, 1], [-16, 0])}px)`}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: BAS.aqua}}>Salud renal · 60+</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 700, color: BAS.onDark, marginTop: 6}}>{title}</div>
      </div>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateX(${driftX}px) scale(${dolly})`, transformOrigin: '50% 54%'}}>
        <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)', display: 'flex', gap: 46, alignItems: 'flex-start'}}>
          <Panel items={good} tone="si" delay={10} />
          <Panel items={bad} tone="no" delay={18} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 50% 50%, transparent 56%, rgba(2,7,11,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

const FONT_SERIF_OR_SANS = FONT_SANS;
