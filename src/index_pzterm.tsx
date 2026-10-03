import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZTERM, TOTAL_FRAMES_PZTERM } from "./pzterm/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzterm" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZTERM} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZTERM }} />
  </>
);
registerRoot(Root);
