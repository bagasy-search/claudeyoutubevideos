// Media — plano base del canal: foto con Ken-Burns o clip (OffthreadVideo) con recorte y velocidad.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { easeInOut } from "./theme";

export const isVideo = (s: string) => /\.(mp4|mov|webm)$/i.test(s);
export const asset = (s: string) => (/^(https?:|data:|\/)/.test(s) ? s : staticFile(s));

// largo real (s) de cada clip del plan: ningún clip se agota antes de que termine su plano
let CLIP_LENS: Record<string, number> = {};
export const setClipLens = (m: Record<string, number>) => { CLIP_LENS = m; };
// arranque oscuro medido (fundidos desde negro del archivo): esos segundos se saltean
let CLIP_SKIP: Record<string, number> = {};
export const setClipSkip = (m: Record<string, number>) => { CLIP_SKIP = m; };

export type KB = "in" | "out" | "left" | "right" | "up" | "down" | "none";

export const Media: React.FC<{
  src: string; start?: number; rate?: number; kb?: KB; zoom?: number; filter?: string;
  pos?: string; style?: React.CSSProperties; muted?: boolean; durFrames?: number;
}> = ({ src, start: start0 = 0, rate = 1, kb = "in", zoom = 1.12, filter, pos = "50% 50%", style, muted = true, durFrames }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = start0 + (CLIP_SKIP[src] ?? 0);
  const D = durFrames ?? durationInFrames;
  const t = easeInOut(f / Math.max(1, D));
  let s = 1, x = 0, y = 0;
  const z = zoom - 1;
  if (kb === "in") s = 1 + z * t;
  else if (kb === "out") s = zoom - z * t;
  else if (kb === "left") { s = zoom; x = interpolate(t, [0, 1], [3, -3]); }
  else if (kb === "right") { s = zoom; x = interpolate(t, [0, 1], [-3, 3]); }
  else if (kb === "up") { s = zoom; y = interpolate(t, [0, 1], [3, -3]); }
  else if (kb === "down") { s = zoom; y = interpolate(t, [0, 1], [-3, 3]); }
  const len = CLIP_LENS[src];
  const need = D / fps;
  const effRate = len ? Math.min(rate, Math.max(0.35, ((len - start) * 0.985) / need)) : rate;
  const endF = len ? Math.max(0, Math.floor((((len - start) * 0.97) / effRate) * fps) - 1) : Infinity;
  const common: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
    transform: `scale(${s}) translate(${x}%, ${y}%)`, filter,
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {isVideo(src) ? (
        len && f >= endF ? (
          <Freeze frame={endF}><OffthreadVideo src={asset(src)} startFrom={Math.round(start * fps)} playbackRate={effRate} muted={muted} style={common} /></Freeze>
        ) : (
          <OffthreadVideo src={asset(src)} startFrom={Math.round(start * fps)} playbackRate={effRate} muted={muted} style={common} />
        )
      ) : (
        <Img src={asset(src)} style={common} />
      )}
    </AbsoluteFill>
  );
};
