// Main_apayellow.tsx — GENERADO por build_apayellow.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ApaAvatar } from "../apa/ApaStage";
import { CUES, OVERLAYS } from "./cues_apayellow.gen";
import { TOTAL_FRAMES_APAYELLOW } from "./avatar_apayellow.gen";

const F = (s: number) => Math.round(s * 30);

export const MainApayellow: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1B1408" }}>
    {/* AVATAR = FONDO GARANTIZADO, base FULL siempre. Real 0..21629f, bucle después.
        Va con RayAvatar (OffthreadVideo + push lento): nunca estático, y nunca el elemento
        de video legacy — la compuerta de abajo lo prohíbe. */}
    <Sequence from={0} durationInFrames={21629} layout="none">
      <AbsoluteFill><ApaAvatar src="apayellow_opt.mp4" loopFrames={21629} /></AbsoluteFill>
    </Sequence>
    <Sequence from={21629} durationInFrames={Math.max(1, TOTAL_FRAMES_APAYELLOW - 21629)} layout="none">
      <AbsoluteFill><ApaAvatar src="apayellow_loop.mp4" loopFrames={1005} /></AbsoluteFill>
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
    <Audio src={staticFile("apayellow.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_APAYELLOW };
