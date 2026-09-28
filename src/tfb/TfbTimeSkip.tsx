// TfbTimeSkip — salto de tiempo del vlog ("LA NOCHE ANTERIOR", "3 DÍAS DESPUÉS"): reloj dibujado cuyas agujas
// giran rápido, destello de "avance rápido" y la frase que entra con golpe. Se monta en el corte de escena.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, TEXT_SHADOW, clamp, ease, inOut, pop } from "./theme";

export const TfbTimeSkip: React.FC<{ dur: number; text: string; turns?: number; dir?: 1 | -1 }> = ({ dur, text, turns = 3, dir = 1 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 5, 10), s = pop(f, fps, 0, 11);
  const spin = interpolate(f, [0, Math.min(dur - 6, 34)], [0, 360 * turns * dir], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", pointerEvents: "none",
      background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,${0.35 * o}) 0%, rgba(0,0,0,${0.55 * o}) 70%)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36, transform: `scale(${0.7 + 0.3 * s})` }}>
        <svg width={190} height={190} viewBox="0 0 190 190" style={{ filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.5))" }}>
          <circle cx={95} cy={95} r={84} fill={C.white} stroke={C.yellow} strokeWidth={12} />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={92} y={20} width={6} height={i % 3 ? 10 : 18} fill={C.ink} transform={`rotate(${i * 30} 95 95)`} />)}
          <rect x={91} y={52} width={8} height={48} rx={4} fill={C.ink} transform={`rotate(${spin / 12} 95 95)`} />
          <rect x={92.5} y={30} width={5} height={70} rx={2.5} fill={C.red} transform={`rotate(${spin} 95 95)`} />
          <circle cx={95} cy={95} r={9} fill={C.ink} />
        </svg>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 120, color: C.white, textShadow: TEXT_SHADOW, textTransform: "uppercase", whiteSpace: "nowrap",
          transform: `translateX(${interpolate(f, [2, 14], [60, 0], { ...clamp, easing: ease })}px)`, opacity: interpolate(f, [2, 10], [0, 1], clamp) }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
