import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./cmehel3d/Min1";
const Root = () => (
  <>
    <Composition id="CmeHel3dMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
