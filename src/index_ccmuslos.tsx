// Entry ccmuslos (Claudio Cocina, VLOG CONTINUO mixto): el vlog armado y sin pausas (vid/ccmuslos/vlog.mp4) + componentes encima (src/ccmuslos/ov.json).
// Mudo: la mezcla final (out/ccmuslos_mix.wav) la pone encfin.  ENTRY=src/index_ccmuslos.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ClBookPage, ClQRCard, ClBeforeAfter, ClCheck } from "./claudio/ClCards";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClChip } from "./claudio/ClOverlays";
import { ClTimer30 } from "./claudio/ClGauges";
import { ClSkinLayers, ClRecipeCard } from "./claudio/ClCocina";
import { ClMenuBoard, ClOldPhoto } from "./claudio/ClIntro";
import OV from "./ccmuslos/ov.json";
import { TOTAL_FRAMES } from "./ccmuslos/total";
const C: Record<string, React.FC<any>> = { ClMenuBoard, ClOldPhoto, ClBookPage, ClQRCard, ClReceipt, ClBeforeAfter, ClCheck, ClVideoRef, ClChip, ClTimer30, ClSkinLayers, ClRecipeCard };
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/ccmuslos/vlog.mp4")} muted />
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Ccmuslos" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
