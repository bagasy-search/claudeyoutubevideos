// RayAvatarWin.tsx — UNA VENTANA de avatar del canal Ray Kessler.
//
// En este flujo el avatar NO es una capa de fondo continua: se genera en RunPod SÓLO para las
// ventanas visibles (~25 % del video) y cada ventana se monta como un plano más de la capa base.
// Por eso este componente existe aparte de `RayAvatar` (que es el de fondo + bucle de los videos
// donde el creador grabó el avatar entero).
//
// ⛔ OffthreadVideo SIEMPRE, nunca <Video>: en el render <Video> busca por TIEMPO y no acierta el
//    cuadro exacto (repite y saltea de forma irregular = el "se ve lageado"). Y va MUTEADO: el
//    audio sale de UN solo <Audio> con el máster.
// ⛔ El avatar nunca va estático: push lento determinista (regla 2 del pipeline). El movimiento va
//    por el transform de Remotion (subpíxel), nunca horneado con ffmpeg.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, rnd } from "./RayStage";

export const RayAvatarWin: React.FC<{ src: string; seed?: number; durF?: number }> = ({ src, seed = 1, durF }) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const dur = Math.max(12, durF ?? cfg.durationInFrames);
  // push MUY leve y con sentido sorteado: sobre una cara, más de ~1 %/s se nota y marea
  const acerca = rnd(seed * 3 + 7) < 0.5;
  const amp = 0.012 + rnd(seed * 11 + 5) * 0.016;
  const zA = acerca ? 1.02 : 1.02 + amp;
  const zB = acerca ? 1.02 + amp : 1.02;
  const z = interpolate(frame, [0, dur], [zA, zB], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
  });
  const dx = (rnd(seed * 17 + 3) - 0.5) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
