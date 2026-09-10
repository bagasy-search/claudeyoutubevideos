// Main_pinvacas.tsx — GENERADO por build_pinvacas.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_PINVACAS } from "./cues_pinvacas.gen";

export const TOTAL_FRAMES_PINVACAS = 44623;
const AVATAR_FRAMES = 44622;

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
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 44623)}>
        <OffthreadVideo src={staticFile("pinvacas_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={44622} durationInFrames={1}>
        <OffthreadVideo src={staticFile("pinvacas_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainPinvacas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_PINVACAS.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_PINVACAS.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("pinvacas.m4a")} />
      <Sequence from={1339} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/pin_plop.mp3")} volume={0.5} /></Sequence>
      <Sequence from={1613} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/pin_plop2.mp3")} volume={0.34} /></Sequence>
      <Sequence from={40716} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/pin_plop.mp3")} volume={0.42} /></Sequence>
    </AbsoluteFill>
  );
};
