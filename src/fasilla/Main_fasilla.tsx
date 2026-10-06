// Main_fasilla.tsx — GENERADO por build_fasilla.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FASILLA } from "./cues_fasilla.gen";

export const TOTAL_FRAMES_FASILLA = 90265;
const AVATAR_FRAMES = 33532;

/** ⛔ OffthreadVideo, NUNCA <Video>: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y nunca estático: un avatar full quieto se lee como una videollamada. */
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
      <Sequence from={0} durationInFrames={Math.min(AVATAR_FRAMES, 90265)}>
        <OffthreadVideo src={staticFile("fasilla_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={33532} durationInFrames={33532}>
        <OffthreadVideo src={staticFile("fasilla_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={67064} durationInFrames={23201}>
        <OffthreadVideo src={staticFile("fasilla_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainFasilla: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <AvatarPiso />
    {CUES_FASILLA.filter((c) => c.capa === "base").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {CUES_FASILLA.filter((c) => c.capa === "over").map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    {/* ⛔ el máster va en m4a EN EL TAR (el wav de 268 MB x 60 chunks son ~16 GB de transferencia);
        el WAV suelto se sube al release, que es de donde lo baja el stitch. */}
    <Audio src={staticFile("fasilla.m4a")} />
  </AbsoluteFill>
);
