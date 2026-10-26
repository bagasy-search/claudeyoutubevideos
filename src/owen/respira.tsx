// Respiración de cámara mínima sobre cada plano: ningún cuadro queda quieto >2 s (el QC del farm lo marca congelado).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const Respira: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = 1.014 + Math.sin(f / 47) * 0.006;
  const x = Math.sin(f / 37) * 5, y = Math.cos(f / 53) * 4;
  return <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${s})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>;
};
