// Main_tswoil3in1.tsx — GENERADO por build_tswoil3in1.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSW } from "./cues_tswoil3in1.gen";

export const TOTAL_FRAMES_TSW = 53133;

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del máster). Push lento cíclico.
 *  ⛔ OffthreadVideo, NUNCA <Video>: al rendear, <Video> busca por TIEMPO y sirve cuadros
 *  equivocados de forma irregular — es la causa nº1 del "se ve lageado". */
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
      <OffthreadVideo src={staticFile("tswoil3in1_floor.mp4")} muted style={est} />
    </AbsoluteFill>
  );
};

export const MainTsw: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TSW.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tswoil3in1.m4a")} />
    </AbsoluteFill>
  );
};
