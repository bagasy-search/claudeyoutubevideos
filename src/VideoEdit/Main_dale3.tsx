// Main_dale3.tsx — GENERADO por build_dale3.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_dale3.gen";
import { TOTAL_FRAMES_DALE3 } from "./avatar_dale3.gen";

const F = (s: number) => Math.round(s * 30);

export const MainDale3: React.FC = () => (
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
    <Audio src={staticFile("dale3.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_DALE3 };
