import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12l, TOTAL_FRAMES_STAN12L } from "./stan12l/Main";

const Root: React.FC = () => (
  <Composition id="Stan12l" component={MainStan12l}
    durationInFrames={TOTAL_FRAMES_STAN12L} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
