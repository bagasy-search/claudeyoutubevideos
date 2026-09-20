// Main_rkspots.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { CUES, OVERLAYS } from "./cues_rkspots.gen";
import { TOTAL_FRAMES_RKSPOTS, AVATAR_FRAMES_RKSPOTS } from "./avatar_rkspots.gen";

const F = (s: number) => Math.round(s * 30);

export const MainRkspots: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
{/* MODO VENTANAS: no hay avatar de fondo. El fondo es NEGRO y la cobertura tiene que dar 100 %. */}

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
    <Audio src={staticFile("rkspots.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSPOTS };
