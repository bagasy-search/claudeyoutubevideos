import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZTANQUE, TOTAL_FRAMES_PZTANQUE } from "./pztanque/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pztanque" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZTANQUE} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZTANQUE }} />
  </>
);
registerRoot(Root);
