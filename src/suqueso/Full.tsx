import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Min1 } from "./Min1";
import { Min2 } from "./Min2";
import { Min3 } from "./Min3";

// Voz maestra suquesocut.wav = 961,485 s -> 28845 cuadros.
// Min1/Min2/Min3 usan tiempos absolutos. Se montan desde 0 y con duracion hasta su fin:
// orden de apilado Min3 (abajo) < Min2 < Min1 (arriba); cada uno queda visible solo en su tramo.
export const FULL_FRAMES = 28845;
export const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={FULL_FRAMES}>
      <Min3 />
    </Sequence>
    <Sequence from={0} durationInFrames={400 * 30}>
      <Min2 />
    </Sequence>
    <Sequence from={0} durationInFrames={60 * 30}>
      <Min1 />
    </Sequence>
    <Audio src={staticFile("suquesocut.wav")} />
  </AbsoluteFill>
);
