// Entry MÍNIMO solo-clc28c (farm). Uso: ENTRY=src/index_clc28c.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { ClMain } from "./claudio/ClMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./clc28c/timeline.gen";

const Main: React.FC = () => (
  <AbsoluteFill>
    <ClMain TL={TL} OV={OV} AUDIO={AUDIO} />
    <Sequence from={0} durationInFrames={1}><Img src={staticFile("img/clc28c/cuadro0.jpg")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }} /></Sequence>
  </AbsoluteFill>
);
const Root = () => <Composition id="Clc28c" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
