// Main_valmaicena.tsx — GENERADO por _v3/valmaicena/build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_valmaicena.gen";

export const TOTAL_FRAMES_VALMAICENA = 44889;

export const MainValmaicena: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F8F4EA" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={Math.round(c.start * 30)} durationInFrames={Math.max(1, Math.round((c.start + c.dur) * 30) - Math.round(c.start * 30))} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, Math.round((c.start + c.dur) * 30) - Math.round(c.start * 30)))}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={Math.round(o.start * 30)} durationInFrames={Math.max(1, Math.round(o.dur * 30))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, Math.round(o.dur * 30)))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("valmaicena.m4a")} />
  </AbsoluteFill>
);
