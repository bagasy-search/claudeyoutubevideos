/**
 * VideoScenes2 — microescenas 2.5D específicas del Video #2 (arándanos / la fruta de la noche).
 *
 * NightShiftScene — "el turno de la noche": la luna + el riñón que hace su reparación mientras
 * dormimos. Metáfora: la noche = modo reparación. Riñón con anillo de reparación aqua que pulsa,
 * motas que suben (limpieza), estrellas, luna flotando. Cámara: drift lento + parallax.
 *
 * OxidationScene — "estrés oxidativo": la manzana que se oxida (se amarrona) y el ANTIOXIDANTE
 * (arándano) lo FRENA. Acción semántica: el óxido avanza → aparece el arándano → el óxido retrocede
 * y vuelve el color fresco.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';

const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ============================================================ NightShiftScene */
export const NightShiftScene: React.FC<{title?: string; subtitle?: string}> = ({title = 'El turno de la noche', subtitle = 'cuando el cuerpo repara'}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const camP = interpolate(frame, [0, 60], [0, 1], {...clamp, easing: easeIO});
  const driftX = Math.sin(frame / fps * 0.35) * 8;
  const dolly = interpolate(camP, [0, 1], [0.97, 1.02]);
  const moonIn = spring({frame: frame - 4, fps, config: {damping: 150}});
  const kidneyIn = spring({frame: frame - 16, fps, config: {damping: 150}});
  const titleP = interpolate(frame, [30, 46], [0, 1], {...clamp, easing: easeIO});
  const pulse = 0.5 + 0.5 * Math.sin(frame / fps * Math.PI * 1.6);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(90% 100% at 60% 20%, #12224A 0%, #0A1330 45%, #04060F 100%)', perspective: 1500, overflow: 'hidden'}}>
      {/* estrellas (seeded) */}
      {Array.from({length: 40}).map((_, i) => {
        const s = (i * 47.7) % 100, s2 = (i * 83.1) % 100;
        const tw = 0.3 + 0.5 * Math.abs(Math.sin(frame / fps * 1.5 + i));
        return <div key={i} style={{position: 'absolute', left: `${s}%`, top: `${s2 * 0.7}%`, width: 1 + (i % 3), height: 1 + (i % 3), borderRadius: '50%', background: '#DCE6FF', opacity: tw * 0.7}} />;
      })}
      {/* motas de reparación que suben */}
      {Array.from({length: 14}).map((_, i) => {
        const s = (i * 61.3) % 100; const y = 100 - ((frame / fps * (6 + s % 4) + s * 5) % 120);
        return <div key={`m${i}`} style={{position: 'absolute', left: `${30 + (s % 40)}%`, top: `${y}%`, width: 3, height: 3, borderRadius: '50%', background: BAS.aquaLite, opacity: 0.35, boxShadow: `0 0 6px ${rgba(BAS.aqua, 0.6)}`}} />;
      })}

      <AbsoluteFill style={{transform: `translateX(${driftX}px) scale(${dolly})`, transformOrigin: '55% 45%'}}>
        {/* LUNA (arriba-derecha, parallax) */}
        <div style={{position: 'absolute', right: '10%', top: '8%', width: 320, height: 320, opacity: moonIn, transform: `translateX(${driftX * 1.4}px) translateY(${Math.sin(frame / fps * 0.8) * 6}px) scale(${interpolate(moonIn, [0, 1], [0.85, 1])})`, filter: `drop-shadow(0 0 60px ${rgba('#AEB9E8', 0.5)})`}}>
          <Img src={staticFile('img/ill/bas_ill_moon.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        </div>
        {/* RIÑÓN reparando (centro-izq) con anillo aqua pulsante */}
        <div style={{position: 'absolute', left: '20%', top: '34%', width: 440, height: 440, opacity: kidneyIn, transform: `translateY(${Math.sin(frame / fps * 1.1) * 6}px) scale(${interpolate(kidneyIn, [0, 1], [0.85, 1])})`}}>
          <div style={{position: 'absolute', inset: '2%', borderRadius: '50%', border: `3px solid ${rgba(BAS.aqua, 0.3 + pulse * 0.4)}`, boxShadow: `0 0 ${24 + pulse * 40}px ${rgba(BAS.aqua, 0.3 + pulse * 0.25)}, inset 0 0 40px ${rgba(BAS.aqua, 0.15)}`}} />
          <div style={{position: 'absolute', inset: '14%', filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.5))'}}>
            <Img src={staticFile('img/ill/bas_ill_kidney.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </div>
      </AbsoluteFill>

      {/* título */}
      <div style={{position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', opacity: titleP, transform: `translateY(${interpolate(titleP, [0, 1], [16, 0])}px)`}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color: BAS.aqua}}>Modo reparación</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 74, fontWeight: 700, color: '#EAF0FF', marginTop: 6}}>{title}</div>
        <div style={{fontFamily: FONT_SANS, fontSize: 32, color: rgba('#DCE6FF', 0.7), marginTop: 4}}>{subtitle}</div>
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 55% 45%, transparent 52%, rgba(2,4,10,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ============================================================ OxidationScene */
export const OxidationScene: React.FC<{breakAt?: number}> = ({breakAt = 60}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const dolly = interpolate(camP, [0, 1], [0.97, 1.02]);
  const appleIn = spring({frame: frame - 4, fps, config: {damping: 150}});
  // óxido: crece 0→1 hasta breakAt, luego retrocede a 0.25 (el antioxidante lo frena)
  const oxide = interpolate(frame, [12, breakAt, breakAt + 26], [0, 1, 0.25], clamp);
  const berryIn = spring({frame: frame - breakAt, fps, config: {damping: 140}});
  const titleShift = interpolate(frame, [breakAt, breakAt + 20], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(85% 95% at 45% 42%, #0C1B27 0%, #071019 55%, #03080C 100%)', perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(40% 46% at 42% 44%, ${rgba(oxide > 0.5 ? '#6b4a1e' : BAS.aqua, 0.12)}, transparent 70%)`}} />
      <AbsoluteFill style={{transform: `scale(${dolly})`, transformOrigin: '45% 46%'}}>
        {/* MANZANA que se oxida (izq-centro) */}
        <div style={{position: 'absolute', left: '22%', top: '30%', width: 420, height: 420, opacity: appleIn, transform: `scale(${interpolate(appleIn, [0, 1], [0.85, 1])}) translateY(${Math.sin(frame / fps * 1.1) * 5}px)`, filter: 'drop-shadow(0 28px 40px rgba(0,0,0,0.5))'}}>
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <Img src={staticFile('img/ill/bas_ill_apple.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: `saturate(${1 - oxide * 0.7}) brightness(${1 - oxide * 0.35}) sepia(${oxide * 0.6})`}} />
            {/* mancha de óxido que crece */}
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 55% 55%, rgba(90,60,25,${oxide * 0.7}) 0%, transparent ${20 + oxide * 45}%)`, mixBlendMode: 'multiply'}} />
          </div>
        </div>
        {/* ARÁNDANOS que entran y frenan el óxido (der) */}
        <div style={{position: 'absolute', right: '20%', top: '34%', width: 320, height: 320, opacity: berryIn, transform: `translateX(${interpolate(berryIn, [0, 1], [60, 0])}px) scale(${interpolate(berryIn, [0, 1], [0.7, 1])})`, filter: `drop-shadow(0 24px 34px rgba(0,0,0,0.5)) drop-shadow(0 0 30px ${rgba('#6E7BD6', 0.4 * berryIn)})`}}>
          <Img src={staticFile('img/ill/bas_ill_blueberries.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        </div>
        {/* flecha "frena" */}
        <div style={{position: 'absolute', left: '52%', top: '46%', fontSize: 60, color: BAS.aqua, opacity: berryIn * 0.9, textShadow: `0 0 16px ${rgba(BAS.aqua, 0.6)}`}}>◀</div>
      </AbsoluteFill>

      {/* título: "estrés oxidativo" → "los antioxidantes lo frenan" */}
      <div style={{position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: titleShift > 0.5 ? BAS.aqua : '#B98F45'}}>{titleShift > 0.5 ? 'Los antioxidantes lo frenan' : 'Estrés oxidativo'}</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 60, fontWeight: 700, color: BAS.onDark, marginTop: 6}}>{titleShift > 0.5 ? 'El arándano protege el filtro' : 'El óxido interno desgasta el riñón'}</div>
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 45% 46%, transparent 54%, rgba(2,7,11,0.58) 100%)'}} />
    </AbsoluteFill>
  );
};
