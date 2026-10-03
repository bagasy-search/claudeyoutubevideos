import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZTERRA, TOTAL_FRAMES_PZTERRA } from "./pzterra/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzterra" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZTERRA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZTERRA }} />
  </>
);
registerRoot(Root);
