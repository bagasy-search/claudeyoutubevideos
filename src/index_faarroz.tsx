import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFaarroz, TOTAL_FRAMES_FAARROZ } from "./faarroz/Main_faarroz";

const Root: React.FC = () => (
  <Composition id="Faarroz" component={MainFaarroz}
    durationInFrames={TOTAL_FRAMES_FAARROZ} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
