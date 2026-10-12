import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min3, MIN3_FRAMES } from "./suojos/Min3";

const Root: React.FC = () => (
  <Composition id="Min3" component={Min3} durationInFrames={MIN3_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
