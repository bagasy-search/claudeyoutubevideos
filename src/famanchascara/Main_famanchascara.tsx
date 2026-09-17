// Main_famanchascara.tsx — GENERADO por _v3/famanchascara/build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_famanchascara.gen";

export const TOTAL_FRAMES_FAMANCHASCARA = 45265;

export const MainFamanchascara: React.FC = () => (
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
    <Audio src={staticFile("famanchascara.m4a")} />
  </AbsoluteFill>
);
