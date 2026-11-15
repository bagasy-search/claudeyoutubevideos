import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCer14c, TOTAL_FRAMES_CER14C } from "./cer14c/Main";

const Root: React.FC = () => (
  <Composition id="Cer14c" component={MainCer14c}
    durationInFrames={TOTAL_FRAMES_CER14C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
