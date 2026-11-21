import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainAlb21a, TOTAL_FRAMES_ALB21A } from "./alb21a/Main";

const Root: React.FC = () => (
  <Composition id="Alb21a" component={MainAlb21a}
    durationInFrames={TOTAL_FRAMES_ALB21A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
