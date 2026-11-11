import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLor, TOTAL_FRAMES_LOR } from "./lor/Main";

const Root: React.FC = () => (
  <Composition id="Swl11a" component={MainLor}
    durationInFrames={TOTAL_FRAMES_LOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
