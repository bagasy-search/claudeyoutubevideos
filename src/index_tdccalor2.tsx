import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./tdccalor2/Min1";
import { Full, FULL_FRAMES } from "./tdccalor2/Full";
const Root = () => (
  <>
    <Composition id="Tdccalor2Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Tdccalor2" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
