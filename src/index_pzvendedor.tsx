import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PZVENDEDOR, TOTAL_FRAMES_PZVENDEDOR } from "./pzvendedor/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Pzvendedor" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PZVENDEDOR} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PZVENDEDOR }} />
  </>
);
registerRoot(Root);
