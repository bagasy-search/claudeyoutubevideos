// Main_rkbill.tsx — GENERADO por build_rkbill.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkbill.gen";
import { TOTAL_FRAMES_RKBILL, AVATAR_FRAMES_RKBILL } from "./avatar_rkbill.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkbill: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..749s) → BUCLE muteado para la cola. */}
    <RayAvatar src="rkbill_opt.mp4" loopFrames={AVATAR_FRAMES_RKBILL} />

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
    <Audio src={staticFile("rkbill.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKBILL };
