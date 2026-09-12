import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';

export const Shockwave: React.FC<{
  at: number;
  dur?: number;
  color?: string;
  max?: number;
  y?: string;
}> = ({at, dur = 26, color = '#fff', max = 1500, y = '50%'}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const p = t / dur;
  const d = interpolate(p, [0, 1], [80, max], {easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute', left: '50%', top: y,
        width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2,
        borderRadius: '50%',
        border: `${Math.max(1, 16 * (1 - p))}px solid ${color}`,
        opacity: 1 - p, pointerEvents: 'none',
      }}
    />
  );
};
