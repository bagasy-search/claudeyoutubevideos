// lety01 · lo común del resto del video (después del minuto 1): mundo con blur de movimiento, avatar por ventanas (todas),
// y el armado por tramos. Cada tramo (m2…m9) trae SUS piezas nuevas; acá sólo lo que no se ve.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { World as WorldRaw, WorldProps, camSpeed } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { P, s } from "./lib";

export const REEL = (AVAIL as { reel: boolean }).reel;
export const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
export const WIN: Win[] = (AVW as { win: Win[] }).win;
// ventana de avatar que contiene t (o la próxima/anterior)
export const avIn = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
export const AV = (near: number) => { const w = WIN.reduce((b, x) => (Math.abs(x.ms - near) < Math.abs(b.ms - near) ? x : b)); return [w.ms, w.me] as [number, number]; };

export const World3: React.FC<{ t: number; st: (t: number) => WorldProps }> = ({ t, st }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...st(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// avatar: preroll de 10 cuadros por ventana; sólo monta las ventanas cercanas a t
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const near = WIN.filter((w) => t > w.ms - 1 && t < w.me + 0.5);
  const face = REEL ? <>{near.map((w) => (
    <Sequence key={w.ms} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
