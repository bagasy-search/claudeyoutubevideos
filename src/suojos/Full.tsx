import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Min1, MIN1_FRAMES } from "./Min1";
import { Min2, MIN2_OFFSET_FRAMES } from "./Min2";
import { Min3, MIN3_OFFSET_FRAMES } from "./Min3";

// Voz maestra suojoscut.wav = 977,567 s -> 29327 cuadros. Cada parte corre en su propio
// tiempo (su Audio ya usa startFrom); aca solo se ubica en el offset absoluto.
export const FULL_FRAMES = 29327;

export const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={MIN2_OFFSET_FRAMES}>
      <Min1 />
    </Sequence>
    <Sequence from={MIN2_OFFSET_FRAMES} durationInFrames={MIN3_OFFSET_FRAMES - MIN2_OFFSET_FRAMES}>
      <Min2 />
    </Sequence>
    <Sequence from={MIN3_OFFSET_FRAMES} durationInFrames={FULL_FRAMES - MIN3_OFFSET_FRAMES}>
      <Min3 />
    </Sequence>
  </AbsoluteFill>
);
