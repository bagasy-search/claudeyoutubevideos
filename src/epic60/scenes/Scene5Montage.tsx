import React from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
import {WhipStreaks} from '../components/WhipStreaks';
import {lin, eo, CLAMP} from '../lib/anim';
import {interpolate} from 'remotion';
import {DISPLAY, UI} from '../fonts';
import {S} from '../config';
import {useBrand} from '../lib/Brand';

const CARDS = [
  {t: 'EL COMIENZO', tag: 'VLOG', v: '812K', d: '12:04', hue: 210},
  {t: 'ROMPÍ EL RÉCORD', tag: 'RETO', v: '1.4M', d: '09:31', hue: 340},
  {t: '24H EDITANDO', tag: 'DOCU', v: '2.1M', d: '18:22', hue: 150},
  {t: 'LA CAÍDA', tag: 'STORY', v: '986K', d: '11:10', hue: 280},
  {t: 'NIVEL DIOS', tag: 'GAMEPLAY', v: '3.3M', d: '14:45', hue: 20},
  {t: '¿Y SI...?', tag: 'ENSAYO', v: '1.1M', d: '16:03', hue: 190},
  {t: 'EL FINAL', tag: 'CINE', v: '4.7M', d: '21:37', hue: 52},
  {t: 'ESTO ES EL NIVEL', tag: 'PREMIERE', v: '▶ AHORA', d: '01:00', hue: 45},
];
const DURS = [64, 56, 48, 42, 36, 30, 24, 90]; // accelerando: suma exacta = 390
const STARTS = DURS.reduce<number[]>((acc, _, i) => [...acc, DURS.slice(0, i).reduce((a, b) => a + b, 0)], []);

export const Scene5Montage: React.FC = () => {
  const f = useCurrentFrame();
  const {accent} = useBrand();
  const d = S.S5;

  let idx = 0;
  for (let i = 0; i < STARTS.length; i++) if (f >= STARTS[i]) idx = i;
  const lf = f - STARTS[idx];
  const card = CARDS[idx];
  const last = idx === CARDS.length - 1;

  const p = eo(lf, 0, 8);
  const sc = 1.5 - 0.5 * p;
  const rot = (random(`rot${idx}`) - 0.5) * 9 * (1 - p);
  const kb = last ? lin(lf, 0, 90, 1, 1.08) : 1; // Ken Burns en la final
  const out = lin(f, d - 4, d, 0, 1);
  const speedLines = Math.min(0.3, 0.035 * idx);

  return (
    <AbsoluteFill style={{background: '#07070b', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, hsla(${card.hue}, 80%, 50%, 0.14), transparent 60%)`}} />

      {/* speed lines (suben con la aceleración) */}
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 150px)',
          transform: `translateX(${-(f * 34) % 150}px) skewX(-24deg) scaleX(1.6)`,
          opacity: speedLines, filter: 'blur(1px)',
        }}
      />

      {/* número fantasma */}
      <div style={{position: 'absolute', fontFamily: DISPLAY, fontSize: 540, color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.07)'}}>
        {String(idx + 1).padStart(2, '0')}
      </div>

      {/* THUMBNAIL */}
      <div
        style={{
          width: 1150, height: 646, borderRadius: 30, overflow: 'hidden', position: 'relative',
          transform: `scale(${sc * kb}) rotate(${rot}deg)`,
          opacity: interpolate(lf, [0, 4], [0, 1], CLAMP),
          background: `linear-gradient(135deg, hsl(${card.hue} 70% 13%), hsl(${card.hue + 45} 85% 34%))`,
          boxShadow: `0 50px 130px hsla(${card.hue}, 85%, 50%, 0.28)`,
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <div style={{position: 'absolute', top: -120, right: -120, width: 420, height: 420, borderRadius: 210, background: 'rgba(255,255,255,0.13)', filter: 'blur(60px)'}} />
        <div style={{position: 'absolute', top: 34, left: 36, fontFamily: UI, fontSize: 22, letterSpacing: '0.25em', background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '10px 18px', borderRadius: 10}}>
          {card.tag}
        </div>
        <div style={{position: 'absolute', top: 34, right: 36, display: 'flex', gap: 12, fontFamily: UI, fontSize: 24, color: '#fff'}}>
          <Chip>{card.v} vistas</Chip>
          <Chip>{card.d}</Chip>
        </div>
        <div style={{position: 'absolute', left: 42, bottom: 74, fontFamily: DISPLAY, fontSize: 64, color: '#fff', textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>
          {card.t}
        </div>
        {/* barra de progreso interna del video */}
        <div style={{position: 'absolute', left: 42, right: 42, bottom: 40, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.25)'}}>
          <div style={{height: '100%', borderRadius: 4, width: `${(lf / DURS[idx]) * 100}%`, background: last ? accent : '#ff2d55'}} />
        </div>

        {/* botón play pulsante en la card final */}
        {last && (
          <div
            style={{
              position: 'absolute', left: '50%', top: '44%', marginLeft: -75, marginTop: -75,
              width: 150, height: 150, borderRadius: 75,
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              transform: `scale(${1 + Math.sin(f / 4) * 0.06})`,
              boxShadow: '0 0 80px rgba(255,255,255,0.5)',
            }}
          >
            <div style={{width: 0, height: 0, borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderLeft: '48px solid #0b0e14', marginLeft: 10}} />
          </div>
        )}
      </div>

      {/* flash + streaks en cada corte */}
      {lf < 2 && <AbsoluteFill style={{background: '#fff', opacity: 0.45}} />}
      {f < 8 && <WhipStreaks dur={8} />}

      {/* progreso de la secuencia */}
      <div style={{position: 'absolute', bottom: 60, left: 200, right: 200, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)'}}>
        <div style={{height: '100%', borderRadius: 3, width: `${(f / d) * 100}%`, background: accent, boxShadow: `0 0 16px ${accent}`}} />
      </div>

      {/* fade a negro hacia el silencio del drop */}
      <AbsoluteFill style={{background: '#000', opacity: out}} />
    </AbsoluteFill>
  );
};

const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{background: 'rgba(0,0,0,0.55)', padding: '10px 18px', borderRadius: 10}}>{children}</div>
);
