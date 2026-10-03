import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCCORTA, TOTAL_FRAMES_TDCCORTA } from "./tdccorta/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdccorta" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCCORTA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCCORTA }} />
  </>
);
registerRoot(Root);
