// Main_fcsflema.tsx — GENERADO por build_fcsflema.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_fcsflema.gen";
import { Brand, HookOverlay } from "./Piezas";

export const TOTAL_FRAMES_FCSFLEMA = 76908;

export const MainFcsflema: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A141A" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={195} layout="none">
      <HookOverlay text={"La verdadera causa de la flema que no se va"} />
    </Sequence>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES_FCSFLEMA} layout="none">
      <Brand />
    </Sequence>
    <Audio src={staticFile("fcsflema.m4a")} />
  </AbsoluteFill>
);
export default MainFcsflema;
