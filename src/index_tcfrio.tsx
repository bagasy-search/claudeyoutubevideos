import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TCFRIO, TOTAL_FRAMES_TCFRIO } from "./tcfrio/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tcfrio" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TCFRIO} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TCFRIO }} />
  </>
);
registerRoot(Root);
