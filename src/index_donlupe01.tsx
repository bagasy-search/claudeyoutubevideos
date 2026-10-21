import React from "react";
import { AbsoluteFill, Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./donlupe01/Min1";
import { Rest, TOTAL_FRAMES } from "./donlupe01/Rest";
// el video entero: minuto 1 y el resto en la misma línea de tiempo (Rest va sin Sequence: usa el cuadro absoluto, así sus Sequence del reel y los clips caen en su lugar)
const Full: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence>
    <Rest />
  </AbsoluteFill>
);
const Root = () => (
  <>
    <Composition id="DonLupe01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="DonLupe01" component={Full} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
