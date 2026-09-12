import React, {useId} from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {USE_IMAGE_AVATAR} from '../config';
import {useBrand} from '../lib/Brand';

type Mood = 'idle' | 'excited' | 'hero';

export const Avatar: React.FC<{
  size?: number;
  mood?: Mood;
  speaking?: boolean;
  src?: string;
}> = ({size = 420, mood = 'idle', speaking = false, src}) => {
  const f = useCurrentFrame();
  const id = useId();
  const {accent} = useBrand();

  if (USE_IMAGE_AVATAR && src) {
    return (
      <Img
        src={staticFile(src)}
        style={{width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'}}
      />
    );
  }

  // ── Avatar procedural (placeholder renderizable ya mismo) ──
  const bob = Math.sin(f / 11) * size * 0.012;
  const tilt = Math.sin(f / 23) * 2;
  const blink = f % 90 < 4;
  const eyeRy = blink ? 1.6 : 13;
  const mouthH = mood === 'excited' ? 17 : speaking ? 3 + Math.abs(Math.sin(f / 2.6)) * 11 : 5;

  return (
    <div
      style={{
        width: size, height: size,
        transform: `translateY(${bob}px) rotate(${tilt}deg)`,
        filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))',
      }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3f4d" />
            <stop offset="1" stopColor="#14161d" />
          </linearGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8fbff" />
            <stop offset="1" stopColor="#b8ecf5" />
          </linearGradient>
        </defs>

        {/* antena */}
        <line x1="100" y1="28" x2="100" y2="10" stroke="#8a8f9e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="9" r="6" fill={accent} />
        {/* orejas */}
        <rect x="18" y="82" width="12" height="40" rx="6" fill="#23262f" />
        <rect x="170" y="82" width="12" height="40" rx="6" fill="#23262f" />
        {/* cabeza */}
        <rect x="28" y="26" width="144" height="132" rx="42" fill={`url(#${id}b)`} stroke="#4a5060" strokeWidth="2" />
        {/* cara */}
        <rect x="42" y="44" width="116" height="96" rx="30" fill={`url(#${id}s)`} />

        {/* ojos */}
        {mood === 'excited' ? (
          <>
            <path d="M66 92 Q78 76 90 92" stroke="#0b0e14" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M110 92 Q122 76 134 92" stroke="#0b0e14" strokeWidth="8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="78" cy="88" rx="11" ry={eyeRy} fill="#0b0e14" />
            <ellipse cx="122" cy="88" rx="11" ry={eyeRy} fill="#0b0e14" />
            {!blink && (
              <>
                <circle cx="82" cy="83" r="3.4" fill="#fff" opacity="0.9" />
                <circle cx="126" cy="83" r="3.4" fill="#fff" opacity="0.9" />
              </>
            )}
          </>
        )}

        {/* boca (lip-sync simulado) */}
        <rect x={100 - 15} y={112} width={30} height={mouthH} rx={mouthH / 2} fill="#0b0e14" />
        {/* cachetes */}
        <circle cx="58" cy="110" r="6" fill={accent} opacity="0.55" />
        <circle cx="142" cy="110" r="6" fill={accent} opacity="0.55" />
        {/* cuerpo */}
        <rect x="70" y="160" width="60" height="26" rx="12" fill="#23262f" />
        <circle cx="100" cy="173" r="5" fill={accent} />

        {/* sparkles hero */}
        {mood === 'hero' && (
          <>
            <path d="M172 38 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill={accent} opacity={0.5 + Math.sin(f / 5) * 0.5} />
            <path d="M26 52 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 z" fill="#fff" opacity={0.5 + Math.cos(f / 6) * 0.5} />
          </>
        )}
      </svg>
    </div>
  );
};
