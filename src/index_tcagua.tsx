import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCAGUA, TOTAL_FRAMES_TCAGUA } from "./tcagua/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tcagua" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCAGUA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCAGUA }} />
  </>
);
registerRoot(Root);
