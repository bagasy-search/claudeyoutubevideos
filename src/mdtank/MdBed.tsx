// MdBed.tsx — CAMA DE FOTO debajo de todo componente (regla 2.quater de video-pipeline).
//
// Los componentes full-screen del kit dejan ~60 px de margen. Con el avatar oculto y nada
// debajo, ese marco muestra el fondo plano y se lee como un PowerPoint. Esto pone la foto hero
// del momento, desenfocada y hundida, para que el componente flote sobre MATERIA del video.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

export const MdBed: React.FC<{
  durationInFrames: number;
  img?: string;               // "img/mdtank_h12_valve.jpg"
  children?: React.ReactNode;
}> = ({ durationInFrames, img, children }) => {
  const frame = useCurrentFrame();
  // deriva lentísima para que la cama tampoco quede clavada
  const s = 1.14 + 0.05 * interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
      {img ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(img)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "blur(30px) brightness(0.34) saturate(0.62)",
              transform: `scale(${s.toFixed(4)})`,
            }}
          />
          <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
          <AbsoluteFill style={{ background: "radial-gradient(84% 72% at 50% 48%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.62) 100%)" }} />
        </AbsoluteFill>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
