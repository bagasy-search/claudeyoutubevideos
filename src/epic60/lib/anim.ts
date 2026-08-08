import {interpolate, random, Easing} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const lin = (f: number, a: number, b: number, x: number, y: number) =>
  interpolate(f, [a, b], [x, y], CLAMP);

export const eo = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

export const back = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.8))});

// random determinista por frame (jitter)
export const jr = (seed: string, f: number, step = 1) =>
  random(`${seed}${Math.floor(f / step)}`);

export const shake = (seed: string, f: number, amp: number) => ({
  x: (jr(seed + 'x', f) - 0.5) * 2 * amp,
  y: (jr(seed + 'y', f) - 0.5) * 2 * amp,
  r: (jr(seed + 'r', f) - 0.5) * amp * 0.5,
});

export const tc = (frame: number) => {
  const p = (n: number) => String(n).padStart(2, '0');
  const s = Math.floor(frame / FPS_);
  return `${p(Math.floor(s / 60))}:${p(s % 60)}:${p(frame % FPS_)}`;
};
const FPS_ = 30;
