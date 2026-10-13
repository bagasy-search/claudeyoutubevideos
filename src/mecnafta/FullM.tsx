// mecnafta · composition Full: lee edl.json (planos fijados) y arma AV (reel de RunPod), L/N (fotos), ST/AR (metraje), C (héroes).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Grade, Grain } from "./Base";
import { HEROES } from "./Scenes";
import EDL from "./edl.json";

const fr = (s: number) => Math.round(s * 30);
const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
type Sh = { s: number; e: number; k: string; src?: string; name?: string; ms?: number; off?: number };
const SH = (EDL as any).shots as Sh[];

const Still: React.FC<{ src: string; d: number; thumb?: boolean }> = ({ src, d, thumb }) => {
  const f = useCurrentFrame();
  const sc = 1.03 + 0.07 * f / Math.max(1, d);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {thumb && f < 18 ? <Img src={staticFile("img/mecnafta/th_card.jpg")} style={cover} /> :
        <AbsoluteFill style={{ transform: `scale(${sc})` }}><Img src={staticFile(`img/mecnafta/${src}.png`)} style={cover} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

export const FullM: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SH.map((s, i) => {
      const from = fr(s.s), d = fr(s.e) - fr(s.s);
      let body: React.ReactNode;
      if (s.k === "AV") {
        body = <OffthreadVideo src={staticFile("av/mecnafta_reel0.mp4")} startFrom={fr((s.off || 0) + (s.s - (s.ms || 0)))} muted style={cover} />;
      } else if (s.k === "L" || s.k === "N") {
        body = <Still src={s.src!} d={d} thumb={s.s === 0} />;
      } else if (s.k === "ST" || s.k === "AR") {
        body = <OffthreadVideo src={staticFile(`broll/mecnafta/${s.src}.mp4`)} volume={0.12} style={cover} />;
      } else if (s.k === "C") {
        const H = HEROES[s.name!];
        body = H ? H.el() : null;
      }
      return <Sequence key={i} from={from} durationInFrames={d}><AbsoluteFill>{body}</AbsoluteFill></Sequence>;
    })}
    <Audio src={staticFile("mecnaftacut.wav")} />
    <Grade warm={1} vig={0.25} />
    <Grain />
  </AbsoluteFill>
);
export const TOTAL_FRAMES = fr(943.53);
