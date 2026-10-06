// Main_rksafe.tsx — GENERADO por build_rksafe.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rksafe.gen";
import { TOTAL_FRAMES_RKSAFE, AVATAR_FRAMES_RKSAFE } from "./avatar_rksafe.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRksafe: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..685s) → BUCLE muteado para la cola. */}
    <RayAvatar src="rksafe_opt.mp4" loopFrames={AVATAR_FRAMES_RKSAFE} />

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
    <Audio src={staticFile("rksafe.wav")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSAFE };
