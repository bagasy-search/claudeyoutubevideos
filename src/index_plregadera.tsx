import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PLREGADERA, TOTAL_FRAMES_PLREGADERA } from "./plregadera/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Plregadera" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PLREGADERA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PLREGADERA }} />
  </>
);
registerRoot(Root);
