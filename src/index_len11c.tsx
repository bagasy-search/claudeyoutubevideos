import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLen11, TOTAL_FRAMES_LEN11 } from "./len11/Main";

const Root: React.FC = () => (
  <Composition id="Len11c" component={MainLen11}
    durationInFrames={TOTAL_FRAMES_LEN11} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
