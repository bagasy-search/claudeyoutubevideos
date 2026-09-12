import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Avatar} from '../components/Avatar';
import {lin, eo, shake} from '../lib/anim';
import {DISPLAY, UI} from '../fonts';
import {COLORS} from '../config';
import {useBrand} from '../lib/Brand';

export const Scene3Manifesto: React.FC = () => {
  const f = useCurrentFrame();
  const {accent} = useBrand();
  const WORDS = [
    {t: 'SIN MIEDO.', c: COLORS.red, bg: '#170507'},
    {t: 'SIN PAUSA.', c: '#f4f4f6', bg: '#0a0a0c'},
    {t: 'SIN EXCUSAS.', c: COLORS.cyan, bg: '#041019'},
    {t: 'SOLO CINE.', c: accent, bg: '#151005'},
  ];

  const i = Math.min(3, Math.floor(f / 90));
  const lf = f % 90;
  const w = WORDS[i];

  const sc = eo(lf, 0, 7); // slam ON BEAT (lf=0 cae en beat)
  const scale = 2.8 - 1.8 * sc;
  const ls = 0.28 - 0.28 * sc;
  const amp = Math.max(0, 15 - lf * 1.4);
  const shk = lf < 16 ? shake(`w${i}`, lf, amp) : {x: 0, y: 0, r: 0};
  const exit = lin(lf, 80, 90, 0, 1);

  return (
    <AbsoluteFill style={{background: w.bg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      {/* franjas diagonales en movimiento */}
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 90px)',
          backgroundPosition: `${f * 4}px 0`,
          transform: `scale(${lin(f, 0, 360, 1, 1.12)})`,
        }}
      />
      {/* fantasma outlined gigante */}
      <div
        style={{
          position: 'absolute', fontFamily: DISPLAY, fontSize: 420, whiteSpace: 'nowrap',
          color: 'transparent', WebkitTextStroke: `2px ${w.c}22`, transform: 'scale(1.3)',
        }}
      >
        {w.t}
      </div>

      {/* palabra principal */}
      <div
        style={{
          fontFamily: DISPLAY, fontSize: 190, color: w.c, whiteSpace: 'nowrap',
          letterSpacing: `${ls}em`,
          transform: `scale(${scale}) translate(${shk.x}px, ${shk.y}px) rotate(${shk.r}deg) translateY(${exit * -60}px)`,
          opacity: 1 - exit,
          filter: exit > 0 ? `blur(${exit * 10}px)` : 'none',
          textShadow: lf > 2 && lf < 10 ? `-7px 0 rgba(255,45,85,0.7), 7px 0 rgba(46,230,255,0.7)` : 'none',
        }}
      >
        {w.t}
      </div>

      {/* barra bajo la palabra */}
      <div style={{position: 'absolute', top: '63%', width: lin(lf, 6, 30, 0, 420), height: 10, background: w.c, opacity: 1 - exit}} />

      {/* impact frame blanco en el beat */}
      {lf < 2 && <AbsoluteFill style={{background: '#fff', opacity: 0.85}} />}

      {/* chip 01/04 */}
      <div style={{position: 'absolute', top: 60, left: 70, fontFamily: UI, fontSize: 26, letterSpacing: '0.3em', color: COLORS.dim}}>
        <span style={{color: w.c}}>0{i + 1}</span> / 04
      </div>

      {/* avatar reaccionando abajo-izquierda */}
      <AvatarReaction lf={lf} />
    </AbsoluteFill>
  );
};

const AvatarReaction: React.FC<{lf: number}> = ({lf}) => {
  const {fps} = useVideoConfig();
  const pump = spring({frame: Math.max(0, lf), fps, config: {damping: 9, stiffness: 200}});
  return (
    <div
      style={{
        position: 'absolute', left: 80, bottom: 70,
        transform: `scale(${0.9 + 0.3 * pump})`,
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(255,255,255,0.15)',
        borderRadius: 110, padding: 10,
      }}
    >
      <Avatar size={150} mood={lf < 12 ? 'excited' : 'idle'} src="avatar/excited.png" />
    </div>
  );
};
