// suoferta · Pasada2 · capa de fotos de Claudio encima de la composición entregada (FinalOferta).
// Tiempos ABSOLUTOS de la voz (segundos). Push-in lento 1,00 -> 1,07. 1 de cada 4 es "foto de celular":
// marco blanco, ancho 75 % (72-78 %), rotación +-2 deg, fondo = misma foto desenfocada y oscurecida 30 %.
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import photos from "./photos.json";

type Ph = { name: string; t0: number; t1: number; phone: boolean; rot: number };

const Shot: React.FC<{ ph: Ph }> = ({ ph }) => {
  const frame = useCurrentFrame();
  const dur = Math.max(1, Math.round((ph.t1 - ph.t0) * 30));
  const p = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = 1 + 0.07 * p;
  const src = staticFile(`fotos2/${ph.name}.png`);
  if (!ph.phone) {
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.7)", transform: "scale(1.1)" }} />
      <div
        style={{
          position: "absolute",
          left: "12.5%",
          top: "50%",
          width: "75%",
          boxSizing: "border-box",
          padding: 14,
          background: "#fff",
          boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
          transform: `translateY(-50%) rotate(${ph.rot}deg) scale(${scale})`,
        }}
      >
        <Img src={src} style={{ width: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

export const PhotoLayer: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  if (!enabled) return null;
  return (
    <>
      {(photos as Ph[]).map((ph) => (
        <Sequence key={`${ph.name}-${ph.t0}`} from={Math.round(ph.t0 * 30)} durationInFrames={Math.max(1, Math.round((ph.t1 - ph.t0) * 30))}>
          <Shot ph={ph} />
        </Sequence>
      ))}
    </>
  );
};
