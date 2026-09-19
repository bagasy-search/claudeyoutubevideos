// Main_rksmart.tsx — GENERADO por _v3/rksmart_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_rksmart.gen";
import { TOTAL_FRAMES_RKSMART } from "./avatar_rksmart.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRksmart: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base (y por eso el plan les pone una cama debajo) */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster: cubre TODO el video. */}
    <Audio src={staticFile("rksmart.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSMART };
