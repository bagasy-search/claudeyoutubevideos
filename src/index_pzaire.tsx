import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZAIRE, TOTAL_FRAMES_PZAIRE } from "./pzaire/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzaire" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZAIRE} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZAIRE }} />
  </>
);
registerRoot(Root);
