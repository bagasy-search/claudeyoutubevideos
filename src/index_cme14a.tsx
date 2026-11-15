import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme14a, TOTAL_FRAMES_CME14A } from "./cme14a/Main";

const Root: React.FC = () => (
  <Composition id="Cme14a" component={MainCme14a}
    durationInFrames={TOTAL_FRAMES_CME14A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
