// Tramo 65-400 s de suojos. Tomas en src/suojos/min2_shots.json (segundos relativos a 65 s).
// AV = reel del avatar; ST = clips reales (public/broll/suojos/pxc_*.mp4); COMP = componente del kit repkit
// o héroe propio "La máquina" sobre foto real. Componentes dentro de Sequence con from=0 (tiempo local).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { CompView as CompRenderView } from "./CompRender";
import shots from "./min3_shots.json";

export const MIN3_SECONDS = 592;
export const MIN3_FRAMES = MIN3_SECONDS * 30;
export const MIN3_OFFSET_FRAMES = 400 * 30;

type Shot = { kind: "AV" | "ST" | "COMP"; from: number; to: number; src?: string; off?: number; name?: string; props?: any };

const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * 30], [1.0, 1.05], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

const Cover: React.FC<{ src: string; startFrom?: number }> = ({ src, startFrom = 0 }) => (
  <OffthreadVideo src={staticFile(src)} startFrom={Math.round(startFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);

const CompView: React.FC<{ s: Shot }> = ({ s }) => <CompRenderView name={s.name ?? ""} dur={s.to - s.from} p={s.props || {}} />;

const ShotView: React.FC<{ s: Shot }> = ({ s }) => {
  const dur = s.to - s.from;
  if (s.kind === "AV") return <Cover src="av/suojos_reel0_cfr.mp4" startFrom={s.off ?? 0} />;
  if (s.kind === "ST") return <Push dur={dur}><Cover src={s.src!} startFrom={0} /></Push>;
  return <CompView s={s} />;
};

export const Min3: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {(shots as Shot[]).map((s, i) => (
        <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)}>
          <ShotView s={s} />
        </Sequence>
      ))}
      <Audio src={staticFile("suojoscut.wav")} startFrom={MIN3_OFFSET_FRAMES} />
    </AbsoluteFill>
  );
};
