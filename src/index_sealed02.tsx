import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./sealed02/Full";
import { Min1, MIN1_FRAMES } from "./sealed02/Min1";
import { Min2, MIN2_FRAMES } from "./sealed02/Min2";
const Root = () => (
  <>
    <Composition id="Sealed02Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Sealed02Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Sealed02Min2" component={Min2} durationInFrames={MIN2_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
