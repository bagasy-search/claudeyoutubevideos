// Main_apafireants.tsx — GENERADO por build_apafireants.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ApaAvatar } from "../apa/ApaStage";
import { CUES, OVERLAYS } from "./cues_apafireants.gen";
import { TOTAL_FRAMES_APAFIREANTS } from "./avatar_apafireants.gen";

const F = (s: number) => Math.round(s * 30);

export const MainApafireants: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1B1408" }}>
    {/* AVATAR = FONDO GARANTIZADO, base FULL siempre. Real 0..10481f, bucle después.
        Va con RayAvatar (OffthreadVideo + push lento): nunca estático, y nunca el elemento
        de video legacy — la compuerta de abajo lo prohíbe. */}
    <Sequence from={0} durationInFrames={10481} layout="none">
      <AbsoluteFill><ApaAvatar src="apafireants_opt.mp4" loopFrames={10481} /></AbsoluteFill>
    </Sequence>
    <Sequence from={10481} durationInFrames={Math.max(1, TOTAL_FRAMES_APAFIREANTS - 10481)} layout="none">
      <AbsoluteFill><ApaAvatar src="apafireants_loop.mp4" loopFrames={1020} /></AbsoluteFill>
    </Sequence>


    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master: cubre TODO el video (avatar parcial + cola). */}
    <Audio src={staticFile("apafireants.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_APAFIREANTS };
