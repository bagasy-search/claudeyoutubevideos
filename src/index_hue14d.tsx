import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHue14d, TOTAL_FRAMES_HUE14D } from "./hue14d/Main";

const Root: React.FC = () => (
  <Composition id="Hue14d" component={MainHue14d}
    durationInFrames={TOTAL_FRAMES_HUE14D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
