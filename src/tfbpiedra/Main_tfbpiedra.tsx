// tfbpiedra — VLOG CONTINUO (agnes-video-2.5-flash) + capa de motion graphics frame a frame (src/tfb).
// Base = mp4 por escena (scripts/agnes_vlog.mjs armar) + planos del tráiler/receta + lámina. UN <Audio> con la mezcla
// final (voz máster + audio propio del vecino + foley + música + SFX, mezclado en vlog/tfbpiedra/mix.mjs).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { TL, FX, TOTAL_FRAMES_TFBPIEDRA, AUDIO, LAM_KEYS } from "./timeline.gen";
import type { Media } from "./timeline.gen";
import { TfbCam, TfbLabel, TfbScribble, TfbZoomCircle, TfbStepCounter, TfbTimingDial, TfbLayerCut, TfbRevealWipe, TfbProportion, TfbErrorList, TfbQRCard, TfbFreeze } from "../tfb";

export { TOTAL_FRAMES_TFBPIEDRA };
const FPS = 30;
const Vid: React.FC<{ m: Media }> = ({ m }) => (
  <OffthreadVideo src={staticFile(m.src)} startFrom={m.startFrom} playbackRate={m.rate || 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);
const Still: React.FC<{ src: string }> = ({ src }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;

// Lámina a pantalla completa: teclas [segundo, cx, cy, escala] con tramos suaves (zoom punto por punto).
const Lamina: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame(), t = f / FPS, ks = LAM_KEYS;
  let i = 0; while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)], T = 0.8;
  const p = b === a ? 0 : interpolate(t, [b[0] - T, b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cx = a[1] + (b[1] - a[1]) * p, cy = a[2] + (b[2] - a[2]) * p, s = a[3] + (b[3] - a[3]) * p;
  const W = 1920, H = 1080, iw = 1620, ih = 1080; // la lámina es 3:2: centrada sobre papel
  const ox = (W - iw) / 2;
  let tx = W / 2 - (ox + cx * iw) * s, ty = H / 2 - cy * ih * s;
  tx = Math.min(0, Math.max(W - W * s, tx)); ty = Math.min(0, Math.max(H - H * s, ty));
  const fadeIn = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#EADBB8", opacity: fadeIn }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: 0, width: iw, height: ih }} />
      </div>
    </AbsoluteFill>
  );
};

export const MainTfbpiedra: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {TL.map((c, i) => (
      <Sequence key={"v" + i} from={c.from} durationInFrames={c.dur}>
        {c.kind === "lam" ? <Lamina src={c.src} /> : c.kind === "still" ? (
          <TfbCam dur={c.dur} {...(c.cam || {})}><Still src={c.src} /></TfbCam>
        ) : (
          <TfbCam dur={c.dur} {...(c.cam || {})}><Vid m={{ src: c.src, startFrom: c.startFrom || 0, rate: c.rate }} /></TfbCam>
        )}
      </Sequence>
    ))}
    {FX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={x.dur}>
        {x.kind === "label" ? <TfbLabel dur={x.dur} {...(x.p as any)} />
          : x.kind === "scribble" ? <TfbScribble dur={x.dur} {...(x.p as any)} />
          : x.kind === "zoom" ? <TfbZoomCircle dur={x.dur} {...(x.p as any)}><Vid m={x.media!} /></TfbZoomCircle>
          : x.kind === "step" ? <TfbStepCounter dur={x.dur} {...(x.p as any)} />
          : x.kind === "dial" ? <TfbTimingDial dur={x.dur} {...(x.p as any)} />
          : x.kind === "layer" ? <TfbLayerCut dur={x.dur} {...(x.p as any)} />
          : x.kind === "wipe" ? <TfbRevealWipe dur={x.dur} {...(x.p as any)} before={<Still src={(x.p as any).beforeSrc} />} after={<Still src={(x.p as any).afterSrc} />} />
          : x.kind === "prop" ? <TfbProportion dur={x.dur} {...(x.p as any)} />
          : x.kind === "errors" ? <TfbErrorList dur={x.dur} {...(x.p as any)} />
          : x.kind === "qr" ? <TfbQRCard dur={x.dur} {...(x.p as any)} />
          : x.kind === "freeze" ? <TfbFreeze dur={x.dur} {...(x.p as any)} media={<Vid m={x.media!} />}>{(x.p as any).scribble ? <TfbScribble dur={x.dur} {...(x.p as any).scribble} /> : null}</TfbFreeze>
          : null}
      </Sequence>
    ))}
    <Audio src={staticFile(AUDIO)} />
  </AbsoluteFill>
);
