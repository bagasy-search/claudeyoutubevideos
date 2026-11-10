import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFranco01, TOTAL_FRAMES_FRANCO01 } from "./franco/Main";

const Root: React.FC = () => (
  <Composition id="Franco01" component={MainFranco01}
    durationInFrames={TOTAL_FRAMES_FRANCO01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
