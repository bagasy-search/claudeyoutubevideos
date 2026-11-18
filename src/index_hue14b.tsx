import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHue14b, TOTAL_FRAMES_HUE14B } from "./hue14b/Main";

const Root: React.FC = () => (
  <Composition id="Hue14b" component={MainHue14b}
    durationInFrames={TOTAL_FRAMES_HUE14B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
