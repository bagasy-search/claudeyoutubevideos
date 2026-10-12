import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Full, FULL_FRAMES } from "./Full";
import FOTOS from "./p2_fotos.json";

// Capa de fotos encima de Full (la composicion entregada). Tiempos absolutos de la voz.
// phone=true: foto de celular (borde blanco, rotacion, fondo desenfocado oscurecido 30 %).
type Foto = { t0: number; t1: number; name: string; phone: boolean };

const Overlay: React.FC<{ f: Foto }> = ({ f }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.07], { extrapolateRight: "clamp" });
  const src = staticFile(`img/suojos/p2/${f.name}.jpg`);
  if (!f.phone) {
    return (
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px)", transform: "scale(1.1)" }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1440, padding: 14, background: "#FFF",
        transform: `translate(-50%,-50%) rotate(-2deg) scale(${push})`, boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
        <Img src={src} style={{ width: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

export const Pasada2: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Full />
      {(FOTOS as Foto[]).map((f) => (
        <Sequence key={f.name} from={Math.round(f.t0 * fps)} durationInFrames={Math.max(1, Math.round((f.t1 - f.t0) * fps))}>
          <Overlay f={f} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { FULL_FRAMES };
