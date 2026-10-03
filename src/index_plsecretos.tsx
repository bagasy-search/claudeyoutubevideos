import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_PLSECRETOS, TOTAL_FRAMES_PLSECRETOS } from "./plsecretos/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Plsecretos" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_PLSECRETOS} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_PLSECRETOS }} />
  </>
);
registerRoot(Root);
