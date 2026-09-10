// Main_pinservice.tsx — GENERADO por build_pinservice.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_PINSERVICE } from "./cues_pinservice.gen";

export const TOTAL_FRAMES_PINSERVICE = 43662;
const AVATAR_FRAMES = 17713;

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
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 43662)}>
        <OffthreadVideo src={staticFile("pinservice_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={17713} durationInFrames={17713}>
        <OffthreadVideo src={staticFile("pinservice_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={35426} durationInFrames={8236}>
        <OffthreadVideo src={staticFile("pinservice_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainPinservice: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_PINSERVICE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_PINSERVICE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("pinservice.m4a")} />
    </AbsoluteFill>
  );
};
