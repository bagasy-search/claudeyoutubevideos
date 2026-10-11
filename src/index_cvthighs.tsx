// Entry cvthighs (Claudio Vaquero EN, VLOG CONTINUO agnes 2.5-flash + stock real): el vlog armado (vid/cvthighs/vlog.mp4)
// + componentes encima (src/cvthighs/ov.json, de vlog/cv/mkov.py). Mudo: la mezcla final la pone encfin.  ENTRY=src/index_cvthighs.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClCheck, ClBookPage, ClQRCard, ClDoDont } from "./claudio/ClCards";
import { ClTimer30 } from "./claudio/ClGauges";
import { ClChip } from "./claudio/ClOverlays";
import { CvMeatThermo } from "./claudio/CvVaquero";
import OV from "./cvthighs/ov.json";
import { TOTAL_FRAMES } from "./cvthighs/total";
const C: Record<string, React.FC<any>> = { ClReceipt, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClTimer30, ClChip, CvMeatThermo };
const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("vid/cvthighs/vlog.mp4")} muted />
    {(OV as any[]).map((o, i) => { const K = C[o.c]; return <Sequence key={i} from={o.from} durationInFrames={o.dur}><K {...o.props} /></Sequence>; })}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Cvcabbage" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />);
