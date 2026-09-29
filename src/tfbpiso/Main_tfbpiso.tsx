// tfbpiso — VLOG CONTINUO (agnes-video-2.5-flash) + capa de motion graphics nueva (src/tfb/Tfb*.tsx).
// Base = mp4 por escena (scripts/agnes_vlog.mjs armar) cortados en segmentos + cortes del tráiler + lámina.
// Encima: overlays Tfb* anclados a la palabra (ASR), cámara virtual (punch/shake/whip) y el diseño de sonido capa por
// capa: voz máster continua, foley de los planos keyframe, whoosh/impactos/riser, cama musical desde el seg ~6.
// Todo lo específico del video vive en timeline_tfbpiso.gen.ts (lo escribe vlog/tfbpiso/mktimeline.mjs).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, interpolate } from "remotion";
import { TL, OV, SFX, FOLEY, MUSIC, VOICE, TOTAL_FRAMES_TFBPISO } from "./timeline_tfbpiso.gen";
import { TfbCam, TfbFreeze, TfbFlash } from "../tfb/TfbCamera";
import { TfbLayerCut } from "../tfb/TfbLayerCut";
import { TfbWipeCompare } from "../tfb/TfbWipeCompare";
import { TfbBroomTexture } from "../tfb/TfbBroomTexture";
import { TfbZoomCircle } from "../tfb/TfbZoomCircle";
import { TfbScribble } from "../tfb/TfbScribble";
import { TfbStepCounter } from "../tfb/TfbStepCounter";
import { TfbCureCalendar } from "../tfb/TfbCureCalendar";
import { TfbRatio } from "../tfb/TfbRatio";
import { TfbCheckList } from "../tfb/TfbCheckList";
import { TfbDropTest } from "../tfb/TfbDropTest";
import { TfbQrCard } from "../tfb/TfbQrCard";
import { TfbPageZoom } from "../tfb/TfbPageZoom";
import { TfbTitleSlam } from "../tfb/TfbTitleSlam";

export { TOTAL_FRAMES_TFBPISO };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPS: Record<string, React.FC<any>> = { TfbLayerCut, TfbWipeCompare, TfbBroomTexture, TfbZoomCircle, TfbScribble, TfbStepCounter, TfbCureCalendar, TfbRatio, TfbCheckList, TfbDropTest, TfbQrCard, TfbPageZoom, TfbTitleSlam, TfbFreeze, TfbFlash };

export const MainTfbpiso: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {TL.map((c, i) => (
      <Sequence key={"v" + i} from={c.from} durationInFrames={c.dur} premountFor={30}>
        {c.kind === "vid" ? (
          <TfbCam dur={c.dur} punch={c.punch} shakes={c.shakes} whipIn={c.whipIn} whipOut={c.whipOut} push={c.push} gamma={c.gamma}>
            <OffthreadVideo src={staticFile(c.src!)} startFrom={c.startFrom || 0} playbackRate={c.rate || 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </TfbCam>
        ) : (
          <TfbPageZoom dur={c.dur} src={c.src!} keys={c.keys!} marks={c.marks} />
        )}
      </Sequence>
    ))}
    {OV.map((o, i) => { const C = COMPS[o.c]; return (
      <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur} premountFor={30}>
        <C dur={o.dur} {...o.props} />
      </Sequence>); })}
    <Audio src={staticFile(VOICE)} />
    {FOLEY.map((a, i) => (
      <Sequence key={"f" + i} from={a.from} durationInFrames={a.dur}>
        <Audio src={staticFile(a.src)} startFrom={a.startFrom || 0} volume={(fr) => a.vol * interpolate(fr, [0, 4, a.dur - 5, a.dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
    ))}
    {SFX.map((a, i) => (
      <Sequence key={"s" + i} from={a.from} durationInFrames={a.dur || 90}>
        <Audio src={staticFile(a.src)} volume={a.vol} />
      </Sequence>
    ))}
    {MUSIC.map((m, i) => (
      <Sequence key={"m" + i} from={m.from} durationInFrames={m.dur}>
        <Audio src={staticFile(m.src)} loop startFrom={m.startFrom || 0}
          volume={(fr) => m.vol * interpolate(fr, [0, m.fadeIn || 45, m.dur - (m.fadeOut || 60), m.dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
