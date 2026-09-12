import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CUT} from '../config';

// [frame, duración, color, pico]
const HITS: [number, number, string, number][] = [
  [76, 2, '#ff2d55', 0.8],
  [CUT.C1, 4, '#ffffff', 0.9],
  [CUT.C2, 3, '#ffffff', 1],
  [CUT.C3, 2, '#000000', 1],
  [CUT.C4, 3, '#ffffff', 0.8],
  [CUT.C5, 5, '#000000', 1],
  [1410, 3, '#ffffff', 1],
  [CUT.C6, 6, '#ffffff', 1],
];

export const HitLayer: React.FC = () => {
  const f = useCurrentFrame();
  let op = 0;
  let col = '#fff';
  for (const [at, d, c, pk] of HITS) {
    if (f >= at && f < at + d) {
      const o = pk * (1 - (f - at) / d);
      if (o > op) {
        op = o;
        col = c;
      }
    }
  }
  if (op <= 0.01) return null;
  return <AbsoluteFill style={{background: col, opacity: op, pointerEvents: 'none', zIndex: 60}} />;
};
