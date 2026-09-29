// tfbinodoro — VLOG CONTINUO (agnes-video-2.5-flash) + capa de motion graphics del canal (src/tfb/Tfb*).
// Base = mp4 por escena (scripts/agnes_vlog.mjs armar) + cortes del tráiler (planos keyframe con foley) + la ficha a
// pantalla completa + QR real. Encima, los componentes Tfb anclados a la palabra dicha (timeline generado por
// vlog/tfbinodoro/mktimeline.mjs). UN <Audio>: la mezcla final (voz máster + vecino + foley + SFX + música) de mix.py.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { TL, FX, TOTAL_FRAMES_TFBINODORO, AUDIO, LAM_KEYS, LAM_SRC, QR_SRC, COVER_SRC, type Cue, type Fx } from "./timeline_tfbinodoro.gen";
import { TfbCam } from "../tfb/TfbCam";
import { TfbZoomCircle } from "../tfb/TfbZoomCircle";
import { TfbXRay } from "../tfb/TfbXRay";
import { TfbJetMap } from "../tfb/TfbJetMap";
import { TfbStepCounter } from "../tfb/TfbStepCounter";
import { TfbStroke } from "../tfb/TfbStroke";
import { TfbWipe } from "../tfb/TfbWipe";
import { TfbFreeze } from "../tfb/TfbFreeze";
import { TfbWarn } from "../tfb/TfbWarn";
import { TfbPunchWords } from "../tfb/TfbPunchWords";
import { TfbQRCard } from "../tfb/TfbQRCard";
import { TfbLamina } from "../tfb/TfbLamina";

export { TOTAL_FRAMES_TFBINODORO };

const Vid: React.FC<{ src: string; startFrom?: number; rate?: number }> = ({ src, startFrom = 0, rate = 1 }) => (
  <OffthreadVideo src={staticFile(src)} startFrom={startFrom} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);
const Still: React.FC<{ src: string }> = ({ src }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;

const Base: React.FC<{ c: Cue }> = ({ c }) => {
  if (c.kind === "lam") return <TfbLamina src={staticFile(LAM_SRC)} keys={LAM_KEYS} />;
  const inner = c.img ? <Still src={c.img} /> : <Vid src={c.src!} startFrom={c.startFrom} rate={c.rate} />;
  return (
    <TfbCam push={c.push} punches={c.punches} shakes={c.shakes} whipIn={c.whipIn} whipOut={c.whipOut} dur={c.dur} whipDir={c.whipDir}>
      {inner}
    </TfbCam>
  );
};

// nodo de footage para los componentes que lo necesitan (zoom, xray, jetmap, freeze, wipe)
const node = (s?: { src?: string; img?: string; startFrom?: number; rate?: number }) =>
  !s ? undefined : s.img ? <Still src={s.img} /> : <Vid src={s.src!} startFrom={s.startFrom} rate={s.rate} />;

const FxView: React.FC<{ x: Fx }> = ({ x }) => {
  const p = x.p as any;
  switch (x.kind) {
    case "cover": return <TfbCam push={p.push} dur={x.dur}>{node(x.foot)}</TfbCam>; // tapa de labios: detalle a pantalla completa
    case "zoom": return <TfbZoomCircle {...p}>{node(x.foot)}</TfbZoomCircle>;
    case "xray": return <TfbXRay {...p}>{node(x.foot)}</TfbXRay>;
    case "jets": return <TfbJetMap {...p}>{node(x.foot)}</TfbJetMap>;
    case "step": return <TfbStepCounter {...p} dur={x.dur} />;
    case "stroke": return <TfbStroke {...p} />;
    case "wipe": return <TfbWipe {...p} before={node(p.beforeFoot)} after={node(p.afterFoot)} />;
    case "freeze": return <TfbFreeze {...p} dur={x.dur}>{node(x.foot)}</TfbFreeze>;
    case "warn": return <TfbWarn {...p} dur={x.dur} />;
    case "words": return <TfbPunchWords {...p} dur={x.dur} />;
    case "qr": return <TfbQRCard qr={staticFile(QR_SRC)} cover={staticFile(COVER_SRC)} {...p} dur={x.dur} />;
    default: return null;
  }
};

export const MainTfbinodoro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {TL.map((c, i) => (
      <Sequence key={"b" + i} from={c.from} durationInFrames={c.dur} premountFor={30}>
        <Base c={c} />
      </Sequence>
    ))}
    {FX.map((x, i) => (
      <Sequence key={"f" + i} from={x.from} durationInFrames={x.dur} premountFor={30}>
        <FxView x={x} />
      </Sequence>
    ))}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
