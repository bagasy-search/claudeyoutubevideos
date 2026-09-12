// Main_raygarage.tsx — GENERADO por build_raygarage.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_raygarage.gen";
import { TOTAL_FRAMES_RAYGARAGE, AVATAR_FRAMES_RAYGARAGE } from "./avatar_raygarage.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRaygarage: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..750s) → BUCLE muteado para la cola. */}
    <RayAvatar src="raygarage_opt.mp4" loopFrames={AVATAR_FRAMES_RAYGARAGE} />

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
    <Audio src={staticFile("raygarage.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RAYGARAGE };
