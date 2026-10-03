// TdcSparkWhip — transición "whip de chispa" entre etapas: una barrida diagonal de chispas naranjas + destello cálido corto que tapa
// el empalme. Se coloca centrada en la frontera entre dos tomas (dur ≈ 10-14 cuadros).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, ease, wobble } from "./theme";

export const TdcSparkWhip: React.FC<{ dur: number; dir?: 1 | -1; sparks?: number }> = ({ dur, dir = 1, sparks = 46 }) => {
  const f = useCurrentFrame(), { width: W, height: H } = useVideoConfig();
  const p = interpolate(f, [0, dur], [0, 1], { ...clamp, easing: ease });
  const flash = interpolate(f, [0, dur * 0.45, dur], [0, 0.85, 0], clamp);
  const arr = Array.from({ length: sparks }, (_, i) => {
    const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1, r3 = Math.abs(Math.sin(i * 3.14) * 9871.31) % 1;
    const x0 = (dir === 1 ? -0.1 : 1.1) * W, x1 = (dir === 1 ? 1.15 : -0.15) * W;
    const q = Math.min(1, Math.max(0, p * (0.7 + r1 * 0.6) - r2 * 0.15));
    return { x: x0 + (x1 - x0) * q, y: H * (0.15 + r2 * 0.7) + wobble(f, i, 10), len: 60 + r3 * 220, w: 3 + r3 * 5, o: Math.sin(q * Math.PI) };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(255,236,200,${flash})` }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {arr.map((s, i) => <line key={i} x1={s.x} y1={s.y} x2={s.x - dir * s.len} y2={s.y + s.len * 0.12} stroke={i % 3 ? "#FFB020" : C.white} strokeWidth={s.w} strokeLinecap="round" opacity={s.o} />)}
      </svg>
    </AbsoluteFill>
  );
};
