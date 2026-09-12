import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {CLAMP} from '../lib/anim';

export const CountUp: React.FC<{
  to: number;
  from?: number;
  dur?: number;
  format?: (v: number) => string;
}> = ({to, from = 0, dur = 50, format}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [from, from + dur], [0, to], {...CLAMP, easing: Easing.out(Easing.exp)});
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString('es-ES'));
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(v)}</span>;
};
