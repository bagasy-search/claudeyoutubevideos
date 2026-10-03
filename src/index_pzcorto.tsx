import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZCORTO, TOTAL_FRAMES_PZCORTO } from "./pzcorto/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzcorto" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZCORTO} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZCORTO }} />
  </>
);
registerRoot(Root);
