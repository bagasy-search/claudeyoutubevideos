// Base de planos de stan12b: foto y clip a pantalla completa con Ken Burns sorteado por plano (sentido, velocidad, foco y ángulo).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, Easing } from "remotion";
const INK = "#231710";
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const r01 = (seed: number, k: number) => (hash(seed * 31 + k * 977) % 100000) / 100000;

// ---------- Ken Burns aleatorio de verdad (sentido, velocidad, foco y ángulo sorteados por plano)
export const useKB = (seed: number, dur: number, clip = false) => {
  const f = useCurrentFrame();
  const out = (hash(seed) % 2) === 1;
  const sec = dur / 30;
  const rate = clip ? 0.006 + r01(seed, 1) * 0.008 : 0.018 + r01(seed, 1) * 0.022; // %/s
  const amp = Math.min(clip ? 0.08 : 0.2, rate * sec);
  const zBase = 1.06;
  const t = Easing.inOut(Easing.sin)(Math.min(1, Math.max(0, f / Math.max(1, dur))));
  const k = out ? 1 - t : t;
  const z = zBase + amp * k;
  const ox = 35 + r01(seed, 2) * 30, oy = 35 + r01(seed, 3) * 30;
  const ang = r01(seed, 4) * Math.PI * 2;
  const tx = Math.cos(ang) * 2 * k, ty = Math.sin(ang) * 1.2 * k;
  return { transform: `translate(${tx}%, ${ty}%) scale(${z})`, transformOrigin: `${ox}% ${oy}%` } as React.CSSProperties;
};


export const Photo: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const kb = useKB(seed, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; minRate?: number }> = ({ src, seed, dur, clipDur, minRate = 0.75 }) => {
  const kb = useKB(seed, dur, true);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};
