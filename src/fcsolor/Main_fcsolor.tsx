// Main_fcsolor.tsx — GENERADO por build_fcsolor.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_fcsolor.gen";
import { Brand, HookOverlay } from "./Piezas";

export const TOTAL_FRAMES_FCSOLOR = 77597;

export const MainFcsolor: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A141A" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={397} layout="none">
      <HookOverlay text={"El olor a viejo NO es falta de higiene"} />
    </Sequence>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_FCSOLOR} layout="none">
      <Brand />
    </Sequence>
    <Audio src={staticFile("fcsolor.m4a")} />
  </AbsoluteFill>
);
export default MainFcsolor;
