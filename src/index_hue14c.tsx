import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHue14c, TOTAL_FRAMES_HUE14C } from "./hue14c/Main";

const Root: React.FC = () => (
  <Composition id="Hue14c" component={MainHue14c}
    durationInFrames={TOTAL_FRAMES_HUE14C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
