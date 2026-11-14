import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12s, TOTAL_FRAMES_STAN12S } from "./stan12s/Main";

const Root: React.FC = () => (
  <Composition id="Stan12s" component={MainStan12s}
    durationInFrames={TOTAL_FRAMES_STAN12S} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
