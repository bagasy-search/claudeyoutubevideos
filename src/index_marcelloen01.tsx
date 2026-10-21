import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./marcelloen01/Min1";
import { Full, FULL_FRAMES } from "./marcelloen01/Rest";
const Root = () => (
  <>
    <Composition id="Marcelloen01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Marcelloen01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
