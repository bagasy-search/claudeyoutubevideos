import React from 'react';
import {useCurrentFrame, random} from 'remotion';
import {DISPLAY} from '../fonts';

export const GlitchText: React.FC<{
  text: string;
  size?: number;
  color?: string;
  intensity?: number;
}> = ({text, size = 120, color = '#fff', intensity = 0.5}) => {
  const f = useCurrentFrame();
  const g = (s: string) => random(`gl${s}${Math.floor(f / 2)}`);
  const on = g('on') < intensity;
  const dx = on ? (g('dx') - 0.5) * size * 0.22 : 0;
  const s1 = on ? (g('s1') - 0.5) * 44 : 0;
  const s2 = on ? (g('s2') - 0.5) * 44 : 0;

  const base: React.CSSProperties = {
    fontFamily: DISPLAY, fontSize: size, color, lineHeight: 1,
    letterSpacing: '0.01em', whiteSpace: 'nowrap',
  };

  return (
    <div style={{position: 'relative'}}>
      <div style={{...base, position: 'absolute', color: '#ff2d55', mixBlendMode: 'screen', opacity: on ? 0.9 : 0, transform: `translate(${dx}px, ${-dx * 0.4}px)`}}>{text}</div>
      <div style={{...base, position: 'absolute', color: '#2ee6ff', mixBlendMode: 'screen', opacity: on ? 0.9 : 0, transform: `translate(${-dx}px, ${dx * 0.4}px)`}}>{text}</div>
      <div style={base}>{text}</div>
      {on && (
        <>
          <div style={{...base, position: 'absolute', top: 0, clipPath: 'inset(18% 0 55% 0)', transform: `translateX(${s1}px)`}}>{text}</div>
          <div style={{...base, position: 'absolute', top: 0, clipPath: 'inset(62% 0 8% 0)', transform: `translateX(${s2}px)`}}>{text}</div>
        </>
      )}
    </div>
  );
};
