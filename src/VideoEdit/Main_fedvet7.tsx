// Main_fedvet7.tsx — GENERADO por build_fedvet7.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../fedvet/RayStage";
import { CUES, OVERLAYS } from "./cues_fedvet7.gen";
import { TOTAL_FRAMES_FEDVET7 } from "./avatar_fedvet7.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFedvet7: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* AVATAR = FONDO GARANTIZADO, base FULL siempre. Real 0..10438f, bucle después.
        Va con RayAvatar (OffthreadVideo + push lento): nunca estático, y nunca el elemento
        de video legacy — la compuerta de abajo lo prohíbe. */}
    <Sequence from={0} durationInFrames={10438} layout="none">
      <AbsoluteFill><RayAvatar src="fedvet7_opt.mp4" loopFrames={10438} /></AbsoluteFill>
    </Sequence>
    <Sequence from={10438} durationInFrames={Math.max(1, TOTAL_FRAMES_FEDVET7 - 10438)} layout="none">
      <AbsoluteFill><RayAvatar src="fedvet7_loop.mp4" loopFrames={930} /></AbsoluteFill>
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
    <Audio src={staticFile("fedvet7.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FEDVET7 };
