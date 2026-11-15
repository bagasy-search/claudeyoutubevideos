import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCer14d, TOTAL_FRAMES_CER14D } from "./cer14d/Main";

const Root: React.FC = () => (
  <Composition id="Cer14d" component={MainCer14d}
    durationInFrames={TOTAL_FRAMES_CER14D} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
