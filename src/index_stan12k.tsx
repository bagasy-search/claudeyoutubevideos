import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12k, TOTAL_FRAMES_STAN12K } from "./stan12k/Main";

const Root: React.FC = () => (
  <Composition id="Stan12k" component={MainStan12k}
    durationInFrames={TOTAL_FRAMES_STAN12K} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
