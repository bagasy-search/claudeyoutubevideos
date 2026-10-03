import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCLAVAD, TOTAL_FRAMES_TCLAVAD } from "./tclavad/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tclavad" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCLAVAD} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCLAVAD }} />
  </>
);
registerRoot(Root);
