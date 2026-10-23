import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES, MIN1_ALL } from "./tdccalor3/Full";
const Root = () => (
  <>
    <Composition id="Tdccalor3Min1" component={Full} durationInFrames={MIN1_ALL} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
