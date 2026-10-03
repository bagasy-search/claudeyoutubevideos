import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCMILAVAD, TOTAL_FRAMES_TCMILAVAD } from "./tcmilavad/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tcmilavad" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCMILAVAD} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCMILAVAD }} />
  </>
);
registerRoot(Root);
