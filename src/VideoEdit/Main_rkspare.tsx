// Main_rkspare.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkspare.gen";
import { TOTAL_FRAMES_RKSPARE, AVATAR_FRAMES_RKSPARE } from "./avatar_rkspare.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkspare: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO. */}
    <RayAvatar src="rkspare_opt.mp4" loopFrames={AVATAR_FRAMES_RKSPARE} />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master */}
    <Audio src={staticFile("rkspare.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSPARE };
