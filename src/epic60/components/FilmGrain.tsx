import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const f = useCurrentFrame();
  const id = useId();
  const jx = random(`gx${Math.floor(f / 2)}`) * 60 - 30;
  const jy = random(`gy${Math.floor(f / 2)}`) * 60 - 30;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity,
        transform: `translate(${jx}px, ${jy}px) scale(1.15)`,
      }}
    >
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
