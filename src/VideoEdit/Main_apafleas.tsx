// Main_apafleas.tsx — GENERADO por build_apafleas.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_apafleas.gen";
import { TOTAL_FRAMES_APAFLEAS } from "./avatar_apafleas.gen";

const F = (s: number) => Math.round(s * 30);

export const MainApafleas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1B1408" }}>
    {/* ⛔ NO hay capa de avatar de fondo: el avatar existe SOLO como cues (av/*.mp4) en los 80
        momentos full-frame. El resto lo cubre el b-roll, y la compuerta de cobertura del build
        exige >=99% para que este fondo nunca se vea. */}
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

    {/* UN solo <Audio> con el master */}
    <Audio src={staticFile("apafleas.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_APAFLEAS };
