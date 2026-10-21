import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./ssimple6/Min1";
import { Rest, END } from "./ssimple6/Rest";
// el video entero: minuto 1 + el resto (mismo reloj global: los segundos son los de la locución)
const Full: React.FC = () => (useCurrentFrame() < MIN1_FRAMES ? <Min1 /> : <Rest />);
const Root = () => (
  <>
    <Composition id="Ssimple6Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Ssimple6" component={Full} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
