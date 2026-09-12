import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GlitchText} from '../components/GlitchText';
import {Letterbox} from '../components/Letterbox';
import {lin, shake} from '../lib/anim';
import {S, COLORS} from '../config';

const MICRO = [
  {at: 4, t: 'ESTO'},
  {at: 16, t: 'NO ES'},
  {at: 28, t: 'UN VIDEO.'},
];

export const Scene1ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const d = S.S1;
  const out = lin(f, d - 7, d, 0, 1); // whip out hacia S2
  const shk = f > 36 ? shake('s1', f, Math.min(10, (f - 36) * 0.35)) : {x: 0, y: 0, r: 0};
  const micro = MICRO.find((m) => f >= m.at && f < m.at + 12);
  const showMain = f >= 40 && f < 76;
  const strobe = f >= 76;
  const strobeOn = strobe && Math.floor(f / 2) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: '#050507', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
        transform: `scale(${1 + out * 0.4}) translate(${shk.x}px, ${shk.y}px) rotate(${shk.r}deg)`,
        filter: out > 0 ? `blur(${out * 12}px)` : 'none',
        opacity: 1 - out,
      }}
    >
      {/* scanlines CRT */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 4px)'}} />
      <Letterbox at={0} dur={10} />

      {micro && <GlitchText text={micro.t} size={150} intensity={0.85} />}

      {showMain && (
        <div style={{textAlign: 'center', transform: `scale(${lin(f, 40, 76, 1, 1.07)})`}}>
          <GlitchText text="ES UNA" size={110} intensity={0.35} color="#9a9aad" />
          <div style={{height: 14}} />
          <GlitchText text="DECLARACIÓN" size={205} intensity={0.5} color={COLORS.ink} />
        </div>
      )}

      {strobe && <AbsoluteFill style={{background: strobeOn ? '#ffffff' : '#000000'}} />}
    </AbsoluteFill>
  );
};
