// TfbFlash — destello de corte / impacto: un cuadro blanco (o amarillo) que cae en 4-6 cuadros, con un leve viñeteado
// radial; para acompañar un "punch" de cámara en una revelación o un golpe de SFX.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { lin } from "./theme";

export const TfbFlash: React.FC<{ dur: number; color?: string; peak?: number }> = ({ dur, color = "#FFFFFF", peak = 0.8 }) => {
  const f = useCurrentFrame();
  const o = lin(f, [0, 1, dur], [peak, peak, 0]);
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, ${color}, ${color}00 75%)`, opacity: o, mixBlendMode: "screen" }} />;
};
