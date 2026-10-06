// Main_rkslide.tsx — GENERADO por build_rkslide.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkslide.gen";
import { TOTAL_FRAMES_RKSLIDE, AVATAR_FRAMES_RKSLIDE } from "./avatar_rkslide.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkslide: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* avatar FULL: lipsync real todo el video */}
    <RayAvatar src="rkslide_opt.mp4" loopFrames={AVATAR_FRAMES_RKSLIDE} />

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

    <Audio src={staticFile("rkslide.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSLIDE };
