// jprefri · composición Full: lee edl.json (tiempos absolutos de la voz), AV = reel de RunPod (cover 16:9), L/N = fotos reales con empuje lento,
// ST/AR = metraje real (archivo y stock), C = héroes en capas, chip de capítulo al inicio de cada regla.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Hero } from "./Hero";
import EDL from "./edl.json";

const fr = (s: number) => Math.round(s * 30);
const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
type Sh = { a: number; b: number; k: string; src?: string; name?: string; ms?: number; off?: number; label?: string | null };
const SH = (EDL as any).shots as Sh[];
export const TOTAL_S = (EDL as any).end as number;

const Chip: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9, 95, 110], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, bottom: 80, opacity: op, background: "#C8102E", color: "#fff",
      fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 46, padding: "14px 26px", borderRadius: 8,
      boxShadow: "0 6px 18px rgba(0,0,0,.45)", letterSpacing: 0.5 }}>{text}</div>
  );
};

const Push: React.FC<{ src: string; d: number }> = ({ src, d }) => {
  const f = useCurrentFrame();
  const sc = 1.03 + 0.06 * Math.min(1, f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})` }}><Img src={staticFile(src)} style={cover} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile(src)} muted style={cover} />
  </AbsoluteFill>
);

export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SH.map((s, i) => {
      const from = fr(s.a), d = Math.max(1, fr(s.b) - fr(s.a));
      let body: React.ReactNode;
      if (s.k === "TH") {
        body = <AbsoluteFill><Img src={staticFile("img/jprefri/th_card.jpg")} style={cover} /></AbsoluteFill>;
      } else if (s.k === "AV") {
        body = (
          <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
            <OffthreadVideo src={staticFile("av/jprefri_reel0.mp4")} muted
              startFrom={fr((s.off || 0) + (s.a - (s.ms || 0)))}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} />
          </AbsoluteFill>
        );
      } else if (s.k === "L" || s.k === "N") {
        body = <Push src={`img/jprefri/${s.src}.png`} d={d} />;
      } else if (s.k === "ST" || s.k === "AR") {
        body = <Clip src={`broll/jprefri/${s.src}.mp4`} />;
      } else if (s.k === "C") {
        body = <Hero name={s.name!} d={d} />;
      }
      return (
        <Sequence key={i} from={from} durationInFrames={d}>
          <AbsoluteFill>{body}</AbsoluteFill>
          {s.label ? <Chip text={s.label} /> : null}
        </Sequence>
      );
    })}
    <Audio src={staticFile("jprefricut.wav")} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)", pointerEvents: "none" }} />
  </AbsoluteFill>
);
