import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCer25, TOTAL_FRAMES_CER25 } from "./cer25/Main";

const Root: React.FC = () => (
  <Composition id="Cer25" component={MainCer25}
    durationInFrames={TOTAL_FRAMES_CER25} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
