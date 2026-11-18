import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme14c, TOTAL_FRAMES_CME14C } from "./cme14c/Main";

const Root: React.FC = () => (
  <Composition id="Cme14c" component={MainCme14c}
    durationInFrames={TOTAL_FRAMES_CME14C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
