// Main_pinluz.tsx — GENERADO por build_pinluz.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_PINLUZ } from "./cues_pinluz.gen";

export const TOTAL_FRAMES_PINLUZ = 40789;
const AVATAR_FRAMES = 17660;

/** ⛔ `OffthreadVideo`, NUNCA `<Video>`: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Push lento y cíclico. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 40789)}>
        <OffthreadVideo src={staticFile("pinluz_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={17660} durationInFrames={17660}>
        <OffthreadVideo src={staticFile("pinluz_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={35320} durationInFrames={5469}>
        <OffthreadVideo src={staticFile("pinluz_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainPinluz: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_PINLUZ.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_PINLUZ.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("pinluz.m4a")} />
    </AbsoluteFill>
  );
};
