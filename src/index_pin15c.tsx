import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPin15c, TOTAL_FRAMES_PIN15C } from "./pin15c/Main";

const Root: React.FC = () => (
  <Composition id="Pin15c" component={MainPin15c}
    durationInFrames={TOTAL_FRAMES_PIN15C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
