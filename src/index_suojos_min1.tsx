import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./suojos/Min1";

const Root: React.FC = () => (
  <Composition id="Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
