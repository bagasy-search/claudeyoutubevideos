// Entry fumoscasf (VLOG CONTINUO, 100 % agnes: voz en off Fish + planos agnes-video-v2.0): el vlog armado (vid/fumoscasf/vlog.mp4)
// + 8 componentes encima (src/fumoscasf/ov.json). Mudo: la mezcla final (out/fumoscasf_mix.wav) la pone encfin.
// ENTRY=src/index_fumoscasf.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ClBookPage, ClQRCard, ClCheck } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClFlyCycle, ClDrainFactory } from "./claudio/ClFruta";
import OV from "./fumoscasf/ov.json";
import { TOTAL_FRAMES } from "./fumoscasf/total";
const C: Record<string, React.FC<any>> = { ClBookPage, ClQRCard, ClCheck, ClVideoRef, ClFlyCycle, ClDrainFactory };
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/fumoscasf/vlog.mp4")} muted />
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Fumoscasf" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
