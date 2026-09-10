import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTfbsifon, TOTAL_FRAMES_TFBSIFON } from "./tfbsifon/Main_tfbsifon";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbsifon" component={MainTfbsifon} durationInFrames={TOTAL_FRAMES_TFBSIFON}
      fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
