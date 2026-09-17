// Main.tsx — GENERADO por work/famarioneta/montaje.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues.gen";

export const TOTAL_FRAMES_FAMARIONETA = 46022;
export const MainFamarioneta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F4EEDD" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} premountFor={15}>
        {c.el(Math.max(1, c.dur))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={Math.max(1, o.dur)} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, o.dur))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("famarioneta.m4a")} />
  </AbsoluteFill>
);
