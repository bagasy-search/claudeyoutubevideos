// Main_tcsalmetal.tsx — GENERADO por build_tcsalmetal.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_tcsalmetal.gen";

export const TOTAL_FRAMES_TCSALMETAL = 35217;

const F = (s: number) => Math.round(s * 30);

export const MainTcsalmetal: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    {/* NARRADOR PURO: no hay avatar. La cobertura la dan los planos base (compuerta ≥98 %). */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA del metraje, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    <Audio src={staticFile("tcsalmetal.m4a")} />
  </AbsoluteFill>
);
