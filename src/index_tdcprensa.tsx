import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCPRENSA, TOTAL_FRAMES_TDCPRENSA } from "./tdcprensa/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdcprensa" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCPRENSA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCPRENSA }} />
  </>
);
registerRoot(Root);
