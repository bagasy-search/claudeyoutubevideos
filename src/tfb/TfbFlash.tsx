// TfbFlash — destello de impacto / corte (blanco o color) con viñeta que se abre: acompaña un golpe de SFX
// en las revelaciones y en las transiciones rápidas del gancho. 4-8 cuadros.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./theme";

export const TfbFlash: React.FC<{ dur: number; color?: string; peak?: number }> = ({ dur, color = "#ffffff", peak = 0.75 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 1, dur], [0, peak, 0], clamp);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color} 40%, rgba(0,0,0,0) 100%)`, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};
