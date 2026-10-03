import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZFILTRO, TOTAL_FRAMES_PZFILTRO } from "./pzfiltro/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzfiltro" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZFILTRO} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZFILTRO }} />
  </>
);
registerRoot(Root);
