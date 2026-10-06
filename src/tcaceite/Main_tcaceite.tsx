// Main_tcaceite.tsx — GENERADO por build_tcaceite.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TCACEITE } from "./cues_tcaceite.gen";

export const TOTAL_FRAMES_TCACEITE = 23548;

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del master).
 *  Push lento y ciclico: un avatar full quieto se lee como videollamada. */
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
      <OffthreadVideo src={staticFile("tcaceite_opt.mp4")} muted style={est} />
    </AbsoluteFill>
  );
};

export const MainTcaceite: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TCACEITE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tcaceite.wav")} />
    </AbsoluteFill>
  );
};
