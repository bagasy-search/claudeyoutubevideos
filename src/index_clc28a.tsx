// Entry MÍNIMO solo-clc28a (farm). Uso: ENTRY=src/index_clc28a.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { ClMain } from "./claudio/ClMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./clc28a/timeline.gen";

const Main: React.FC = () => (
  <AbsoluteFill>
    <ClMain TL={TL} OV={OV} AUDIO={AUDIO} />
    <Sequence from={0} durationInFrames={1}><Img src={staticFile("img/clc28a/cuadro0.jpg")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }} /></Sequence>
  </AbsoluteFill>
);
const Root = () => <Composition id="Clc28a" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
