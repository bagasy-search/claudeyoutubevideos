import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END } from "./chcarnitas/Min1";
import { useCurrentFrame } from "remotion";
import { Rest, END_T } from "./chcarnitas/Rest";
const Full: React.FC = () => (useCurrentFrame() / 30 < MIN1_END ? <Min1 /> : <Rest />);
const Root = () => (
  <>
    <Composition id="ChcarnitasFull" component={Full} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
    <Composition id="ChcarnitasMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
