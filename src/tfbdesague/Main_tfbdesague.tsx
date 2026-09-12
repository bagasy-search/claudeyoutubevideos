// Main_tfbdesague.tsx — GENERADO por build_tfbdesague.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_tfbdesague.gen";

export const TOTAL_FRAMES_TFBDESAGUE = 54262;
const AVATAR_FRAMES = 23646;

/** ⛔ `OffthreadVideo`, NUNCA `<Video>`: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Push lento y cíclico. */
const AvatarPiso: React.FC = () => {
  const est: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 54262)}>
        <OffthreadVideo src={staticFile("tfbdesague_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={23646} durationInFrames={23646}>
        <OffthreadVideo src={staticFile("tfbdesague_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={47292} durationInFrames={6970}>
        <OffthreadVideo src={staticFile("tfbdesague_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainTfbdesague: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <AvatarPiso />
    {CUES.filter((c) => c.capa === "base").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {CUES.filter((c) => c.capa === "comp").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("tfbdesague.m4a")} />
  </AbsoluteFill>
);
