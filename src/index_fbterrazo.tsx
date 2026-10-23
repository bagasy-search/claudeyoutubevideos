import React from "react";
import { Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./fbterrazo/Min1";
import { Rest, FULL_FRAMES } from "./fbterrazo/Rest";
const Full: React.FC = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES}><Min1 /></Sequence>
    <Rest />
  </>
);
const Root = () => (
  <>
    <Composition id="FbterrazoMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FbterrazoFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
