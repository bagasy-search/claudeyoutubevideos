import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCerdonde, TOTAL_FRAMES_CERDONDE } from "./cerdonde/Main";

const Root: React.FC = () => (
  <Composition id="Cerdonde" component={MainCerdonde}
    durationInFrames={TOTAL_FRAMES_CERDONDE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
