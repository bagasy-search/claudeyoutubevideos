// Main_cmegenerador.tsx — GENERADO por build_cmegenerador.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEGENERADOR } from "./cues_cmegenerador.gen";

export const TOTAL_FRAMES_CMEGENERADOR = 43709;
const AVATAR_FRAMES = 24569;
const LOOP_START = 24577;

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo.
 *
 *  ⛔⛔ OffthreadVideo, NUNCA el componente Video. Medido sobre el render: con Video la
 *  diferencia entre cuadros consecutivos de la cara saltaba de 1,99 a 14,33, mientras el archivo
 *  fuente daba 3,5-4,2 parejo. No son cuadros REPETIDOS (por eso una métrica de "cuadros iguales"
 *  da 0% y miente): son cuadros DESORDENADOS — el elemento video del navegador, en un render por
 *  chunks que arranca en un frame arbitrario de un mp4 de 13 minutos, entrega el cuadro que tenga
 *  a mano. Ése es el "se ve todo lageado" que el creador marcó en TODOS los videos de este canal.
 *
 *  ⛔ Y el avatar va SIN transform. Un scale() sobre un video de 1920 lo re-muestrea en cada
 *  cuadro y lo ablanda justo en el plano que más se mira. La regla de "avatar nunca estático" la
 *  cumple él solo: está hablando. */
const AvatarPiso: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
    <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
      <OffthreadVideo src={staticFile("cmegenerador_opt.mp4")} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_CMEGENERADOR - LOOP_START}>
      <OffthreadVideo src={staticFile("cmegenerador_opt.mp4")} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </AbsoluteFill>
);

export const MainCmegenerador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMEGENERADOR.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEGENERADOR.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmegenerador.wav")} />
    </AbsoluteFill>
  );
};
