// Piezas.tsx — las DOS primitivas del montaje VLOG CRUDO de `tswfan12v`.
// El canal es planos crudos a sangre y CERO componentes (feedback_edicion_vlog_casero_claudio),
// así que acá no hay nada más que el clip y la foto. Sin dependencias externas: la versión
// clonada de tcaceite importaba `./VoltStage` para componentes que este video NO usa, y eso
// mató los 60 chunks con "Can't resolve './VoltStage'".
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#0A0B08";

/** PRNG determinista por semilla. ⛔ Nunca Math.random: el farm renderiza en 60 chunks
 *  separados y cada uno tiene que dar exactamente el mismo cuadro. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** ⛔⛔ VA CON `OffthreadVideo`, NUNCA CON `Video`: al rendear, el componente de video del
 *  navegador busca POR TIEMPO y no acierta el cuadro exacto -> repite y saltea de forma
 *  IRREGULAR = TIRÓN. `OffthreadVideo` extrae el cuadro con ffmpeg.
 *  El clip va a sangre. Cama de negro abajo para que nunca asome el avatar por los bordes
 *  del objectFit. */
export const Clip: React.FC<{ src: string; speed?: number }> = ({ src, speed = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={speed}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          // Empuje mínimo por CSS (subpíxel). Sin esto, los clips que el i2v deja casi
          // quietos se leen como plano CONGELADO, que es peor que una foto — a la foto el
          // Ken-Burns sí le da movimiento. Horneado con ffmpeg cuantizaría a píxel entero
          // y ESO sí se lee como tirón.
          transform: `scale(${(1.02 + frame * 0.00035).toFixed(5)})`,
        }} />
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento, determinista por `seed`. */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dir = rnd(seed) > 0.5 ? 1 : -1;
  const span = Math.max(2, durationInFrames);
  const z = interpolate(frame, [0, span], [1.04, 1.11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const px = interpolate(frame, [0, span], [0, dir * 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${z.toFixed(4)}) translateX(${px.toFixed(2)}%)`,
      }} />
    </AbsoluteFill>
  );
};
