import React from "react";
import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END } from "./tialicha01/Min1";
import { Rest, END_T } from "./tialicha01/Rest";
const Full: React.FC = () => (useCurrentFrame() / 30 < MIN1_END ? <Min1 /> : <Rest />);
const Root = () => (
  <>
    <Composition id="Tialicha01Full" component={Full} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Tialicha01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
