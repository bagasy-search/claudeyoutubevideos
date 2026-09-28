// RayAvatarWin.tsx — UNA VENTANA de avatar del canal Ray Kessler, A PANTALLA COMPLETA.
//
// En este flujo el avatar NO es una capa de fondo continua: se genera en RunPod SÓLO para las
// ventanas visibles (~20 % del video) y cada ventana se monta como un plano más de la capa base.
//
// ⛔⛔ VA FULL, SIEMPRE. Regla dura del creador (jul-2026, reafirmada el 20-sep-2026 mirando
//    `rkspots`): "no uses el recuadro del avatar a menos que sea él y de fondo una pizarra o una
//    explicación. En general usá o el avatar pantalla completa, o la foto/video pantalla completa,
//    porque queda raro sino." El PiP en panel se ve amateur; full↔full se ve intencional.
//    ⚠️ Una versión anterior metía el reel en un panel de 960×540 con una chapa de marca al lado
//    para bajar el upscale de 2,31× a 1,154×. **Eso fue un error**: el creador lo rechazó a la
//    primera. El upscale es un problema REAL (el endpoint devuelve 832×464 FIJO, y `size:"720p"`
//    devuelve lo mismo — medido), pero se combate en el CONFORMADO del reel (lanczos + unsharp a
//    1920×1080) y con una REFERENCIA nítida, no achicando el avatar en pantalla.
// ⛔ La única excepción al full es un split deliberado tipo pizarra: avatar a un lado y una
//    EXPLICACIÓN/diagrama al otro. Una chapa con el nombre del canal NO es una explicación.
// ⛔ OffthreadVideo SIEMPRE, nunca <Video>: en el render <Video> busca por TIEMPO y no acierta el
//    cuadro exacto. Va MUTEADO: el audio sale de UN solo <Audio> con el máster.
// ⛔ Ningún plano de avatar full sin deriva de cámara: push lento a velocidad constante, o se ve
//    estático contra el b-roll. Muy leve sobre una cara — más de ~1 %/s se nota y marea.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, rnd } from "./RayStage";

export const RayAvatarWin: React.FC<{ src: string; seed?: number; durF?: number; bed?: string }> = ({
  src, seed = 1, durF,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const dur = Math.max(12, durF ?? cfg.durationInFrames);

  // Push lento determinista por seed, a velocidad CONSTANTE (nunca estático, sin importar el largo).
  // Arranca en 1.0 y deriva ~0,9 %/s con tope, o al revés. El sentido se sortea: alternarlo por
  // índice hace que las ventanas se lean como plantilla.
  const acerca = rnd(seed * 3 + 7) < 0.5;
  const segs = dur / cfg.fps;
  const amp = Math.min(0.055, 0.009 * segs);
  const z = interpolate(frame, [0, dur], acerca ? [1.0, 1.0 + amp] : [1.0 + amp, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z.toFixed(4)})`, transformOrigin: "50% 42%",
        }}
      />
    </AbsoluteFill>
  );
};
