import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCBARATAS, TOTAL_FRAMES_TCBARATAS } from "./tcbaratas/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tcbaratas" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCBARATAS} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCBARATAS }} />
  </>
);
registerRoot(Root);
