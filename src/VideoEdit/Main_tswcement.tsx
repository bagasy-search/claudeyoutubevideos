// Main_tswcement.tsx — GENERADO por build_tswcement.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_tswcement.gen";
import { TOTAL_FRAMES_TSWCEMENT } from "./avatar_tswcement.gen";

const F = (s: number) => Math.round(s * 30);

export const MainTswcement: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0D0F0D" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta >=98%). */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: paneles laterales POR ENCIMA de la base, nunca la ocultan del todo */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    <Audio src={staticFile("tswcement.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_TSWCEMENT };
