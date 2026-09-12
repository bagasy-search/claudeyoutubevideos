// Main_rkfob.tsx — GENERADO por build_rkfob.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkfob.gen";
import { TOTAL_FRAMES_RKFOB, AVATAR_FRAMES_RKFOB } from "./avatar_rkfob.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkfob: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..933.845s) → BUCLE muteado para la cola. */}
    <RayAvatar src="rkfob_opt.mp4" loopFrames={AVATAR_FRAMES_RKFOB} />

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
    <Audio src={staticFile("rkfob.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKFOB };
