import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PLDESTAPA, TOTAL_FRAMES_PLDESTAPA } from "./pldestapa/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pldestapa" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PLDESTAPA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PLDESTAPA }} />
  </>
);
registerRoot(Root);
