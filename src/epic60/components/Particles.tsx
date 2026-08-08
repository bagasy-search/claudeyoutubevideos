import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, random} from 'remotion';

type P = {x: number; y: number; vx: number; vy: number; s: number; o: number; rot: number; life: number};

export const Particles: React.FC<{
  count?: number;
  seed?: string;
  color?: string;
  mode?: 'float' | 'burst';
  start?: number;
  life?: number;
  gravity?: number;
  origin?: {x: number; y: number};
}> = ({count = 30, seed = 'p', color = '#fff', mode = 'float', start = 0, life = 90, gravity = 0.25, origin}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const ox = origin?.x ?? w / 2;
  const oy = origin?.y ?? h / 2;

  const ps = useMemo<P[]>(
    () =>
      Array.from({length: count}, (_, i) => ({
        x: random(`${seed}x${i}`) * w,
        y: random(`${seed}y${i}`) * h,
        vx: (random(`${seed}vx${i}`) - 0.5) * 24,
        vy: (random(`${seed}vy${i}`) - 0.5) * 24 - 7,
        s: 2 + random(`${seed}s${i}`) * 7,
        o: 0.25 + random(`${seed}o${i}`) * 0.6,
        rot: random(`${seed}r${i}`) * 360,
        life: life * (0.6 + random(`${seed}l${i}`) * 0.6),
      })),
    [count, seed, w, h, life]
  );

  if (mode === 'float') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
        {ps.map((p, i) => {
          const y = (((p.y - f * (0.6 + (i % 3) * 0.5)) % h) + h) % h;
          const x = p.x + Math.sin((f + i * 13) / 40) * 18;
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y,
                width: p.s, height: p.s, borderRadius: p.s,
                background: color, opacity: p.o * 0.7, filter: 'blur(0.6px)',
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  const t = f - start;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {ps.map((p, i) => {
        const op = Math.max(0, 1 - t / p.life) * p.o * 1.5;
        if (op <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: ox + p.vx * t * 2.4,
              top: oy + p.vy * t * 2.4 + gravity * t * t,
              width: p.s, height: p.s * 0.55, borderRadius: 2,
              background: i % 4 === 0 ? '#ffffff' : color,
              opacity: Math.min(1, op),
              transform: `rotate(${p.rot + t * 9}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
