// Main_falifting.tsx — GENERADO por build_falifting.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_falifting.gen";

export const TOTAL_FRAMES_FALIFTING = 21668;
const F = (s: number) => Math.round(s * 30);

export const MainFalifting: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F4EEDD" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={F(c.start)} durationInFrames={Math.max(1, F(c.dur))} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, F(c.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("falifting.m4a")} />
    <Sequence from={198} durationInFrames={155} layout="none"><Audio src={staticFile("broll/falifting/falifting_001_fx.m4a")} volume={(f) => 1 * Math.min(1, f / 4.5, (155 - f) / 4.5)} /></Sequence>
    <Sequence from={1210} durationInFrames={180} layout="none"><Audio src={staticFile("broll/falifting/falifting_008_fx.m4a")} volume={(f) => 1 * Math.min(1, f / 4.5, (180 - f) / 4.5)} /></Sequence>
    <Sequence from={1634} durationInFrames={201} layout="none"><Audio src={staticFile("broll/falifting/falifting_010_fx.m4a")} volume={(f) => 1 * Math.min(1, f / 4.5, (201 - f) / 4.5)} /></Sequence>
    <Sequence from={16976} durationInFrames={114} layout="none"><Audio src={staticFile("broll/falifting/falifting_095_fx.m4a")} volume={(f) => 1 * Math.min(1, f / 4.5, (114 - f) / 4.5)} /></Sequence>
    <Sequence from={17224} durationInFrames={141} layout="none"><Audio src={staticFile("broll/falifting/falifting_097_fx.m4a")} volume={(f) => 1 * Math.min(1, f / 4.5, (141 - f) / 4.5)} /></Sequence>
  </AbsoluteFill>
);
