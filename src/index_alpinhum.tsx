import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./alpinhum/Min1";
import { Full, FULL_FRAMES } from "./alpinhum/Rest";
const Root = () => (
  <>
    <Composition id="AlpinhumMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Alpinhum" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
