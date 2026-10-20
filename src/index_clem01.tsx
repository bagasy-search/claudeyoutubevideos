import React from "react";
import { Composition, registerRoot, Sequence } from "remotion";
import { Min1, MIN1_FRAMES } from "./clem01/Min1";
import { Rest, FULL_FRAMES } from "./clem01/Rest";
const Full = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence>
    <Rest />
  </>
);
const Root = () => (
  <>
    <Composition id="Clem01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Clem01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
