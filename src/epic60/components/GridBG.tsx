import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const GridBG: React.FC<{color?: string}> = ({color = 'rgba(46,230,255,0.16)'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', perspective: 700}}>
      <div
        style={{
          position: 'absolute', left: '-50%', top: '42%', width: '200%', height: '170%',
          transform: 'rotateX(62deg)', transformOrigin: 'top',
          backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
          backgroundSize: '90px 90px',
          backgroundPosition: `0 ${f * 3}px`,
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(46,230,255,0.13), transparent 55%)'}} />
    </AbsoluteFill>
  );
};
