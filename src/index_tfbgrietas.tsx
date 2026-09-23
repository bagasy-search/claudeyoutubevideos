import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTfbgrietas, TOTAL_FRAMES_TFBGRIETAS } from "./tfbgrietas/Main_tfbgrietas";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbgrietas" component={MainTfbgrietas} durationInFrames={TOTAL_FRAMES_TFBGRIETAS}
      fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
