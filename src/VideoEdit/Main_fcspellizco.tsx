// Main_fcspellizco.tsx — GENERADO por build_fcspellizco.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES, OVERLAYS } from "./cues_fcspellizco.gen";
import { TOTAL_FRAMES_FCSPELLIZCO, AVATAR_SRC_FCSPELLIZCO } from "./avatar_fcspellizco.gen";

const F = (s: number) => Math.round(s * 30);

// ⛔ OffthreadVideo, NUNCA <Video>. El mp4 del avatar es negro fuera de sus ventanas y lo tapa el b-roll.
// ⛔ Nunca estático: push lento determinista (sub-píxel por transform, no horneado con ffmpeg).
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F15", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(AVATAR_SRC_FCSPELLIZCO)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};

export const MainFcspellizco: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_FCSPELLIZCO} layout="none">
      <AvatarPiso />
    </Sequence>

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster: cubre TODO el video. */}
    <Audio src={staticFile("fcspellizco.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FCSPELLIZCO };
