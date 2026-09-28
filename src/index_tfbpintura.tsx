import { Composition, registerRoot } from "remotion";
import React from "react";
import { TfbVlogMain } from "./tfb/TfbVlogMain";
import { DATA_TFBPINTURA, TOTAL_FRAMES_TFBPINTURA } from "./tfbpintura/timeline.gen";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbpintura" component={TfbVlogMain} durationInFrames={TOTAL_FRAMES_TFBPINTURA} fps={30} width={1920} height={1080}
      defaultProps={{ data: DATA_TFBPINTURA }} />
  </>
);
registerRoot(Root);
