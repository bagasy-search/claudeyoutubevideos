import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPin21b, TOTAL_FRAMES_PIN21B } from "./pin21b/Main";

const Root: React.FC = () => (
  <Composition id="Pin21b" component={MainPin21b}
    durationInFrames={TOTAL_FRAMES_PIN21B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
