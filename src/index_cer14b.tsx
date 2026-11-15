import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCer14b, TOTAL_FRAMES_CER14B } from "./cer14b/Main";

const Root: React.FC = () => (
  <Composition id="Cer14b" component={MainCer14b}
    durationInFrames={TOTAL_FRAMES_CER14B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
