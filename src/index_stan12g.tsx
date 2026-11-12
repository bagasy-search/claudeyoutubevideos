import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12g, TOTAL_FRAMES_STAN12G } from "./stan12g/Main";

const Root: React.FC = () => (
  <Composition id="Stan12g" component={MainStan12g}
    durationInFrames={TOTAL_FRAMES_STAN12G} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
