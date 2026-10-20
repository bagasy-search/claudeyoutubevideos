import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, M1_FRAMES, FULL_FRAMES } from "./apex06v2/Main";
const Root = () => (
  <>
    <Composition id="AP6V2M1" component={Main} durationInFrames={M1_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP6V2" component={Main} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
  </>
);
registerRoot(Root);
