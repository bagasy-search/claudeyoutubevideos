// Main_cmekitsinpanel.tsx — GENERADO por build_cmekitsinpanel.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEKITSINPANEL } from "./cues_cmekitsinpanel.gen";

export const TOTAL_FRAMES_CMEKITSINPANEL = 49286;
const AVATAR_FRAMES = 17550;

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
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("cmekitsinpanel_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={17550} durationInFrames={17550}>
        <OffthreadVideo src={staticFile("cmekitsinpanel_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={35100} durationInFrames={14186}>
        <OffthreadVideo src={staticFile("cmekitsinpanel_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainCmekitsinpanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMEKITSINPANEL.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEKITSINPANEL.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmekitsinpanel.m4a")} />
    </AbsoluteFill>
  );
};
