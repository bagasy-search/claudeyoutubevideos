// ColdOpen.tsx — 0-~3 s del video: la MINIATURA real de la tarjeta (lo que el espectador clickeó) y,
// sin corte, la transición keyframe de agnes-video-2.5-flash que termina EXACTO en el primer cuadro
// del primer plano de metraje real. Es el ÚNICO uso permitido de agnes video en el canal.
//
//   pares.json → [{ id:"t00", first:"<thumb 1920x1080 png>", last:"<cuadro 0 del primer clip real>", prompt:"..." }]
//   node scripts/agnes_keyframe_trans.mjs pares.json public/broll/<slug>/open 2   → t00.mp4 (2 s, 1920x1080, 30/1)
//
// En el cfg: { p: 1, comp: 'ColdOpen', dur: 2.8, props: { thumb: 'img/<slug>_thumb.jpg', trans: 'broll/<slug>/open/t00.mp4' } }
// y `APERTURA_MIN: 2.8` para que el primer plano real arranque justo cuando termina la transición.
// ⛔ Sin texto, sin subtítulos: la narración ya está hablando desde el segundo 0.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { W } from "./Stage";

export const ColdOpen: React.FC<{ thumb: string; trans: string; hold?: number; durationInFrames?: number }> = ({ thumb, trans, hold = 0.8, durationInFrames }) => {
  const { fps, durationInFrames: seq } = useVideoConfig();
  const D = durationInFrames ?? seq;
  const h = Math.round(hold * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0 }}>
      <Img src={staticFile(thumb)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Sequence from={h} durationInFrames={Math.max(1, D - h)} layout="none">
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(trans)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
