import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme14d, TOTAL_FRAMES_CME14D } from "./cme14d/Main";

const Root: React.FC = () => (
  <Composition id="Cme14d" component={MainCme14d}
    durationInFrames={TOTAL_FRAMES_CME14D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
