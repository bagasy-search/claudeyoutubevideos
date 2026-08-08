import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const LightRays: React.FC<{color?: string; speed?: number; rays?: number}> = ({
  color = 'rgba(255,214,10,0.10)',
  speed = 0.18,
  rays = 14,
}) => {
  const f = useCurrentFrame();
  const step = 360 / rays;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        transform: 'scale(1.7)',
        background: `repeating-conic-gradient(from ${f * speed}deg, ${color} 0deg ${step * 0.45}deg, transparent ${step * 0.45}deg ${step}deg)`,
      }}
    />
  );
};
