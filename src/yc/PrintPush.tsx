// PrintPush — transición fundida: una copia fotográfica sobre una mesa de madera (con otras copias alrededor);
// la cámara se endereza y entra en ella hasta que la imagen llena EXACTAMENTE el cuadro en el último frame.
// El beat siguiente usa el MISMO src a pantalla completa → el paso de "foto vieja" a "metraje vivo" no tiene corte.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "./Media";
import { YC, clamp, easeInOut, rnd } from "./theme";

export const PrintPush: React.FC<{ src: string; start?: number; others?: string[]; caption?: string }> = ({ src, start, others = [] }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = easeInOut(clamp(f / (D - 1)));
  // la copia mide 1920x1080 (+ borde) en su propio plano; al final queda de frente y a escala 1
  const border = 34 * (1 - t);
  const scale = 0.42 + 0.58 * t;
  const rotZ = -7 * (1 - t), rotX = 28 * (1 - t);
  const tx = -140 * (1 - t), ty = 60 * (1 - t);
  const table = 1 - t;
  return (
    <AbsoluteFill style={{ background: "#1A120B", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: table, background: "radial-gradient(ellipse at 45% 40%, #6B4A2E 0%, #2A1B10 70%)" }}>
        <AbsoluteFill style={{ background: "repeating-linear-gradient(92deg, rgba(0,0,0,0.12) 0 4px, rgba(255,255,255,0.03) 4px 13px)" }} />
        {others.slice(0, 4).map((o, i) => (
          <div key={i} style={{ position: "absolute", left: [80, 1380, 1250, 120][i], top: [80, 60, 640, 700][i], width: 520, height: 320, background: YC.paper, padding: 14,
            transform: `rotate(${(rnd(i + 2) - 0.5) * 24}deg) translate(${-(1 - table) * 300}px, 0)`, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", filter: "sepia(0.4) brightness(0.8)" }}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Media src={o} kb="none" /></div>
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "50% 50%",
          transform: `translate(${tx}px, ${ty}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          boxShadow: `0 ${60 * table}px ${120 * table}px rgba(0,0,0,${0.7 * table})`, background: YC.paper, padding: border, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            <Media src={src} start={start} kb="none" zoom={1} filter={`sepia(${0.35 * table}) brightness(${0.85 + 0.15 * t})`} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
