// Main_tswfan12v.tsx — GENERADO por build_tswfan12v.mjs. NO editar a mano.
// NARRADOR PURO: no hay avatar de piso. Los cues cubren el 100% por construcción.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSWFAN12V } from "./cues_tswfan12v.gen";

export const TOTAL_FRAMES_TSWFAN12V = 53085;

export const MainTswfan12v: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      {CUES_TSWFAN12V.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tswfan12v.m4a")} />
    </AbsoluteFill>
  );
};
