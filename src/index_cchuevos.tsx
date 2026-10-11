// Entry cchuevos (Claudio Cocina, VLOG CONTINUO mixto): el vlog armado y sin pausas (vid/cchuevos/vlog.mp4) + componentes encima (src/cchuevos/ov.json).
// Mudo: la mezcla final (out/cchuevos_mix.wav) la pone encfin.  ENTRY=src/index_cchuevos.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ClBookPage, ClQRCard, ClBeforeAfter, ClCheck } from "./claudio/ClCards";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClChip } from "./claudio/ClOverlays";
import { ClTimer30 } from "./claudio/ClGauges";
import { ClRecipeCard } from "./claudio/ClCocina";
import { ClEggThermo } from "./claudio/ClCocina2";
import { ClMenuBoard, ClOldPhoto } from "./claudio/ClIntro";
import OV from "./cchuevos/ov.json";
import { TOTAL_FRAMES } from "./cchuevos/total";
const C: Record<string, React.FC<any>> = { ClMenuBoard, ClOldPhoto, ClBookPage, ClQRCard, ClReceipt, ClBeforeAfter, ClCheck, ClVideoRef, ClChip, ClTimer30, ClEggThermo, ClRecipeCard };
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/cchuevos/vlog.mp4")} muted />
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Cchuevos" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
