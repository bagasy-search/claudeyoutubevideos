import { Composition, registerRoot } from "remotion";
import React from "react";
import { TdcVlogMain } from "./tdc/TdcVlogMain";
import { DATA_TDCHACHA, TOTAL_FRAMES_TDCHACHA } from "./tdchacha/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tdchacha" component={TdcVlogMain} durationInFrames={TOTAL_FRAMES_TDCHACHA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TDCHACHA }} />
  </>
);
registerRoot(Root);
