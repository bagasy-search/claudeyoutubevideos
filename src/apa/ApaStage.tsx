// ApaStage — capas base de The Amish Pest Almanac (apafireants).
// ⛔⛔ TODO video va con OffthreadVideo, NUNCA <Video>: en el RENDER el elemento de video del
//    navegador busca por TIEMPO y devuelve cuadros EQUIVOCADOS (repite y saltea de forma
//    irregular). Es la causa #1 del "se ve lageado". OffthreadVideo extrae el cuadro con ffmpeg.
// ⛔ Sin fade de entrada en el clip: los beats son contiguos, un `enter()` deja el frame 0 en
//    opacidad 0 sobre el fondo = UN FRAME NEGRO EN CADA CORTE (medido en fedvet2).
// ⛔ El movimiento va por transform de CSS (subpixel), nunca horneado con ffmpeg (cuantiza a
//    pixel entero y se lee como tiron).
import React from "react";
import {
  AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame,
} from "remotion";

const INK = "#1B1408";   // tierra oscura: el fondo nunca es negro puro

/** Avatar de fondo GARANTIZADO. Nunca estatico: push lento Ken-Burns. */
export const ApaAvatar: React.FC<{ src: string; loopFrames: number }> = ({ src, loopFrames }) => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Loop durationInFrames={loopFrames}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }}
        />
      </Loop>
    </AbsoluteFill>
  );
};

/** Clip a sangre. Va DENTRO de un Loop: si el slot dura mas que el clip, la cola se CONGELA. */
export const ApaClip: React.FC<{ src: string; rate?: number; loopFrames?: number }> = ({
  src, rate = 1, loopFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 180], [1.012, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const x = interpolate(frame, [0, 180], [-0.32, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const vid = (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      playbackRate={rate}
      style={{ width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${z.toFixed(4)}) translateX(${x.toFixed(3)}%)` }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {loopFrames > 0 ? <Loop durationInFrames={loopFrames}>{vid}</Loop> : vid}
    </AbsoluteFill>
  );
};

/** Foto a sangre con Ken-Burns casi imperceptible: movimiento de camara, no efecto de poster. */
export const ApaFoto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const frame = useCurrentFrame();
  const dir = seed % 2 === 0 ? 1 : -1;
  const z = interpolate(frame, [0, 300], [1.02, 1.075], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const x = interpolate(frame, [0, 300], [-0.5 * dir, 0.5 * dir], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  const y = interpolate(frame, [0, 300], [0.25 * dir, -0.25 * dir], { extrapolateLeft: "clamp", extrapolateRight: "extend", easing: Easing.linear });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${z.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};
