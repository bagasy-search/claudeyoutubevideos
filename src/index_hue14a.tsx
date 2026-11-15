import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHue14a, TOTAL_FRAMES_HUE14A } from "./hue14a/Main";

const Root: React.FC = () => (
  <Composition id="Hue14a" component={MainHue14a}
    durationInFrames={TOTAL_FRAMES_HUE14A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
