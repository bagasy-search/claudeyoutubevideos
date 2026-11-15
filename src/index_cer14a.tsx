import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCer14a, TOTAL_FRAMES_CER14A } from "./cer14a/Main";

const Root: React.FC = () => (
  <Composition id="Cer14a" component={MainCer14a}
    durationInFrames={TOTAL_FRAMES_CER14A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
