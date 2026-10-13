// RkspareThumbOpen.tsx — la miniatura real a pantalla completa los primeros 0,77 s del video (rkspare).
// Overlay (no capa base): el avatar sigue debajo y la voz no se corre un cuadro.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export const RkspareThumbOpen: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 23], [1.06, 1.0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
    </AbsoluteFill>
  );
};

export default RkspareThumbOpen;
