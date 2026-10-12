// sunavidad · SEGUNDA PASADA (§6-§7). Base = el mp4 ENTREGADO (release sunavidad), con su audio tal cual.
// Encima: capa de fotos de Claudio en acción (tiempos absolutos de la voz). Cada 4ª foto con marco de celular.
// Reglas: marco 72-78 % del ancho, rotación ±2°; ninguna foto tapa componentes con cifra ni clips de gente real.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr } from "./Base";
import PHOTOS from "./photos_p2.json";

type Ph = { name: string; s: number; e: number; phone: boolean; rot: number };

const Push: React.FC<{ dur: number; src: string; phone?: boolean; rot?: number }> = ({ dur, src, phone, rot = 0 }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.07 * t; // push-in 1,00 -> 1,07
  if (!phone) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 50%" }} />
      </AbsoluteFill>
    );
  }
  // marco de foto de celular: foto al 75 % del ancho, centrada, sobre fondo borroso y oscurecido 30 %
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.7)", transform: "scale(1.08)" }} />
      <div style={{ position: "absolute", left: "12.5%", top: "12%", width: "75%", height: "76%", transform: `rotate(${rot}deg) scale(${s})`, background: "#fff", padding: 14, boxSizing: "border-box", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

export const Pasada2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* base: mp4 entregado, con su audio */}
    <OffthreadVideo src={staticFile("sunavidad_base.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {(PHOTOS as Ph[]).map((p) => (
      <Sequence key={p.name} from={fr(p.s)} durationInFrames={fr(p.e) - fr(p.s)}>
        <Push dur={p.e - p.s} src={staticFile(`photos/${p.name}.png`)} phone={p.phone} rot={p.rot} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
