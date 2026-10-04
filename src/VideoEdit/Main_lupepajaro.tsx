// Main_lupepajaro.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { CUES, OVERLAYS } from "./cues_lupepajaro.gen";
import { RayTrans } from "../rksafe/RayTrans";
import { TOTAL_FRAMES_LUPEPAJARO, AVATAR_FRAMES_LUPEPAJARO } from "./avatar_lupepajaro.gen";

const F = (s: number) => Math.round(s * 30);

export const MainLupepajaro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
{/* MODO VENTANAS: no hay avatar de fondo. El fondo es NEGRO y la cobertura tiene que dar 100 %. */}

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur)) + (cue.ov ?? 0)} layout="none">
        <RayTrans inKind={cue.tin ?? "cut"} outKind={cue.tout ?? "cut"} d={Math.max(1, F(cue.dur))} ov={cue.ov ?? 0}>{cue.el(Math.max(1, F(cue.dur)))}</RayTrans>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master */}
    <Audio src={staticFile("lupepajaro.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_LUPEPAJARO };
