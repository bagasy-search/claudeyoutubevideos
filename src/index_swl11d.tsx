import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSwl11d, TOTAL_FRAMES_SWL11D } from "./swl11d/Main";

const Root: React.FC = () => (
  <Composition id="Swl11d" component={MainSwl11d}
    durationInFrames={TOTAL_FRAMES_SWL11D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
