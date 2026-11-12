import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLcf11d, TOTAL_FRAMES_LCF11D } from "./lcf11d/Main";

const Root: React.FC = () => (
  <Composition id="Lcf11d" component={MainLcf11d}
    durationInFrames={TOTAL_FRAMES_LCF11D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
