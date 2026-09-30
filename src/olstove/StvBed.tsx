// Fondo vivo para los componentes 2D: foto/clip de la cabaña desenfocado con Ken-Burns y velo crema (en vez de madera lisa).
import React from "react";
import { AbsoluteFill } from "remotion";
import { OLE, hexA } from "./OleTheme";
import { OleBed } from "./OleBookPage";
export const StvBed: React.FC<{ src: string; cream?: number }> = ({ src, cream = 0.5 }) => (
  <AbsoluteFill>
    <OleBed src={src} veil={0.35} blur={7} push={0.07} />
    <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, cream) }} />
  </AbsoluteFill>
);
