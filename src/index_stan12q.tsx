import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan, TOTAL_FRAMES_STAN } from "./stan/Main";

const Root: React.FC = () => (
  <Composition id="Stan12q" component={MainStan} durationInFrames={TOTAL_FRAMES_STAN} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
