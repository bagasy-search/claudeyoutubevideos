// Main_rkbottle.tsx — GENERADO por build_rkbottle.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkbottle.gen";
import { TOTAL_FRAMES_RKBOTTLE, AVATAR_FRAMES_RKBOTTLE } from "./avatar_rkbottle.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkbottle: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..524s) → BUCLE muteado para la cola. */}
    <RayAvatar src="rkbottle_opt.mp4" loopFrames={AVATAR_FRAMES_RKBOTTLE} />

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
    <Audio src={staticFile("rkbottle.wav")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKBOTTLE };
