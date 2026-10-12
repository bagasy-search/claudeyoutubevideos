import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./suojos/Full";

const Root: React.FC = () => (
  <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
