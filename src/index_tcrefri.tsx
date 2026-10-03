import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCREFRI, TOTAL_FRAMES_TCREFRI } from "./tcrefri/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tcrefri" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCREFRI} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCREFRI }} />
  </>
);
registerRoot(Root);
