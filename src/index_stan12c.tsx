import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12c, TOTAL_FRAMES_STAN12C } from "./stan12c/Main";

const Root: React.FC = () => (
  <Composition id="Stan12c" component={MainStan12c}
    durationInFrames={TOTAL_FRAMES_STAN12C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
