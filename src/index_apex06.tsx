import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./apex06/Full";
const Root = () => (
  <>
    <Composition id="AP6FULL" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
  </>
);
registerRoot(Root);
