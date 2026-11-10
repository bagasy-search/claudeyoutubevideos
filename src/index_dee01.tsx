import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainDee01, TOTAL_FRAMES_DEE01 } from "./dee/Main";

const Root: React.FC = () => (
  <Composition id="Dee01" component={MainDee01}
    durationInFrames={TOTAL_FRAMES_DEE01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
