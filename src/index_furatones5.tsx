// Entry furatones5 (VLOG CONTINUO, 100 % agnes 2.5-flash): el vlog armado (vid/furatones5/vlog.mp4) + 9 componentes encima (src/furatones5/ov.json).
// Mudo: la mezcla final (out/furatones5_mix.wav) la pone encfin.  ENTRY=src/index_furatones5.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ClCasa5 } from "./claudio/ClCasa5";
import { ClBookPage, ClQRCard } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClChip } from "./claudio/ClOverlays";
import OV from "./furatones5/ov.json";
import { TOTAL_FRAMES } from "./furatones5/total";
const C: Record<string, React.FC<any>> = { ClCasa5, ClBookPage, ClQRCard, ClVideoRef, ClChip };
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/furatones5/vlog.mp4")} muted />
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Furatones5" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
