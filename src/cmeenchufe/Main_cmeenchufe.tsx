// Main_cmeenchufe.tsx — GENERADO por build_cmeenchufe.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEENCHUFE } from "./cues_cmeenchufe.gen";

export const TOTAL_FRAMES_CMEENCHUFE = 45531;
const AVATAR_FRAMES = 24634;
const LOOP_START = 24644;

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  OffthreadVideo, NUNCA <Video>: <Video> no acierta el cuadro exacto al rendear -> se ve como tiron.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo. */
const AvatarPiso: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
      <OffthreadVideo src={staticFile("cmeenchufe_opt.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_CMEENCHUFE - LOOP_START}>
      <OffthreadVideo src={staticFile("cmeenchufe_opt.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </AbsoluteFill>
);

export const MainCmeenchufe: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMEENCHUFE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEENCHUFE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeenchufe.wav")} />
    </AbsoluteFill>
  );
};
