import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLcf11f, TOTAL_FRAMES_LCF11F } from "./lcf11f/Main";

const Root: React.FC = () => (
  <Composition id="Lcf11f" component={MainLcf11f}
    durationInFrames={TOTAL_FRAMES_LCF11F} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
