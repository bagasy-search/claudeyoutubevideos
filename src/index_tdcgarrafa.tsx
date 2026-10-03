import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCGARRAFA, TOTAL_FRAMES_TDCGARRAFA } from "./tdcgarrafa/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdcgarrafa" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCGARRAFA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCGARRAFA }} />
  </>
);
registerRoot(Root);
