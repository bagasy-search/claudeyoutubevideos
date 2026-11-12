import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12d, TOTAL_FRAMES_STAN12D } from "./stan12d/Main";

const Root: React.FC = () => (
  <Composition id="Stan12d" component={MainStan12d}
    durationInFrames={TOTAL_FRAMES_STAN12D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
