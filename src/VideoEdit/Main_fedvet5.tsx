// Main_fedvet5.tsx — GENERADO por build_fedvet5.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_fedvet5.gen";
import { TOTAL_FRAMES_FEDVET5 } from "./avatar_fedvet5.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFedvet5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta ≥98%). */}

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
    <Audio src={staticFile("fedvet5.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FEDVET5 };
