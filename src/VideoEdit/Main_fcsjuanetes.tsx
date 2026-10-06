// Main_fcsjuanetes.tsx — GENERADO por build_fcsjuanetes.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_fcsjuanetes.gen";

export const TOTAL_FRAMES_FCSJUANETES = 80795;
const F = (s: number) => Math.round(s * 30);

export const MainFcsjuanetes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#08110F" }}>
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
    <Audio src={staticFile("fcsjuanetes.m4a")} />
  </AbsoluteFill>
);
