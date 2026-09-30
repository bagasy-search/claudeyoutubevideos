import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCHINCA, TOTAL_FRAMES_TDCHINCA } from "./tdchinca/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdchinca" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCHINCA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCHINCA }} />
  </>
);
registerRoot(Root);
