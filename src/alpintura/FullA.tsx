// alpintura · composición Full: lee edl.json (tiempos ABSOLUTOS de la voz, fps 30).
// AV = reel de RunPod (av/alpintura_reel0.mp4, startFrom = off + (t - ms)); L/N = fotos con movimiento;
// ST = metraje real (broll/alpintura/sNNN.mp4); C = héroes (New.tsx), renderizados con frame absoluto.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Grade, Grain, FPS } from "./Base";
import { HERO_SCENES } from "./New";
import EDL from "./edl.json";
// lipLeadSec 0.05 (medido 13-oct: boca abre 2,32 s, audio 2,36 s): el reel se retrasa 0.05 s
const LIP_LEAD_SEC = 0.05;

const fr = (s: number) => Math.round(s * FPS);
const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
type Sh = { s: number; e: number; k: string; src?: string; name?: string; off?: number; ms?: number };
const SH = (EDL as any).shots as Sh[];

const Still: React.FC<{ src: string; d: number }> = ({ src, d }) => {
  const f = useCurrentFrame();
  const sc = 1.03 + 0.07 * f / Math.max(1, d);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})` }}><Img src={staticFile(`img/alpintura/${src}.png`)} style={cover} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FullA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SH.map((s, i) => {
        if (s.k === "C") {
          const H = HERO_SCENES.find((h) => h.name === s.name);
          const from = fr(s.s), d = fr(s.e) - from;
          if (!H || f < from || f >= from + d) return null;
          const Comp = H.C as React.FC<{ a: number; d: number }>;
          return <AbsoluteFill key={i}><Comp a={H.a} d={H.d} /></AbsoluteFill>;
        }
        const from = fr(s.s), d = fr(s.e) - from;
        let body: React.ReactNode = null;
        if (s.k === "AV") {
          body = <OffthreadVideo src={staticFile("av/alpintura_reel0.mp4")} startFrom={fr((s.off || 0) + (s.s - (s.ms || 0)) - LIP_LEAD_SEC)} style={cover} />;
        } else if (s.k === "L" || s.k === "N") {
          body = <Still src={s.src!} d={d} />;
        } else if (s.k === "ST") {
          body = <OffthreadVideo src={staticFile(`broll/alpintura/${s.src}.mp4`)} muted style={cover} />;
        }
        return <Sequence key={i} from={from} durationInFrames={d}><AbsoluteFill>{body}</AbsoluteFill></Sequence>;
      })}
      <Audio src={staticFile("alpintura_mix.mp3")} />
      <Grade warm={1} vig={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};
export const TOTAL_FRAMES = fr((EDL as any).end);
