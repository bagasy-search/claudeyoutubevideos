// Main_tswminioil.tsx — GENERADO por build_tswminioil.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_TSWMINIOIL } from "./cues_tswminioil.gen";

export const TOTAL_FRAMES_TSWMINIOIL = 54073;

const AV_FRAMES_TSWMINIOIL = 18178;
const LOOPS_TSWMINIOIL = 3;

/** El avatar es el FONDO GARANTIZADO, muteado (el audio sale del máster).
 *  Se LOOPEA acá en vez de empaquetar un mp4 de 30 min: el tar lo baja cada uno de los 60 chunks.
 *  El push Ken-Burns usa el frame GLOBAL, así no se reinicia en cada vuelta del bucle. */
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
      {Array.from({ length: LOOPS_TSWMINIOIL }, (_, k) => (
        <Sequence key={k} from={k * AV_FRAMES_TSWMINIOIL} durationInFrames={AV_FRAMES_TSWMINIOIL} layout="none">
          <AbsoluteFill><OffthreadVideo src={staticFile("tswminioil_opt.mp4")} muted style={est} /></AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MainTswminioil: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_TSWMINIOIL.map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("tswminioil.m4a")} />
    </AbsoluteFill>
  );
};
