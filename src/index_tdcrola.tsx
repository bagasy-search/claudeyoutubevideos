import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCROLA, TOTAL_FRAMES_TDCROLA } from "./tdcrola/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdcrola" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCROLA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCROLA }} />
  </>
);
registerRoot(Root);
