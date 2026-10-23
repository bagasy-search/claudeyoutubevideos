import React from "react";
import { Composition, registerRoot, Sequence, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./wade02/Min1";
import { Rest, FULL_FRAMES } from "./wade02/Rest";
import { WallWorld } from "./wade02/wall3d";
const Full = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence>
    <Rest />
  </>
);
// sólo para stills del mundo 3D: el cuadro N = segundo N/30 de la voz
const WorldOnly = () => <WallWorld t={useCurrentFrame() / 30} />;
const Root = () => (
  <>
    <Composition id="Wade02Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Wade02Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Wade02World" component={WorldOnly} durationInFrames={28157} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
