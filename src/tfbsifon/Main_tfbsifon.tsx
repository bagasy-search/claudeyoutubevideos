// Main_tfbsifon.tsx — GENERADO por build_tfbsifon.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TFBSIFON } from "./cues_tfbsifon.gen";

export const TOTAL_FRAMES_TFBSIFON = 50921;
const AVATAR_FRAMES = 23674;

/** ⛔ `OffthreadVideo`, NUNCA `<Video>`: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA ESTATICO: un avatar full quieto se lee como videollamada. Push lento y ciclico. */
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
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 50921)}>
        <OffthreadVideo src={staticFile("tfbsifon_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={23674} durationInFrames={23674}>
        <OffthreadVideo src={staticFile("tfbsifon_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={47348} durationInFrames={3573}>
        <OffthreadVideo src={staticFile("tfbsifon_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainTfbsifon: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TFBSIFON.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_TFBSIFON.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tfbsifon.m4a")} />
    </AbsoluteFill>
  );
};
