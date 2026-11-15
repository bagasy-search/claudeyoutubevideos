import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme14b, TOTAL_FRAMES_CME14B } from "./cme14b/Main";

const Root: React.FC = () => (
  <Composition id="Cme14b" component={MainCme14b}
    durationInFrames={TOTAL_FRAMES_CME14B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
