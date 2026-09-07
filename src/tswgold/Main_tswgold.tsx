// Main_tswgold.tsx — GENERADO por build_tswgold.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSWGOLD } from "./cues_tswgold.gen";

export const TOTAL_FRAMES_TSWGOLD = 50363;

export const MainTswgold: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      {CUES_TSWGOLD.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tswgold.m4a")} />
    </AbsoluteFill>
  );
};
