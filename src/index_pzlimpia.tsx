import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZLIMPIA, TOTAL_FRAMES_PZLIMPIA } from "./pzlimpia/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzlimpia" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZLIMPIA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZLIMPIA }} />
  </>
);
registerRoot(Root);
