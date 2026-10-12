// Pasada2 = la composición Final (Full) de bcb9346 tal cual + una capa de fotos de Claudio encima.
// Tiempos absolutos de la voz/render (segundos). fotos_pasada2.json = [{t0, t1, src, name, frase, cara}].
// Tratamiento (SEGUNDA_PASADA §4): push-in lento 1,00 -> 1,07; 1 de cada 4 como "foto de celular"
// (borde blanco fino, rotación +-2 grados, sombra) sobre la misma foto desenfocada y oscurecida al 30 %.
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Full, FULL_SECS } from "./Full";
import PH from "./fotos_pasada2.json";

const FPS = 30;
export const PASADA2_SECS = FULL_SECS;

const Photo: React.FC<{ src: string; dur: number; phone: boolean; tilt: number }> = ({ src, dur, phone, tilt }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const k = interpolate(t, [0, Math.max(dur, 0.01)], [1.0, 1.07], { extrapolateRight: "clamp" });
  const img = <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  if (!phone) {
    return (
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "50% 50%" }}>{img}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // foto de celular: fondo = misma foto desenfocada y oscura; encima la foto con borde blanco, rotada y con sombra
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.7)", transform: "scale(1.1)" }}>{img}</AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "75%", background: "#fff", padding: 12, boxSizing: "border-box",
          transform: `rotate(${tilt}deg) scale(${k})`, boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
        }}>
          <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}>{img}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Pasada2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Full audioSrc="suencargado_mix14.wav" />
    {((PH as any[]) || []).map((p, i) => {
      const dur = p.t1 - p.t0;
      const phone = i % 4 === 0;
      const tilt = i % 2 === 0 ? 1.8 : -1.8;
      return (
        <Sequence key={"ph" + i} from={Math.round(p.t0 * FPS)} durationInFrames={Math.max(1, Math.round(dur * FPS))}>
          <Photo src={p.src} dur={dur} phone={phone} tilt={tilt} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
