// Main_feettingle.tsx — GENERADO por build_feettingle.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FEETTINGLE } from "./cues_feettingle.gen";

export const TOTAL_FRAMES_FEETTINGLE = 30922;
const AVATAR_FRAMES = 13084;
const LOOP_START = 13094;

const AvatarPiso: React.FC = () => {
  const fr = useCurrentFrame();
  const s = 1.035 + Math.sin(fr / 900) * 0.02;
  const dx = Math.sin(fr / 1300) * 0.5;
  const est: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("feettingle_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_FEETTINGLE - LOOP_START}>
        <OffthreadVideo src={staticFile("feettingle_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainFeettingle: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_FEETTINGLE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el()}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FEETTINGLE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el()}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("feettingle.m4a")} />
    </AbsoluteFill>
  );
};
