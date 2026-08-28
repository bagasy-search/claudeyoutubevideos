// Main_cmesilencio.tsx — GENERADO por build_cmesilencio.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Loop, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMESILENCIO } from "./cues_cmesilencio.gen";

export const TOTAL_FRAMES_CMESILENCIO = 48835;

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  El archivo visual ya contiene el bucle completo y está a 30 fps.
 *  ⛔ NUNCA ESTÁTICO: el montaje le aplica un desplazamiento mínimo determinista. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Loop durationInFrames={48813}>
        <Video src={staticFile("avatar_cmesilencio.mp4")} muted style={est} />
      </Loop>
    </AbsoluteFill>
  );
};

export const MainCmesilencio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMESILENCIO.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMESILENCIO.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmesilencio_fish.wav")} />
    </AbsoluteFill>
  );
};
