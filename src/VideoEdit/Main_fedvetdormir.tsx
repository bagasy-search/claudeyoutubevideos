// Main_fedvetdormir.tsx — GENERADO por build_fedvetdormir.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_fedvetdormir.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FEDVETDORMIR, TOTAL_FRAMES_FEDVETDORMIR } from "./avatar_fedvetdormir.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFedvetdormir: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* AVATAR = PISO GARANTIZADO. Tramo 1 = el mp4 real (sincronizado con su propia voz);
        cola = el MISMO mp4 en BUCLE MUTEADO, que nunca queda expuesto (compuerta de cola = 100%).
        Va MUTEADO siempre: el audio de TODO el video es el único <Audio> del master. */}
    <AvatarLayerLoopFcs
      src="fedvetdormir_opt.mp4"
      windows={AVATAR_WINDOWS}
      avatarFrames={AVATAR_FRAMES_FEDVETDORMIR}
      accent="#E8A317"
      avatarFocus={{ x: 0.5, y: 0.24 }}
    />

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
    <Audio src={staticFile("fedvetdormir.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FEDVETDORMIR };
