import React from 'react';
import {useCurrentFrame} from 'remotion';
import {lin} from '../lib/anim';

export const Letterbox: React.FC<{at?: number; dur?: number; max?: number}> = ({
  at = 0,
  dur = 10,
  max = 88,
}) => {
  const f = useCurrentFrame();
  const h = lin(f, at, at + dur, 0, max);
  return (
    <>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: h, background: '#000', zIndex: 40}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: h, background: '#000', zIndex: 40}} />
    </>
  );
};
