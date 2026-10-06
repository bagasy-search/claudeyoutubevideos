// GENERADO por build_mdpnsqn.mjs
import React from "react";
import { AbsoluteFill, Sequence, Audio, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CUES_MDPNSQN } from "./cues_mdpnsqn.gen";
export const TOTAL_FRAMES_MDPNSQN = 44656;
const AVATAR_FRAMES = 18979;
const LOOP_START = 18990;

const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={LOOP_START}>
        <OffthreadVideo src={staticFile("mdpnsqn_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={Math.max(1, TOTAL_FRAMES_MDPNSQN - LOOP_START)}>
        <OffthreadVideo src={staticFile("mdpnsqn_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainMdpnsqn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_MDPNSQN.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_MDPNSQN.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("mdpnsqn.wav")} />
    </AbsoluteFill>
  );
};
