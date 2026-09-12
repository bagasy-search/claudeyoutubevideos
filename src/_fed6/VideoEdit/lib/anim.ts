import { interpolate, spring, Easing } from "remotion";
import { Noise } from "noisejs";

// Shared perlin noise field for organic, non-repeating drift (Rule 10:
// nothing ever sits perfectly still). Seeded constant so renders are deterministic.
const noise = new Noise(0.4242);

// Smooth organic drift in px for a given seed/speed. Use for cards/elements so
// they float naturally instead of a mechanical sine bob.
export const drift = (frame: number, seed: number, speed = 1, amp = 10) => {
  const t = (frame / 60) * speed;
  return {
    x: noise.perlin2(t, seed) * amp,
    y: noise.perlin2(seed, t) * amp,
    r: noise.perlin2(t * 0.7 + seed, seed * 1.3) * (amp * 0.12),
  };
};

// Scene-level enter / exit envelope: fluid zoom-blur in, hold, zoom-blur out.
// Returns opacity, a scale multiplier and a blur(px) for "no hard cut" reveals.
export const useReveal = (
  frame: number,
  fps: number,
  durationInFrames: number,
  opts: { inDur?: number; outDur?: number; inScale?: number; outScale?: number } = {},
) => {
  const { inDur = 16, outDur = 14, inScale = 0.92, outScale = 1.06 } = opts;
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.8 } });
  const exit = spring({
    frame: frame - (durationInFrames - outDur),
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]) * interpolate(exit, [0, 1], [1, 0]);
  const scale =
    interpolate(enter, [0, 1], [inScale, 1]) * interpolate(exit, [0, 1], [1, outScale]);
  const blur =
    interpolate(frame, [0, inDur], [14, 0], { extrapolateRight: "clamp" }) +
    interpolate(frame, [durationInFrames - outDur, durationInFrames], [0, 14], {
      extrapolateLeft: "clamp",
    });
  return { opacity, scale, blur, enter, exit };
};

// Permanent slow Ken-Burns camera zoom over a scene's life (Rule 10A: every
// scene has a moving camera). Alternates direction by `dir`.
export const kenBurns = (
  frame: number,
  durationInFrames: number,
  from = 1.04,
  to = 1.12,
) =>
  interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

// Staggered item reveal (~1s apart per Rule 11A). Returns a spring 0..1 for item i.
export const stagger = (
  frame: number,
  fps: number,
  i: number,
  gap = 26,
  delay = 8,
) =>
  spring({
    frame: frame - (delay + i * gap),
    fps,
    config: { damping: 18, mass: 0.7 },
  });
