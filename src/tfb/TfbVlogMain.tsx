// TfbVlogMain — montaje GENÉRICO de un video VLOG del canal: base = tramos de los mp4 por escena (armados por
// agnes_vlog `armar`) puestos en su segundo de la voz, cada uno con su cámara virtual (TfbCamera), capa de
// motion graphics por REGISTRO (overlay.kind = nombre del componente de src/tfb) y UNA pista de audio ya mezclada
// (voz máster + audio propio de los personajes + foley + cama + SFX, medida con las compuertas antes de rendear).
// Los otros videos del canal lo reusan: sólo cambian los datos (timeline.gen.ts del slug).
import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile } from "remotion";
import { TfbCamera } from "./TfbCamera";
import { TfbZoomCircle } from "./TfbZoomCircle";
import { TfbHandDraw } from "./TfbHandDraw";
import { TfbBucketRecipe } from "./TfbBucketRecipe";
import { TfbWallSection } from "./TfbWallSection";
import { TfbTitleSlam } from "./TfbTitleSlam";
import { TfbWipeCompare } from "./TfbWipeCompare";
import { TfbWaterTest } from "./TfbWaterTest";
import { TfbStepCounter } from "./TfbStepCounter";
import { TfbWarning } from "./TfbWarning";
import { TfbTimeSkip } from "./TfbTimeSkip";
import { TfbLamina } from "./TfbLamina";
import { TfbQrCard } from "./TfbQrCard";
import { TfbLabel } from "./TfbLabel";
import { TfbFlash } from "./TfbFlash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REG: Record<string, React.FC<any>> = { TfbZoomCircle, TfbHandDraw, TfbBucketRecipe, TfbWallSection, TfbTitleSlam, TfbWipeCompare, TfbWaterTest,
  TfbStepCounter, TfbWarning, TfbTimeSkip, TfbLamina, TfbQrCard, TfbLabel, TfbFlash };

export type VlogSeg = { key: string; src: string; from: number; dur: number; startFrom: number; rate?: number; freezeAt?: number;
  cam?: { push?: [number, number]; origin?: [number, number]; punches?: { at: number; amount?: number }[]; shakes?: { at: number; amp?: number; len?: number }[]; whipIn?: number; whipOut?: number; whipDir?: 1 | -1 } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VlogOverlay = { key: string; kind: string; from: number; dur: number; props: Record<string, any> };
export type VlogData = { segs: VlogSeg[]; overlays: VlogOverlay[]; audio: string; bg?: string };

export const TfbVlogMain: React.FC<{ data: VlogData }> = ({ data }) => (
  <AbsoluteFill style={{ backgroundColor: data.bg ?? "#0A0B08" }}>
    {data.segs.map((s) => (
      <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
        <TfbCamera dur={s.dur} {...(s.cam || {})}>
          {s.freezeAt != null ? (
            <Freeze frame={s.freezeAt}>
              <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Freeze>
          ) : (
            <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} playbackRate={s.rate ?? 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </TfbCamera>
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
