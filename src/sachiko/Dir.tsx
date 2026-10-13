// Sachiko's Kitchen · componentes del DIRECTOR (re-edición 13-oct): plano de clip a pantalla completa por ruta.
// Clip: video de archivo a pantalla completa (cover = recorta 4:3 a 16:9, sin barras ni recuadro), cámara z/o/dx/dy.
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { fr } from "./Base";

export const Clip: React.FC<{ a: number; d: number; p: string; ofs?: number; z?: [number, number]; o?: [number, number]; dx?: number; dy?: number }> =
  ({ d, p, ofs = 0, z = [1.0, 1.06], o = [50, 50], dx = 0, dy = 0 }) => {
    const f = useCurrentFrame();
    const k = f / Math.max(1, d);
    const sc = z[0] + (z[1] - z[0]) * k, tx = dx * (k - 0.5), ty = dy * (k - 0.5);
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: `${o[0]}% ${o[1]}%` }}>
          <OffthreadVideo src={staticFile(p)} startFrom={fr(ofs)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };

export const DIR: Record<string, React.FC<any>> = { Clip };
