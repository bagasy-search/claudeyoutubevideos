/**
 * QrCtaScene — CTA con CÓDIGO QR para el canal Dr. Bastida (regla del creador: en CADA CTA va el QR
 * en pantalla + explicación de cómo escanearlo). Reutiliza el look del canal (glass navy + acento aqua).
 *
 * Composición: panel de vidrio oscuro; a la IZQUIERDA el título + 3 pasos numerados de escaneo;
 * a la DERECHA el QR en un panel blanco con MARCO DE ESCANEO (esquinas + línea láser que barre) para
 * que se lea "escaneame". Abajo, "también en la descripción ▾". Overlay sobre el avatar (bg translúcido).
 *
 * Props: qr (path del PNG del QR), title, steps[], note. Sin precio/URL en pantalla (regla del canal).
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);

export type QrCtaSceneProps = {
  qr?: string;
  kicker?: string;
  title?: string;
  steps?: string[];
  note?: string;
};

/** esquina tipo visor de escaneo */
const Corner: React.FC<{pos: 'tl' | 'tr' | 'bl' | 'br'; c: string}> = ({pos, c}) => {
  const base: React.CSSProperties = {position: 'absolute', width: 46, height: 46, borderColor: c, borderStyle: 'solid', borderWidth: 0};
  const m = 14;
  const s: React.CSSProperties =
    pos === 'tl' ? {top: m, left: m, borderTopWidth: 7, borderLeftWidth: 7, borderTopLeftRadius: 12}
    : pos === 'tr' ? {top: m, right: m, borderTopWidth: 7, borderRightWidth: 7, borderTopRightRadius: 12}
    : pos === 'bl' ? {bottom: m, left: m, borderBottomWidth: 7, borderLeftWidth: 7, borderBottomLeftRadius: 12}
    : {bottom: m, right: m, borderBottomWidth: 7, borderRightWidth: 7, borderBottomRightRadius: 12};
  return <div style={{...base, ...s}} />;
};

export const QrCtaScene: React.FC<QrCtaSceneProps> = ({
  qr = 'renal/bas_qr_federer.png',
  kicker = 'Dr. Bastida · Salud renal',
  title = 'Su guía completa',
  steps = ['Abra la cámara de su teléfono', 'Apunte al código de la pantalla', 'Toque el aviso que aparece'],
  note = 'También en la descripción',
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 150, mass: 0.9}});
  const arrow = 6 + Math.sin(frame / fps * Math.PI * 2) * 9;
  const bob = Math.sin(frame / fps * 1.0) * 4;

  // línea láser de escaneo que barre el QR (loop)
  const scan = ((frame % Math.round(fps * 2.2)) / Math.round(fps * 2.2)); // 0..1
  const scanY = interpolate(Math.sin(scan * Math.PI), [0, 1], [8, 92]); // ping-pong suave 8%..92%
  const qrIn = spring({frame: frame - 8, fps, config: {damping: 160}});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1500}}>
      {/* halo ambiental aqua */}
      <AbsoluteFill style={{background: `radial-gradient(50% 55% at 50% 48%, ${rgba(BAS.aqua, 0.12)} 0%, transparent 70%)`, opacity: inP}} />

      <div style={{
        transformStyle: 'preserve-3d',
        transform: `translateY(${interpolate(inP, [0, 1], [64, 0]) + bob}px) rotateX(${interpolate(inP, [0, 1], [10, 3])}deg) scale(${interpolate(inP, [0, 1], [0.9, 1])})`,
        opacity: inP,
        display: 'flex',
        alignItems: 'stretch',
        gap: 40,
        padding: '44px 52px',
        borderRadius: 30,
        background: 'linear-gradient(150deg, rgba(16,34,46,0.94) 0%, rgba(8,20,29,0.96) 100%)',
        border: `1px solid ${rgba('#ffffff', 0.1)}`,
        boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.12)}, 0 60px 120px rgba(0,0,0,0.6)`,
        borderTop: `6px solid ${BAS.aqua}`,
      }}>
        {/* IZQUIERDA: título + pasos */}
        <div style={{width: 620, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: BAS.aqua}}>{kicker}</div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 60, fontWeight: 700, color: '#F2F6F7', marginTop: 8, lineHeight: 1.02}}>{title}</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 25, color: rgba('#DCEAEE', 0.7), marginTop: 6, marginBottom: 22}}>Escanéelo, es facilísimo:</div>
          {steps.map((s, i) => {
            const sp = spring({frame: frame - 18 - i * 6, fps, config: {damping: 160}});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [-24, 0])}px)`}}>
                <div style={{flex: '0 0 auto', width: 48, height: 48, borderRadius: '50%', background: BAS.aqua, color: BAS.onAqua, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_SANS, fontSize: 26, fontWeight: 800, boxShadow: `0 8px 20px ${rgba(BAS.aqua, 0.45)}`}}>{i + 1}</div>
                <div style={{fontFamily: FONT_SANS, fontSize: 32, fontWeight: 600, color: '#EAF2F4'}}>{s}</div>
              </div>
            );
          })}
        </div>

        {/* DERECHA: QR con marco de escaneo */}
        <div style={{flex: '0 0 auto', width: 380, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: 360, height: 360, borderRadius: 26, background: '#FFFFFF', overflow: 'hidden', opacity: qrIn, transform: `scale(${interpolate(qrIn, [0, 1], [0.88, 1])})`, boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 0 4px ${rgba(BAS.aqua, 0.35)}`}}>
            <Img src={staticFile(qr)} style={{width: '100%', height: '100%', objectFit: 'contain', padding: 18}} />
            {/* línea láser */}
            <div style={{position: 'absolute', left: 0, right: 0, top: `${scanY}%`, height: 4, background: `linear-gradient(90deg, transparent, ${BAS.aqua}, transparent)`, boxShadow: `0 0 18px ${BAS.aqua}`, opacity: 0.9}} />
            {/* esquinas visor */}
            <Corner pos="tl" c={BAS.aqua} /><Corner pos="tr" c={BAS.aqua} /><Corner pos="bl" c={BAS.aqua} /><Corner pos="br" c={BAS.aqua} />
          </div>
        </div>
      </div>

      {/* también en la descripción */}
      <div style={{position: 'absolute', bottom: 54, opacity: interpolate(frame, [22, 38], [0, 1], clamp), transform: `translateY(${arrow}px)`, textAlign: 'center'}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: BAS.aqua}}>{note.toUpperCase()}</div>
        <div style={{fontSize: 58, color: BAS.aqua, textShadow: `0 0 20px ${rgba(BAS.aqua, 0.6)}`}}>▾</div>
      </div>
    </AbsoluteFill>
  );
};
