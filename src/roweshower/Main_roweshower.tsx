// Main_roweshower.tsx — GENERADO por _work/roweshower/montaje.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BASE, AVATAR, OVERLAYS, TOTAL_FRAMES_ROWESHOWER } from "./cues.gen";

const Capa: React.FC<{ cues: typeof BASE }> = ({ cues }) => (
  <>
    {cues.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, c.dur))}</AbsoluteFill>
      </Sequence>
    ))}
  </>
);

export const MainRoweshower: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A1220" }}>
    <Capa cues={BASE} />
    <Capa cues={AVATAR} />
    <Capa cues={OVERLAYS} />
    <Audio src={staticFile("roweshower.m4a")} />
  </AbsoluteFill>
);
export { TOTAL_FRAMES_ROWESHOWER };
