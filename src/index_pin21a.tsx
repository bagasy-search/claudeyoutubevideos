import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPin21a, TOTAL_FRAMES_PIN21A } from "./pin21a/Main";

const Root: React.FC = () => (
  <Composition id="Pin21a" component={MainPin21a}
    durationInFrames={TOTAL_FRAMES_PIN21A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
