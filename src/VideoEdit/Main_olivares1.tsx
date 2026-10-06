// Main_olivares1.tsx — GENERADO por build_olivares1.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS, TOTAL_FRAMES_OLIVARES1, AVATAR_LOOP_FRAMES } from "./cues_olivares1.gen";
import { OlivAvatar } from "../olivares/OlivStage";

const F = (s: number) => Math.round(s * 30);

export const MainOlivares1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F14" }}>
    {/* L0 · el avatar REAL es el fondo garantizado de todo el video (base FULL, regla anti-hueco).
        Va en bucle porque está grabada la primera mitad; las costuras están tapadas por un cue
        opaco (compuerta del build). OffthreadVideo SIEMPRE: <Video> sirve cuadros equivocados. */}
    <OlivAvatar src="olivares1_opt.mp4" loopFrames={AVATAR_LOOP_FRAMES} />

    {/* L1 · b-roll opaco encima */}
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* L2 · overlays del kit premium, ENCIMA del b-roll vivo, nunca como cue base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster. El avatar va muteado. */}
    <Audio src={staticFile("olivares1.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OLIVARES1 };
