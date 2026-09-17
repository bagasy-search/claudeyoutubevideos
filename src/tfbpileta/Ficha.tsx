// Ficha.tsx — tfbpileta: LA LÁMINA (zoom punto por punto anclado a frases) y la CTA de la Colección (portada 2.5D + páginas + QR).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {F_PLAYFAIR, F_GARAMOND} from '../VideoEdit/kit/premium/theme';
import {MARCA} from './Piezas';

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export type LamKey = {f: number; x: number; y: number; z: number};

export const LaminaZoom: React.FC<{src: string; keys: LamKey[]}> = ({src, keys}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const K = [...keys].sort((a, b) => a.f - b.f);
  const T = 22; // cuadros de viaje entre puntos
  let cur = K[0];
  let x = cur.x, y = cur.y, z = cur.z;
  for (let i = 1; i < K.length; i++) {
    const k = K[i];
    if (frame >= k.f) { x = k.x; y = k.y; z = k.z; cur = k; continue; }
    if (frame >= k.f - T) {
      const p = interpolate(frame, [k.f - T, k.f], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
      x = cur.x + (k.x - cur.x) * p; y = cur.y + (k.y - cur.y) * p; z = cur.z + (k.z - cur.z) * p;
    }
    break;
  }
  const since = frame - cur.f;
  const breathe = 1 + Math.min(0.03, since * 0.0006);
  const zz = z * breathe;
  // mantener el encuadre dentro de la imagen
  const tx = Math.max(-(zz - 1) * width / 2, Math.min((zz - 1) * width / 2, (0.5 - x) * width * zz));
  const ty = Math.max(-(zz - 1) * height / 2, Math.min((zz - 1) * height / 2, (0.5 - y) * height * zz));
  const ring = interpolate(since, [6, 24], [0, 1], CL) * (cur.z > 1.2 ? 1 : 0);
  const enter = interpolate(frame, [0, 12], [0, 1], CL);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0], CL);
  return (
    <AbsoluteFill style={{background: MARCA.espresso, overflow: 'hidden', opacity: out}}>
      {K.slice(1).map((k, i) => (
        <Sequence key={i} from={Math.max(0, k.f - T)} durationInFrames={40} layout="none"><Audio src={staticFile('sfx/sfx_whoosh_soft.mp3')} volume={0.22} /></Sequence>
      ))}
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${zz * (0.96 + 0.04 * enter)})`, transformOrigin: '50% 50%'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {ring > 0 ? (() => {
        const sx = (cur.x * width - width / 2) * zz + width / 2 + tx;
        const sy = (cur.y * height - height / 2) * zz + height / 2 + ty;
        const rx = 300, ry = 120, L = 2 * Math.PI * rx;
        return (
          <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
            <ellipse cx={sx} cy={sy} rx={rx} ry={ry} fill="none" stroke={MARCA.oxido} strokeWidth={7} strokeLinecap="round"
              strokeDasharray={L} strokeDashoffset={(1 - ring) * L} opacity={0.8} transform={`rotate(-4 ${sx} ${sy})`} />
          </svg>
        );
      })() : null}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(46,33,25,0.45)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

// ── CTA: portada real 2.5D + abanico de páginas reales + QR real + dominio legible ──
export const ColeccionCta: React.FC<{
  v: number; cover: string; peeks: string[]; qr: string; bed: string; url: string; kicker: string; items: string[];
}> = ({v, cover, peeks, qr, bed, url, kicker, items}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inn = spring({frame, fps, config: {damping: 20, stiffness: 90}});
  const qrIn = spring({frame: frame - 12, fps, config: {damping: 16, stiffness: 120}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], CL);
  const tilt = Math.sin(frame / 38) * 4;
  const flo = Math.sin(frame / 27) * 10;
  const per = 2.2 * fps;
  const pi = Math.floor(frame / per) % peeks.length;
  const pp = (frame % per) / per;
  return (
    <AbsoluteFill style={{background: MARCA.espresso, overflow: 'hidden', opacity: out}}>
      <AbsoluteFill style={{transform: `scale(${1.12 + frame * 0.0002})`, filter: 'blur(14px) brightness(0.55) sepia(0.25)'}}>
        <Img src={staticFile(bed)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(90% 80% at 30% 50%, rgba(241,228,201,0.10), rgba(46,33,25,0.55))'}} />
      <Sequence from={2} durationInFrames={40} layout="none"><Audio src={staticFile('sfx/sfx_trans3.mp3')} volume={0.3} /></Sequence>
      <Sequence from={14} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/sfx_pop.mp3')} volume={0.3} /></Sequence>
      {/* páginas reales en abanico detrás de la portada */}
      <div style={{position: 'absolute', left: 170, top: 150, width: 560, height: 780, perspective: 1600}}>
        {[0, 1, 2].map((k) => {
          const idx = (pi + k) % peeks.length;
          const rot = -16 + k * 11 + (k === 0 ? -pp * 6 : 0);
          return (
            <Img key={k} src={staticFile(peeks[idx])} style={{position: 'absolute', left: 150 + k * 70, top: 40 + k * 18, width: 470, height: 660, objectFit: 'cover',
              transform: `rotate(${rot}deg) translateY(${(1 - inn) * 80}px)`, boxShadow: '0 30px 60px rgba(0,0,0,0.45)', borderRadius: 6, opacity: inn * (k === 0 ? 1 - pp * 0.2 : 1)}} />
          );
        })}
        <Img src={staticFile(cover)} style={{position: 'absolute', left: 0, top: 0, width: 540, height: 760, objectFit: 'cover', borderRadius: 8,
          transform: `translateY(${(1 - inn) * 120 + flo}px) rotateY(${14 + tilt}deg) rotateX(${3 - tilt * 0.3}deg)`, boxShadow: '30px 44px 70px rgba(0,0,0,0.55)', transformOrigin: '30% 50%'}} />
      </div>
      {/* ficha con QR */}
      <div style={{position: 'absolute', right: 80, top: 120, width: 900, opacity: qrIn, transform: `translateX(${(1 - qrIn) * 80}px)`}}>
        <div style={{fontFamily: F_GARAMOND, fontSize: 34, letterSpacing: 6, color: MARCA.oro, textTransform: 'uppercase', fontWeight: 700}}>{kicker}</div>
        <div style={{fontFamily: F_PLAYFAIR, fontSize: 70, fontWeight: 900, color: MARCA.crema, lineHeight: 1.05, marginTop: 8}}>La Colección del Constructor Libre</div>
        <div style={{display: 'flex', gap: 36, marginTop: 34, alignItems: 'center'}}>
          <div style={{background: '#FFFFFF', padding: 22, borderRadius: 10, boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>
            <Img src={staticFile(qr)} style={{width: 400, height: 400, display: 'block', imageRendering: 'pixelated'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {items.map((it, i) => {
              const a = spring({frame: frame - 26 - i * 9, fps, config: {damping: 18, stiffness: 120}});
              return (
                <div key={i} style={{opacity: a, transform: `translateX(${(1 - a) * 30}px)`, fontFamily: F_GARAMOND, fontSize: 36, color: MARCA.crema, borderLeft: `6px solid ${MARCA.oxido}`, paddingLeft: 16, lineHeight: 1.15}}>{it}</div>
              );
            })}
          </div>
        </div>
        <div style={{marginTop: 30, display: 'inline-block', background: MARCA.crema, color: MARCA.espresso, fontFamily: F_PLAYFAIR, fontWeight: 800, fontSize: 52, padding: '10px 28px', borderRadius: 6}}>{url}</div>
        <div style={{fontFamily: F_GARAMOND, fontSize: 32, color: 'rgba(241,228,201,0.85)', marginTop: 14, fontStyle: 'italic'}}>
          {v === 1 ? 'En el televisor: apunta tu teléfono al código' : 'O el enlace, abajo en la descripción'}
        </div>
      </div>
    </AbsoluteFill>
  );
};
