import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12h, TOTAL_FRAMES_STAN12H } from "./stan12h/Main";

const Root: React.FC = () => (
  <Composition id="Stan12h" component={MainStan12h}
    durationInFrames={TOTAL_FRAMES_STAN12H} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
