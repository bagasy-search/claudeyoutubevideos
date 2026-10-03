import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PLINODORO, TOTAL_FRAMES_PLINODORO } from "./plinodoro/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Plinodoro" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PLINODORO} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PLINODORO }} />
  </>
);
registerRoot(Root);
