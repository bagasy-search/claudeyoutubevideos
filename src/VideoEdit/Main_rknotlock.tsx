// Main_rknotlock.tsx — GENERADO por build_rknotlock.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rknotlock.gen";
import { TOTAL_FRAMES_RKNOTLOCK, AVATAR_FRAMES_RKNOTLOCK } from "./avatar_rknotlock.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRknotlock: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO y tiene lipsync REAL en TODO el metraje. */}
    <RayAvatar src="rknotlock_opt.mp4" loopFrames={AVATAR_FRAMES_RKNOTLOCK} />

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

    <Audio src={staticFile("rknotlock.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKNOTLOCK };
