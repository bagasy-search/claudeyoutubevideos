// Entry fumoscasf (VLOG CONTINUO 100 % agnes: voz en off Fish sobre planos agnes-video-v2.0)
// + la capa de AVATAR (Claudio a cámara, RunPod InfiniteTalk: public/avatar_clips/fumoscasf/reel30.mp4)
// + 12 componentes encima (src/fumoscasf/ov.json). Mudo: la mezcla final (out/fumoscasf_mix.wav) la pone encfin.
// ENTRY=src/index_fumoscasf.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ClBookPage, ClQRCard, ClCheck } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClFlyCycle, ClDrainFactory } from "./claudio/ClFruta";
import { ClFlyDoor, ClLemon10, ClTapeHigh, ClMoscasMap } from "./claudio/ClMoscas";
import OV from "./fumoscasf/ov.json";
import AV from "./fumoscasf/avwin.json";
import { TOTAL_FRAMES } from "./fumoscasf/total";
const C: Record<string, React.FC<any>> = { ClBookPage, ClQRCard, ClCheck, ClVideoRef, ClFlyCycle, ClDrainFactory, ClFlyDoor, ClLemon10, ClTapeHigh, ClMoscasMap };
// Una ventana de avatar: se muestra el recorte del reel que le toca (off + lag medido en avatar_post.py) con el
// acercamiento lento que usa ClMain (si el plano queda clavado, el detector de cuadros muertos lo marca).
const Av: React.FC<{ sf: number }> = ({ sf }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFEBE0" }}>
      <OffthreadVideo src={staticFile("avatar_clips/fumoscasf/reel30.mp4")} startFrom={sf} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.035 * (f / Math.max(1, d))})`, transformOrigin: "50% 38%" }} />
    </AbsoluteFill>
  );
};
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/fumoscasf/vlog.mp4")} muted />
    {((AV as any).win as { n: string; ms: number; me: number; off: number; lag?: number }[]).map((w, i) => (
      <Sequence key={"av" + i} from={Math.round(w.ms * 30)} durationInFrames={Math.round((w.me - w.ms) * 30)}>
        <Av sf={Math.max(0, Math.round((w.off + (w.lag || 0)) * 30))} />
      </Sequence>
    ))}
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Fumoscasf" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
