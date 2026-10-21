import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./keikoes01/Min1";
import { Resto, FULL_FRAMES } from "./keikoes01/Resto";
// el video entero: el minuto 1 hasta 98,6 s y después el resto, en la MISMA línea de tiempo (sin Sequence: los cuadros son globales)
const Full: React.FC = () => (useCurrentFrame() < MIN1_FRAMES ? <Min1 /> : <Resto />);
const Root = () => (
  <>
    <Composition id="Keikoes01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Keikoes01" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
