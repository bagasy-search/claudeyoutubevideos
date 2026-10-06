// MdFoto.tsx — el plano de FOTO full-screen del vlog casero de Mike (para los momentos que NO se
// animan con i2v). Misma estética que MdClip (grade del canal) pero sobre una imagen quieta con un
// push de cámara MUY leve (Ken-Burns sutil), para que no se sienta una diapositiva muerta sin caer
// en lo cinematográfico. Cero texto, cero marcos: es un plano crudo a sangre.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

export const MdFoto: React.FC<{
  durationInFrames: number;
  src: string;          // "img/mdbootsrt_002_kickoffboots.png"
  darken?: number;
  push?: number;        // empuje de cámara sutil
  pan?: number;         // deriva horizontal leve (px)
}> = ({ durationInFrames, src, darken = 0.1, push = 0.05, pan = 0 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const s = 1.03 + push * t;
  const x = pan * (t - 0.5) * 2;
  return (
    // VLOG CASERO: foto cruda full-screen, CERO grade/filtro/viñeta. Solo un push MUY leve.
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${x.toFixed(1)}px)` }}
      />
    </AbsoluteFill>
  );
};
