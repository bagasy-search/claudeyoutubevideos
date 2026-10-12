// sucaja · Final988 (0-988,8 s). Un solo Root: Full2 (60-988) + Min1 (0-60, encima), voz maestra -14 LUFS como única pista.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Min1 } from "./Min1";
import { Full2 } from "./Full2";
const FPS = 30;
export const Final988: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Full2 />
    <Sequence from={0} durationInFrames={60 * FPS}>
      <Min1 />
    </Sequence>
    <Audio src={staticFile("sucaja_fish.wav")} />
  </AbsoluteFill>
);
