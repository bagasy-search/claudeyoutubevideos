// Main_fcstobillo.tsx — GENERADO por build_fcstobillo.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { RayAvatar } from "../fcstob/RayStage";
import { CUES, OVERLAYS } from "./cues_fcstobillo.gen";
import { TOTAL_FRAMES_FCSTOBILLO, AVATAR_FRAMES_FCSTOBILLO, AVATAR_SRC_FCSTOBILLO, LOOP_FRAMES_FCSTOBILLO } from "./avatar_fcstobillo.gen";

const F = (s: number) => Math.round(s * 30);

// ⛔ OffthreadVideo, NUNCA <Video>: en el render <Video> busca por TIEMPO y devuelve cuadros
//    equivocados de forma irregular — es la causa #1 del "se ve lageado".
// ⛔ Nunca estático: push lento determinista (sub-píxel por transform, no horneado con ffmpeg).
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F15", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(AVATAR_SRC_FCSTOBILLO)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};

export const MainFcstobillo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F15" }}>
    {/* EL AVATAR ES EL FONDO GARANTIZADO. Tramo 1: en SINCRO (es su propio audio el que quedó en el
        máster). Tramo 2: BUCLE muteado, sólo como piso — la cola la cubre el b-roll al 100 %, así
        que la boca desincronizada no queda a la vista. */}
    <Sequence from={0} durationInFrames={AVATAR_FRAMES_FCSTOBILLO} layout="none">
      <AvatarPiso />
    </Sequence>
    <Sequence from={AVATAR_FRAMES_FCSTOBILLO} durationInFrames={Math.max(1, TOTAL_FRAMES_FCSTOBILLO - AVATAR_FRAMES_FCSTOBILLO)} layout="none">
      <RayAvatar src={AVATAR_SRC_FCSTOBILLO} loopFrames={LOOP_FRAMES_FCSTOBILLO} />
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

    {/* UN solo <Audio> con el master: cubre TODO el video. */}
    <Audio src={staticFile("fcstobillo.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FCSTOBILLO };
