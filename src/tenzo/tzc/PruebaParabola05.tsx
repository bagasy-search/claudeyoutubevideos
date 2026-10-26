import React from "react";
import { AbsoluteFill } from "remotion";
import { Montaje } from "../../anikit/montaje";
import { PARABOLA05 } from "./parabola05";
import { planosDe } from "./tramos";
// sólo la parábola (cuadro 0 = 106,0 s de la voz)
export const PruebaParabola05: React.FC = () => <AbsoluteFill style={{ background: "#000" }}><Montaje planos={planosDe(PARABOLA05)} /></AbsoluteFill>;
