import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min2, MIN2_FRAMES } from "./suojos/Min2";

const Root: React.FC = () => (
  <Composition id="Min2" component={Min2} durationInFrames={MIN2_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
