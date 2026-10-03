import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZNOARRANCA, TOTAL_FRAMES_PZNOARRANCA } from "./pznoarranca/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pznoarranca" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZNOARRANCA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZNOARRANCA }} />
  </>
);
registerRoot(Root);
