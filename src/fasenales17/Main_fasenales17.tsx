// Main_fasenales17.tsx — GENERADO por build_fasenales17.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_FASENALES17 } from "./cues_fasenales17.gen";

export const TOTAL_FRAMES_FASENALES17 = 96401;
const AVATAR_FRAMES = 38075;

/** El avatar es el PISO garantizado del video: base FULL, y el b-roll se apoya encima. El creador
 *  grabó 21 de los 54 minutos, así que a partir de ahí corre EN BUCLE y MUDO.
 *  ⛔ `OffthreadVideo`, NUNCA `<Video>`: al renderizar, `<Video>` busca POR TIEMPO y devuelve
 *     cuadros equivocados de forma IRREGULAR — es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA estático: un avatar full quieto se lee como una videollamada. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#14170F", overflow: "hidden" }}>
      <Loop durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("fasenales17_opt.mp4")} muted style={est} />
      </Loop>
    </AbsoluteFill>
  );
};

export const MainFasenales17: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#14170F" }}>
      <AvatarPiso />
      {CUES_FASENALES17.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_FASENALES17.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("fasenales17.m4a")} />
    </AbsoluteFill>
  );
};
