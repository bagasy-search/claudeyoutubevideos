// Main_rkalarm.tsx — GENERADO por build_rkalarm.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkalarm.gen";
import { TOTAL_FRAMES_RKALARM, AVATAR_FRAMES_RKALARM } from "./avatar_rkalarm.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkalarm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO y cubre TODO el video (grabado completo). */}
    <RayAvatar src="rkalarm_opt.mp4" loopFrames={AVATAR_FRAMES_RKALARM} />
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
    {/* UN solo <Audio> con el master. El avatar va MUTEADO. */}
    <Audio src={staticFile("rkalarm.m4a")} />
  </AbsoluteFill>
);
export { TOTAL_FRAMES_RKALARM };
