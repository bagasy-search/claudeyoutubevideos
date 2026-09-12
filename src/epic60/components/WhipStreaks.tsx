import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const WhipStreaks: React.FC<{dur?: number; color?: string}> = ({
  dur = 8,
  color = 'rgba(255,255,255,0.55)',
}) => {
  const f = useCurrentFrame();
  if (f >= dur) return null;
  const p = f / dur;
  const x = interpolate(p, [0, 1], [-90, 130]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - p}}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute', top: `${18 + i * 28}%`, left: `${x + i * 9}%`,
            width: '62%', height: 10 + i * 7,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            filter: 'blur(6px)', transform: 'skewX(-22deg)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
