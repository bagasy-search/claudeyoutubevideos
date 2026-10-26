import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { manoCam } from "../kits/camara/CamaraMano";

// CamaraMano sin 3D: el mismo balanceo lento, pero con transform 2D y sin willChange.
// La versión 3D (perspective + rotateX/Y + willChange) con --gl=swangle en el farm mezclaba tiles
// de la capa gigante del mundo (bandas negras y textos duplicados en el MP4; el still local salía limpio).
export const Mano2D: React.FC<{ children: React.ReactNode; intensidad?: number; seed?: number }> = ({ children, intensidad = 1, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const m = manoCam(frame / fps, intensidad, seed);
  const k = width / 1920;
  const escala = 1 + 0.05 * Math.min(1.5, intensidad);
  // pan/tilt (grados) se traducen a corrimiento: 1° ≈ 28 px a 1600 de perspectiva
  const dx = (m.x + m.pan * 28) * k, dy = (m.y + m.tilt * 28) * k;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${m.roll}deg) scale(${escala})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
