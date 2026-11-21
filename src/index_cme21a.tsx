import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme21a, TOTAL_FRAMES_CME21A } from "./cme21a/Main";

const Root: React.FC = () => (
  <Composition id="Cme21a" component={MainCme21a}
    durationInFrames={TOTAL_FRAMES_CME21A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
