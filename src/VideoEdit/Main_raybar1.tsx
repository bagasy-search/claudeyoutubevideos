// Main_raybar1.tsx — GENERADO por build_raybar1.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_raybar1.gen";
import { TOTAL_FRAMES_RAYBAR1, AVATAR_FRAMES_RAYBAR1 } from "./avatar_raybar1.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRaybar1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..591s) → BUCLE muteado para la cola. */}
    <RayAvatar src="raybar1_opt.mp4" loopFrames={AVATAR_FRAMES_RAYBAR1} />

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

    {/* UN solo <Audio> con el master: cubre TODO el video (avatar parcial + cola). */}
    <Audio src={staticFile("raybar1.wav")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RAYBAR1 };
