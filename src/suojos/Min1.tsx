// Minuto 1 (0-65 s) de suojos. Tomas en src/suojos/min1_shots.json (segundos absolutos de la voz cortada).
// AV = reel del avatar (public/av/suojos_reel0_cfr.mp4) con el offset de su ventana; WOW/ST = clips reales
// de public/broll/suojos; IMG = foto real (N/L); SEAL = componente SealDoor del kit repkit sobre foto real.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { SealDoor } from "../repkit/Kit";
import shots from "./min1_shots.json";

export const MIN1_SECONDS = 65;
export const MIN1_FRAMES = MIN1_SECONDS * 30;

type Shot = { from: number; to: number; kind: "TH" | "WOW" | "ST" | "IMG" | "AV" | "SEAL"; src?: string; off?: number; chip?: string; chipDur?: number };

// empuje de cámara lento (motivado hacia el centro de la toma), sin CSS dibujado
const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * 30], [1.0, 1.06], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

const Cover: React.FC<{ src: string; startFrom?: number }> = ({ src, startFrom = 0 }) => (
  <OffthreadVideo src={staticFile(src)} startFrom={Math.round(startFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);

const NameChip: React.FC<{ txt: string; secs: number }> = ({ txt, secs }) => {
  const f = useCurrentFrame();
  if (f >= secs * 30) return null;
  return (
    <div style={{ position: "absolute", left: 80, bottom: 90, background: "#FFFDF4", color: "#111", fontSize: 44, fontWeight: 800, padding: "12px 28px", borderRadius: 10 }}>
      {txt}
    </div>
  );
};

const ShotView: React.FC<{ s: Shot }> = ({ s }) => {
  const dur = s.to - s.from;
  if (s.kind === "AV") return (
    <>
      <Cover src="av/suojos_reel0_cfr.mp4" startFrom={s.off ?? 0} />
      {s.chip ? <NameChip txt={s.chip} secs={s.chipDur ?? 3} /> : null}
    </>
  );
  if (s.kind === "SEAL") return (
    <SealDoor from={0} dur={dur} bg={s.src!} tStamp={1.6} tPush={20} win={[50, 60]} />
  );
  if (s.kind === "IMG" || s.kind === "TH")
    return <Push dur={dur}><Img src={staticFile(s.src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Push>;
  return <Push dur={dur}><Cover src={s.src!} startFrom={s.off ?? 0} /></Push>;
};

export const Min1: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {(shots as Shot[]).map((s, i) => (
        <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)}>
          <ShotView s={{ ...s }} />
        </Sequence>
      ))}
      <Audio src={staticFile("suojoscut.wav")} />
    </AbsoluteFill>
  );
};
