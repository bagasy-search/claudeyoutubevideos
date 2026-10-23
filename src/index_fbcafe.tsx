import React from "react";
import { Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./fbcafe/Min1";
import { Rest, FULL_FRAMES } from "./fbcafe/Rest";
const Full: React.FC = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES}><Min1 /></Sequence>
    <Rest />
  </>
);
const Root = () => (
  <>
    <Composition id="FbcafeMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FbcafeFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
