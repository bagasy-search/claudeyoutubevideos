// TdcVlogMain — montaje GENÉRICO de un video VLOG del canal: base = tramos de los mp4 por escena (armados por
// agnes_vlog `armar`) puestos en su segundo de la voz, cada uno con su cámara virtual (TdcCamera), capa de
// motion graphics por REGISTRO (overlay.kind = nombre del componente de src/tdc) y UNA pista de audio ya mezclada
// (voz máster + audio propio de los personajes + foley + cama + SFX, medida con las compuertas antes de rendear).
// Los otros videos del canal lo reusan: sólo cambian los datos (timeline.gen.ts del slug).
import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile } from "remotion";
import { TdcCamera } from "./TdcCamera";
import { TdcZoomCircle } from "./TdcZoomCircle";
import { TdcHandDraw } from "./TdcHandDraw";
import { TdcBucketRecipe } from "./TdcBucketRecipe";
import { TdcWallSection } from "./TdcWallSection";
import { TdcTitleSlam } from "./TdcTitleSlam";
import { TdcWipeCompare } from "./TdcWipeCompare";
import { TdcWaterTest } from "./TdcWaterTest";
import { TdcStepCounter } from "./TdcStepCounter";
import { TdcWarning } from "./TdcWarning";
import { TdcTimeSkip } from "./TdcTimeSkip";
import { TdcLamina } from "./TdcLamina";
import { TdcQrCard } from "./TdcQrCard";
import { TdcLabel } from "./TdcLabel";
import { TdcFlash } from "./TdcFlash";
import { TdcStopwatch } from "./TdcStopwatch";
import { TdcScrapTag } from "./TdcScrapTag";
import { TdcCaliper } from "./TdcCaliper";
import { TdcExploded } from "./TdcExploded";
import { TdcSparkWhip } from "./TdcSparkWhip";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REG: Record<string, React.FC<any>> = { TdcZoomCircle, TdcHandDraw, TdcBucketRecipe, TdcWallSection, TdcTitleSlam, TdcWipeCompare, TdcWaterTest,
  TdcStepCounter, TdcWarning, TdcTimeSkip, TdcLamina, TdcQrCard, TdcLabel, TdcFlash, TdcStopwatch, TdcScrapTag, TdcCaliper, TdcExploded, TdcSparkWhip };

export type VlogSeg = { key: string; src: string; from: number; dur: number; startFrom: number; rate?: number; freezeAt?: number;
  cam?: { push?: [number, number]; origin?: [number, number]; punches?: { at: number; amount?: number }[]; shakes?: { at: number; amp?: number; len?: number }[]; whipIn?: number; whipOut?: number; whipDir?: 1 | -1 } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VlogOverlay = { key: string; kind: string; from: number; dur: number; props: Record<string, any> };
export type VlogData = { segs: VlogSeg[]; overlays: VlogOverlay[]; audio: string; bg?: string };

export const TdcVlogMain: React.FC<{ data: VlogData }> = ({ data }) => (
  <AbsoluteFill style={{ backgroundColor: data.bg ?? "#0A0B08" }}>
    {data.segs.map((s) => (
      <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
        <TdcCamera dur={s.dur} {...(s.cam || {})}>
          {s.freezeAt != null ? (
            <Freeze frame={s.freezeAt}>
              <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Freeze>
          ) : (
            <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} playbackRate={s.rate ?? 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </TdcCamera>
      </Sequence>
    ))}
    {data.overlays.map((o) => {
      const C = REG[o.kind];
      if (!C) throw new Error("overlay desconocido: " + o.kind);
      return (
        <Sequence key={o.key} from={o.from} durationInFrames={o.dur} layout="none">
          <C dur={o.dur} {...o.props} />
        </Sequence>
      );
    })}
    <Audio src={staticFile(data.audio)} />
  </AbsoluteFill>
);
