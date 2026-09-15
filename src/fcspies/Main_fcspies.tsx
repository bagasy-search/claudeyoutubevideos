// Main_fcspies.tsx — GENERADO por build_fcspies.mjs.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_fcspies.gen";
import { Brand, HookOverlay } from "./Piezas";
export const TOTAL_FRAMES_FCSPIES = 76412;
export const MainFcspies: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A141A" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={165} layout="none">
      <HookOverlay text={"5 señales que un médico nunca ignora"} />
    </Sequence>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_FCSPIES} layout="none">
      <Brand />
    </Sequence>
    <Audio src={staticFile("fcspies.m4a")} />
  </AbsoluteFill>
);
export default MainFcspies;
